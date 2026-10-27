param(
    [ValidateSet('direct', 'hidden', 'restore')]
    [string]$Mode = 'direct',
    [string]$Out,
    [string]$TitleMatch = 'DeepSeek Harness',
    [int]$HideDelayMs = 350
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type -TypeDefinition @"
using System;
using System.Text;
using System.Runtime.InteropServices;

public static class DshCapture {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc cb, IntPtr lParam);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetClassName(IntPtr hWnd, StringBuilder text, int count);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr hWnd, IntPtr after, int x, int y, int cx, int cy, uint flags);
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool SetProcessDpiAwarenessContext(IntPtr value);
    [DllImport("shcore.dll")] public static extern int SetProcessDpiAwareness(int value);
    [DllImport("dwmapi.dll")] public static extern int DwmFlush();

    public struct RECT { public int Left, Top, Right, Bottom; }

    public static void EnableDpi() {
        try { SetProcessDpiAwarenessContext(new IntPtr(-4)); return; } catch { }
        try { if (SetProcessDpiAwareness(2) == 0) return; } catch { }
        try { SetProcessDPIAware(); } catch { }
    }

    public static IntPtr FindWindow(string titleMatch) {
        IntPtr best = IntPtr.Zero;
        long bestScore = -1;
        EnumWindows(delegate(IntPtr h, IntPtr l) {
            StringBuilder title = new StringBuilder(512);
            GetWindowText(h, title, 512);
            if (title.Length == 0) return true;
            if (titleMatch.Length > 0 && title.ToString().IndexOf(titleMatch, StringComparison.OrdinalIgnoreCase) < 0) return true;
            StringBuilder cls = new StringBuilder(256);
            GetClassName(h, cls, 256);
            if (cls.ToString() != "Chrome_WidgetWin_1") return true;
            RECT r;
            GetWindowRect(h, out r);
            long area = (long)(r.Right - r.Left) * (r.Bottom - r.Top);
            if (area < 10000) return true;
            long score = area * (IsWindowVisible(h) ? 2 : 1);
            if (score > bestScore) { bestScore = score; best = h; }
            return true;
        }, IntPtr.Zero);
        return best;
    }

    public static bool Hide(IntPtr hWnd) {
        return ShowWindow(hWnd, 0);
    }

    public static void BringToFront(IntPtr hWnd) {
        if (IsIconic(hWnd)) ShowWindow(hWnd, 9);
        else ShowWindow(hWnd, 5);
        SetWindowPos(hWnd, new IntPtr(-1), 0, 0, 0, 0, 0x0001 | 0x0002 | 0x0040);
        SetForegroundWindow(hWnd);
    }

    public static void DropTopmost(IntPtr hWnd) {
        SetWindowPos(hWnd, new IntPtr(-2), 0, 0, 0, 0, 0x0001 | 0x0002);
    }

    public static void ShowRestore(IntPtr hWnd, bool wasIconic) {
        ShowWindow(hWnd, 5);
        if (wasIconic) ShowWindow(hWnd, 9);
        SetForegroundWindow(hWnd);
    }
}
"@

[DshCapture]::EnableDpi() | Out-Null

$hwnd = [DshCapture]::FindWindow($TitleMatch)
if ($hwnd -eq [IntPtr]::Zero) {
    throw "DSH window not found (title match: $TitleMatch)"
}

if ($Mode -eq 'restore') {
    [DshCapture]::ShowRestore($hwnd, [DshCapture]::IsIconic($hwnd))
    Write-Output 'ok|restore'
    exit 0
}

if ([string]::IsNullOrWhiteSpace($Out)) {
    throw 'Out is required for capture modes'
}

$screen = [System.Windows.Forms.Screen]::FromHandle($hwnd)
if ($null -eq $screen) {
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen
}
$bounds = $screen.Bounds
$wasIconic = [DshCapture]::IsIconic($hwnd)
$hidden = $false
$raised = $false

try {
    if ($Mode -eq 'hidden') {
        [DshCapture]::Hide($hwnd) | Out-Null
        $hidden = $true
        Start-Sleep -Milliseconds $HideDelayMs
        [DshCapture]::DwmFlush() | Out-Null
    } else {
        [DshCapture]::BringToFront($hwnd)
        $raised = $true
        Start-Sleep -Milliseconds 300
        [DshCapture]::DwmFlush() | Out-Null
    }

    $bitmap = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
    try {
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
        } finally {
            $graphics.Dispose()
        }
        $directory = [System.IO.Path]::GetDirectoryName($Out)
        if ($directory -and -not (Test-Path -LiteralPath $directory)) {
            New-Item -ItemType Directory -Path $directory -Force | Out-Null
        }
        $bitmap.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
        $bitmap.Dispose()
    }
} finally {
    if ($hidden) {
        [DshCapture]::ShowRestore($hwnd, $wasIconic)
    } elseif ($raised) {
        [DshCapture]::DropTopmost($hwnd) | Out-Null
        [DshCapture]::SetForegroundWindow($hwnd) | Out-Null
    }
}

Write-Output ("ok|" + $Mode + "|" + $bounds.Left + "," + $bounds.Top + "," + $bounds.Width + "x" + $bounds.Height)
