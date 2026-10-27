import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile, unlink, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const CAPTURE_SCRIPT = join(HERE, 'capture-screen.ps1');
const COPY_SCRIPT = join(HERE, 'copy-image.ps1');
const POWERSHELL = join(
  process.env.SystemRoot ?? 'C:\\Windows',
  'System32',
  'WindowsPowerShell',
  'v1.0',
  'powershell.exe',
);
const MAX_BODY_BYTES = 64 * 1024 * 1024;

export const name = 'dsh-wechat-screenshot';
export const inject = ['webServer'];

function sendJson(response, status, value) {
  const body = Buffer.from(JSON.stringify(value), 'utf8');
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': String(body.length),
    'cache-control': 'no-store',
  });
  response.end(body);
}

function sendPng(response, buffer) {
  response.writeHead(200, {
    'content-type': 'image/png',
    'content-length': String(buffer.length),
    'cache-control': 'no-store',
  });
  response.end(buffer);
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('request body is too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readJson(request) {
  const body = await readBody(request);
  if (body.length === 0) return {};
  try {
    return JSON.parse(body.toString('utf8'));
  } catch {
    throw new Error('request body must be JSON');
  }
}

function windowsOnly() {
  if (process.platform !== 'win32') throw new Error('screen capture is only implemented for Windows');
}

function requireClient(request) {
  if (request.headers['x-dsh-screenshot'] === '1') return;
  const referer = request.headers.referer;
  if (typeof referer === 'string') {
    try {
      const url = new URL(referer);
      if (url.protocol === 'dsh-app:' && url.hostname === 'app') return;
      if (
        (url.protocol === 'http:' || url.protocol === 'https:') &&
        (url.hostname === '127.0.0.1' || url.hostname === 'localhost' || url.hostname === '[::1]')
      ) {
        return;
      }
    } catch {
      /* fall through */
    }
  }
  const error = new Error('forbidden');
  error.statusCode = 403;
  throw error;
}

function requirePost(request) {
  if (request.method !== 'POST') {
    const error = new Error('method not allowed');
    error.statusCode = 405;
    throw error;
  }
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

export function apply(ctx, config) {
  const state = {
    queue: Promise.resolve(),
    options: {},
  };
  state.options = config ?? {};

  const enqueue = (operation) => {
    const run = state.queue.then(operation, operation);
    state.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  };

  const runPowerShell = async (args, timeout = 25000) => {
    const options = state.options ?? {};
    return execFileAsync(POWERSHELL, ['-NoProfile', '-NonInteractive', '-STA', '-ExecutionPolicy', 'Bypass', '-File', ...args], {
      cwd: HERE,
      windowsHide: true,
      timeout: options.captureTimeoutMs ?? timeout,
      maxBuffer: 1024 * 1024,
      env: { ...process.env, DSH_SCREENSHOT: '1' },
    });
  };

  const capture = async (mode) => {
    windowsOnly();
    const output = join(tmpdir(), `dsh-screenshot-${randomUUID()}.png`);
    try {
      await runPowerShell([
        CAPTURE_SCRIPT,
        '-Mode',
        mode,
        '-Out',
        output,
        '-TitleMatch',
        state.options.windowTitle ?? 'DeepSeek Harness',
        '-HideDelayMs',
        String(state.options.hideDelayMs ?? 350),
      ]);
      return await readFile(output);
    } catch (error) {
      await runPowerShell([CAPTURE_SCRIPT, '-Mode', 'restore', '-TitleMatch', state.options.windowTitle ?? 'DeepSeek Harness']).catch(() => undefined);
      throw error;
    } finally {
      await unlink(output).catch(() => undefined);
    }
  };

  const copyImage = async (buffer) => {
    windowsOnly();
    if (!buffer.length) throw new Error('the image body is empty');
    const path = join(tmpdir(), `dsh-screenshot-copy-${randomUUID()}.png`);
    await writeFile(path, buffer);
    try {
      await runPowerShell([COPY_SCRIPT, '-Path', path], 15000);
    } finally {
      await unlink(path).catch(() => undefined);
    }
  };

  const saveImage = async (buffer) => {
    if (!buffer.length) throw new Error('the image body is empty');
    const home = process.env.USERPROFILE ?? tmpdir();
    const directory = join(home, 'Pictures', 'Screenshots');
    await mkdir(directory, { recursive: true });
    const base = `DSH-Screenshot-${timestamp()}`;
    let path = join(directory, `${base}.png`);
    let index = 1;
    while (true) {
      try {
        await writeFile(path, buffer, { flag: 'wx' });
        return path;
      } catch (error) {
        if (error?.code !== 'EEXIST') throw error;
        path = join(directory, `${base}-${index}.png`);
        index += 1;
      }
    }
  };

  const register = (path, handler) =>
    ctx.webServer.register({
      kind: 'exact',
      path,
      handler: async (request, response) => {
        try {
          await handler(request, response);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const status = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
          ctx.logger?.('dsh-screenshot')?.warn?.('request failed: %s', message);
          if (!response.headersSent) sendJson(response, status, { ok: false, error: message });
          else response.destroy();
        }
      },
    });

  ctx.effect(
    () => {
      const disposers = [
        register('/dsh-screenshot/ping', async (_request, response) => {
          sendJson(response, 200, {
            ok: true,
            platform: process.platform,
            pid: process.pid,
            powershell: process.platform === 'win32',
          });
        }),
        register('/dsh-screenshot/capture', async (request, response) => {
          requirePost(request);
          requireClient(request);
          const payload = await readJson(request);
          if (payload?.mode !== 'hidden' && payload?.mode !== 'direct') {
            const error = new Error('mode must be "hidden" or "direct"');
            error.statusCode = 400;
            throw error;
          }
          const png = await enqueue(() => capture(payload.mode));
          sendPng(response, png);
        }),
        register('/dsh-screenshot/copy', async (request, response) => {
          requirePost(request);
          requireClient(request);
          const body = await readBody(request);
          await enqueue(() => copyImage(body));
          sendJson(response, 200, { ok: true });
        }),
        register('/dsh-screenshot/save', async (request, response) => {
          requirePost(request);
          requireClient(request);
          const body = await readBody(request);
          const path = await enqueue(() => saveImage(body));
          sendJson(response, 200, { ok: true, path });
        }),
      ];
      return () => {
        for (const dispose of disposers) dispose();
      };
    },
    'dsh-screenshot routes',
  );
}
