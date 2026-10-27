window.__ModuleLoader__.load({
  id: 'dsh-wechat-screenshot',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } = React;

    const CSS = `
.dsh-shot-anchor{position:relative;display:inline-flex;align-items:center;min-width:0}
.dsh-shot-button{box-sizing:border-box;display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 8px;border:0;border-radius:var(--dsw-radius-sm,6px);background:transparent;color:var(--dsw-alias-label-tertiary,rgba(255,255,255,.62));font:inherit;font-size:12px;line-height:20px;cursor:pointer;white-space:nowrap;transition:background-color .12s,color .12s}
.dsh-shot-button:hover,.dsh-shot-button[aria-expanded=true]{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.08));color:var(--dsw-alias-label-secondary,rgba(255,255,255,.82))}
.dsh-shot-button:disabled{opacity:.6;cursor:default}
.dsh-shot-button svg{width:15px;height:15px;flex:none}
.dsh-shot-spin{animation:dsh-shot-spin 1s linear infinite}
@keyframes dsh-shot-spin{to{transform:rotate(360deg)}}
.dsh-shot-menu{position:fixed;z-index:1200;box-sizing:border-box;min-width:228px;max-width:min(260px,calc(100vw - 16px));padding:6px;border-radius:12px;background:var(--dsw-specific-menu,#26262a);border:1px solid var(--dsw-alias-border-l1,rgba(255,255,255,.12));box-shadow:0 14px 48px rgba(0,0,0,.5);color:var(--dsw-alias-label-primary,#fff);font-size:13px;line-height:18px;backdrop-filter:blur(18px)}
.dsh-shot-menu-title{padding:6px 10px 5px;color:var(--dsw-alias-label-tertiary,rgba(255,255,255,.55));font-size:11px;line-height:15px;letter-spacing:.02em}
.dsh-shot-menu-row{box-sizing:border-box;display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border:0;border-radius:8px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
.dsh-shot-menu-row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.08))}
.dsh-shot-menu-icon{display:grid;place-items:center;width:26px;height:26px;flex:none;border-radius:7px;background:var(--dsw-alias-interactive-bg-hover,rgba(255,255,255,.07));color:var(--dsw-alias-label-secondary,rgba(255,255,255,.8))}
.dsh-shot-menu-icon svg{width:16px;height:16px}
.dsh-shot-menu-text{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1}
.dsh-shot-menu-label{font-weight:500}
.dsh-shot-menu-desc{color:var(--dsw-alias-label-tertiary,rgba(255,255,255,.55));font-size:11px;line-height:15px}
.dsh-shot-menu-key{flex:none;color:var(--dsw-alias-label-caption,rgba(255,255,255,.42));font-size:10px;font-family:var(--ds-font-family-code,monospace)}
.dsh-shot-overlay{position:fixed;inset:0;z-index:2147483000;overflow:hidden;background:#08080a;cursor:crosshair;user-select:none;-webkit-user-select:none;-webkit-app-region:no-drag;touch-action:none;font-family:inherit}
.dsh-shot-image{position:absolute;display:block;pointer-events:none;user-select:none;-webkit-user-drag:none}
.dsh-shot-dim{position:absolute;pointer-events:none;background:rgba(0,0,0,.46)}
.dsh-shot-sel{position:absolute;pointer-events:none;border:1px solid rgba(255,255,255,.96);box-shadow:0 0 0 1px rgba(0,0,0,.42),0 0 24px rgba(0,0,0,.25)}
.dsh-shot-size{position:absolute;pointer-events:none;padding:2px 7px;border-radius:5px;background:rgba(20,20,22,.86);color:#fff;font-size:11px;line-height:16px;font-variant-numeric:tabular-nums;white-space:nowrap;border:1px solid rgba(255,255,255,.12)}
.dsh-shot-canvas{position:absolute;pointer-events:none}
.dsh-shot-toolbar{position:absolute;z-index:2;box-sizing:border-box;display:flex;align-items:center;flex-wrap:wrap;gap:2px;max-width:calc(100vw - 16px);padding:5px 6px;border-radius:12px;background:rgba(32,32,35,.96);border:1px solid rgba(255,255,255,.14);box-shadow:0 16px 50px rgba(0,0,0,.55);backdrop-filter:blur(16px)}
.dsh-shot-tool{box-sizing:border-box;display:grid;place-items:center;width:30px;height:30px;padding:0;border:0;border-radius:7px;background:transparent;color:rgba(255,255,255,.82);cursor:pointer}
.dsh-shot-tool:hover{background:rgba(255,255,255,.1);color:#fff}
.dsh-shot-tool.is-active{background:#ff453a;color:#fff}
.dsh-shot-tool:disabled{opacity:.35;cursor:default}
.dsh-shot-tool svg{width:18px;height:18px}
.dsh-shot-sep{width:1px;height:20px;margin:0 4px;background:rgba(255,255,255,.14);flex:none}
.dsh-shot-colors{display:flex;align-items:center;gap:4px;padding:0 4px}
.dsh-shot-color{width:16px;height:16px;padding:0;border-radius:50%;border:2px solid transparent;cursor:pointer;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
.dsh-shot-color.is-active{border-color:#fff}
.dsh-shot-action{box-sizing:border-box;display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 9px;border:0;border-radius:7px;background:transparent;color:rgba(255,255,255,.85);font:inherit;font-size:12px;cursor:pointer;white-space:nowrap}
.dsh-shot-action:hover{background:rgba(255,255,255,.1)}
.dsh-shot-action svg{width:16px;height:16px}
.dsh-shot-primary{background:#ff453a;color:#fff;font-weight:500}
.dsh-shot-primary:hover{background:#ff5b51}
.dsh-shot-hint{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);z-index:3;padding:7px 13px;border-radius:999px;background:rgba(22,22,24,.86);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.84);font-size:12px;line-height:17px;white-space:nowrap;pointer-events:none;backdrop-filter:blur(12px);box-shadow:0 8px 30px rgba(0,0,0,.35)}
.dsh-shot-close{position:absolute;top:52px;right:16px;z-index:4;box-sizing:border-box;display:grid;place-items:center;width:34px;height:34px;padding:0;border-radius:9px;border:1px solid rgba(255,255,255,.16);background:rgba(24,24,26,.82);color:#fff;font:400 22px/1 system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(10px);box-shadow:0 8px 30px rgba(0,0,0,.35)}
.dsh-shot-close:hover{background:rgba(255,255,255,.14)}
.dsh-shot-toast{position:fixed;left:50%;bottom:44px;transform:translateX(-50%);z-index:2147483001;max-width:min(640px,calc(100vw - 40px));padding:10px 16px;border-radius:10px;background:rgba(28,28,30,.96);border:1px solid rgba(255,255,255,.14);color:#fff;font-size:13px;line-height:19px;text-align:center;box-shadow:0 14px 44px rgba(0,0,0,.45);overflow-wrap:anywhere}
.dsh-shot-error{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483001;box-sizing:border-box;width:min(420px,calc(100vw - 32px));padding:18px 20px;border-radius:14px;background:#1f1f22;border:1px solid rgba(255,255,255,.14);color:#fff;box-shadow:0 24px 80px rgba(0,0,0,.6)}
.dsh-shot-error-title{font-size:14px;font-weight:600;margin:0 0 6px}
.dsh-shot-error-text{margin:0;color:rgba(255,255,255,.66);font-size:12px;line-height:18px;overflow-wrap:anywhere}
.dsh-shot-error-actions{display:flex;justify-content:flex-end;margin-top:14px}
`;

    const EMPTY = {
      phase: 'idle',
      mode: null,
      error: null,
      url: null,
      image: null,
      imageW: 0,
      imageH: 0,
      selection: null,
      shapes: [],
      tool: 'rect',
      color: '#ff453a',
      busy: false,
      toast: null,
    };

    let state = EMPTY;
    const listeners = new Set();
    let objectUrl = null;
    let toastTimer = 0;

    const setState = (patch) => {
      state = { ...state, ...patch };
      for (const listener of [...listeners]) listener();
    };
    const subscribe = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    const getState = () => state;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    function revoke() {
      if (objectUrl !== null) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {
          /* ignore */
        }
        objectUrl = null;
      }
    }

    function close(options) {
      if (toastTimer !== 0) {
        clearTimeout(toastTimer);
        toastTimer = 0;
      }
      revoke();
      state = { ...EMPTY, phase: 'idle' };
      for (const listener of [...listeners]) listener();
      if (options?.focus !== false && document.hasFocus()) {
        try {
          const editor = document.querySelector('[contenteditable="true"]');
          if (editor instanceof HTMLElement) editor.focus({ preventScroll: true });
        } catch {
          /* ignore */
        }
      }
    }

    async function begin(mode) {
      if (state.phase === 'capturing') return;
      if (toastTimer !== 0) {
        clearTimeout(toastTimer);
        toastTimer = 0;
      }
      if (state.phase === 'ready') close({ focus: false });
      setState({ ...EMPTY, phase: 'capturing', mode });
      try {
        const response = await fetch(`/dsh-screenshot/capture?t=${Date.now()}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-dsh-screenshot': '1' },
          body: JSON.stringify({ mode }),
        });
        if (!response.ok) {
          const text = await response.text().catch(() => '');
          throw new Error(text || `截图服务返回 HTTP ${response.status}`);
        }
        const blob = await response.blob();
        if (!blob || blob.size === 0) throw new Error('截图服务返回了空图片');
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.decoding = 'async';
        await new Promise((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error('无法解码截图'));
          image.src = url;
        });
        revoke();
        objectUrl = url;
        setState({
          ...EMPTY,
          phase: 'ready',
          mode,
          url,
          image,
          imageW: image.naturalWidth,
          imageH: image.naturalHeight,
        });
      } catch (error) {
        setState({ ...EMPTY, phase: 'error', mode, error: error instanceof Error ? error.message : String(error) });
      }
    }

    function getFit(snapshot) {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const scale = Math.min(vw / Math.max(1, snapshot.imageW), vh / Math.max(1, snapshot.imageH));
      const width = snapshot.imageW * scale;
      const height = snapshot.imageH * scale;
      return { vw, vh, scale, width, height, left: (vw - width) / 2, top: (vh - height) / 2 };
    }

    function normalizeRect(start, end, fit) {
      const x = clamp(Math.min(start.x, end.x), 0, fit.width);
      const y = clamp(Math.min(start.y, end.y), 0, fit.height);
      const right = clamp(Math.max(start.x, end.x), 0, fit.width);
      const bottom = clamp(Math.max(start.y, end.y), 0, fit.height);
      return { x, y, w: right - x, h: bottom - y };
    }

    function inside(rect, point) {
      return point.x >= rect.x && point.y >= rect.y && point.x <= rect.x + rect.w && point.y <= rect.y + rect.h;
    }

    function rectOf(points) {
      const a = points[0];
      const b = points[points.length - 1];
      const x = Math.min(a.x, b.x);
      const y = Math.min(a.y, b.y);
      return { x, y, w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) };
    }

    function drawArrow(ctx, points) {
      const a = points[0];
      const b = points[points.length - 1];
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const head = 10;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - head * Math.cos(angle - Math.PI / 7), b.y - head * Math.sin(angle - Math.PI / 7));
      ctx.lineTo(b.x - head * Math.cos(angle + Math.PI / 7), b.y - head * Math.sin(angle + Math.PI / 7));
      ctx.closePath();
      ctx.fill();
    }

    function drawShape(ctx, shape, drawScale, mosaicSource) {
      const points = shape.points;
      if (!points || points.length === 0) return;
      ctx.save();
      ctx.scale(drawScale, drawScale);
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color;
      ctx.lineWidth = shape.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (shape.tool === 'rect') {
        const rect = rectOf(points);
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      } else if (shape.tool === 'ellipse') {
        const rect = rectOf(points);
        ctx.beginPath();
        ctx.ellipse(rect.x + rect.w / 2, rect.y + rect.h / 2, Math.max(0.5, rect.w / 2), Math.max(0.5, rect.h / 2), 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape.tool === 'arrow') {
        drawArrow(ctx, points);
      } else if (shape.tool === 'pen') {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let index = 1; index < points.length; index += 1) ctx.lineTo(points[index].x, points[index].y);
        if (points.length === 1) ctx.lineTo(points[0].x + 0.01, points[0].y + 0.01);
        ctx.stroke();
      } else if (shape.tool === 'mosaic' && mosaicSource && mosaicSource.image) {
        const rect = rectOf(points);
        const sourceX = mosaicSource.x + rect.x * mosaicSource.scale;
        const sourceY = mosaicSource.y + rect.y * mosaicSource.scale;
        const sourceW = rect.w * mosaicSource.scale;
        const sourceH = rect.h * mosaicSource.scale;
        if (rect.w > 1 && rect.h > 1 && sourceW > 1 && sourceH > 1) {
          const blocks = Math.max(1, Math.round(Math.max(rect.w, rect.h) / 9));
          const tmp = document.createElement('canvas');
          tmp.width = Math.max(2, Math.round((rect.w / Math.max(rect.w, rect.h)) * blocks));
          tmp.height = Math.max(2, Math.round((rect.h / Math.max(rect.w, rect.h)) * blocks));
          const tmpCtx = tmp.getContext('2d');
          tmpCtx.imageSmoothingEnabled = true;
          tmpCtx.drawImage(mosaicSource.image, sourceX, sourceY, sourceW, sourceH, 0, 0, tmp.width, tmp.height);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tmp, 0, 0, tmp.width, tmp.height, rect.x, rect.y, rect.w, rect.h);
        }
      }
      ctx.restore();
    }

    function useSnapshot() {
      return useSyncExternalStore(subscribe, getState, getState);
    }

    function Icon(props) {
      const name = props.name;
      const common = {
        viewBox: '0 0 20 20',
        width: 18,
        height: 18,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      };
      if (name === 'camera') {
        return h('svg', common, [
          h('path', { key: 'b', d: 'M3 7.2h3l1.2-2h5.6L14 7.2h3v8.3H3z' }),
          h('circle', { key: 'c', cx: 10, cy: 11.2, r: 3.1 }),
        ]);
      }
      if (name === 'rect') return h('svg', common, h('rect', { x: 3.2, y: 4.6, width: 13.6, height: 10.8, rx: 1.4 }));
      if (name === 'ellipse') return h('svg', common, h('ellipse', { cx: 10, cy: 10, rx: 7.2, ry: 5.6 }));
      if (name === 'arrow') return h('svg', common, [h('path', { key: 'l', d: 'M3.5 16.5 16.5 3.5' }), h('path', { key: 'h', d: 'M10.2 3.5h6.3v6.3' })]);
      if (name === 'pen') return h('svg', common, h('path', { d: 'M3.6 16.4c3.2-1.1 3.2-4.4 5.5-6.7 1.9-1.9 4.6-2.1 6.3-.4 1.7 1.7 1.5 4.4-.4 6.3-2.3 2.3-5.6 2.3-6.7 5.5' }));
      if (name === 'mosaic') {
        return h(
          'svg',
          common,
          [
            h('rect', { key: 'a', x: 3.4, y: 3.4, width: 5, height: 5, rx: 0.5 }),
            h('rect', { key: 'b', x: 11.6, y: 3.4, width: 5, height: 5, rx: 0.5 }),
            h('rect', { key: 'c', x: 3.4, y: 11.6, width: 5, height: 5, rx: 0.5 }),
            h('rect', { key: 'd', x: 11.6, y: 11.6, width: 5, height: 5, rx: 0.5 }),
          ],
        );
      }
      if (name === 'undo') return h('svg', common, [h('path', { key: 'a', d: 'M7.5 5.2 4 8.6l3.5 3.4' }), h('path', { key: 'b', d: 'M4.4 8.6h5.3c3.2 0 5.2 1.7 5.2 4.4 0 2.1-1.3 3.6-3.4 4.2' })]);
      if (name === 'reselect') return h('svg', common, [h('path', { key: 'a', d: 'M3.2 6V3.6h2.4M14.4 3.6h2.4V6M16.8 14v2.4h-2.4M5.6 16.4H3.2V14' }), h('path', { key: 'b', d: 'M7 7h6v6H7z', strokeDasharray: '2 2' })]);
      if (name === 'save') return h('svg', common, [h('path', { key: 'a', d: 'M10 3v9' }), h('path', { key: 'b', d: 'M6.2 8.8 10 12.6l3.8-3.8' }), h('path', { key: 'c', d: 'M3.6 14.2v2.2h12.8v-2.2' })]);
      if (name === 'close') return h('svg', common, [h('path', { key: 'a', d: 'm5 5 10 10' }), h('path', { key: 'b', d: 'm15 5-10 10' })]);
      if (name === 'check') return h('svg', common, h('path', { d: 'm4 10.4 4 4L16 5.6' }));
      if (name === 'keyboard') return h('svg', common, [h('rect', { key: 'a', x: 2.8, y: 5.4, width: 14.4, height: 9.2, rx: 1.6 }), h('path', { key: 'b', d: 'M5.5 8.4h.01M8.2 8.4h.01M10.9 8.4h.01M13.6 8.4h.01M5.5 11.4h.01M8.2 11.4h.01M10.9 11.4h.01M13.6 11.4h.01M7 13.6h6' })]);
      if (name === 'spinner') {
        return h('svg', { ...common, className: 'dsh-shot-spin' }, h('path', { d: 'M10 3a7 7 0 1 0 7 7', strokeWidth: 2 }));
      }
      return h('svg', common, h('circle', { cx: 10, cy: 10, r: 6 }));
    }

    function ScreenshotButton() {
      const snapshot = useSnapshot();
      const [open, setOpen] = useState(false);
      const anchor = useRef(null);
      const busy = snapshot.phase === 'capturing';

      useEffect(() => {
        if (!open) return undefined;
        const dismiss = (event) => {
          if (anchor.current !== null && !anchor.current.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => {
          if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', dismiss, true);
        document.addEventListener('keydown', onKey, true);
        return () => {
          document.removeEventListener('pointerdown', dismiss, true);
          document.removeEventListener('keydown', onKey, true);
        };
      }, [open]);

      const start = (mode) => {
        setOpen(false);
        void begin(mode);
      };

      let menuStyle;
      if (open && anchor.current !== null) {
        const rect = anchor.current.getBoundingClientRect();
        const width = 240;
        const left = clamp(rect.left + rect.width / 2 - width / 2, 8, Math.max(8, window.innerWidth - width - 8));
        if (rect.top > 190) {
          menuStyle = { left, bottom: window.innerHeight - rect.top + 8 };
        } else {
          menuStyle = { left, top: rect.bottom + 8 };
        }
      }

      return h(
        'div',
        { className: 'dsh-shot-anchor', ref: anchor },
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-shot-button',
            title: '截图 (Alt+A 隐藏窗口，Alt+Shift+A 直接截图)',
            'aria-label': '截图',
            'aria-busy': busy,
            'aria-expanded': open,
            onClick: () => setOpen((value) => !value),
          },
          h(Icon, { name: 'camera' }),
          h('span', null, '截图'),
        ),
        open
          ? h(
              'div',
              { className: 'dsh-shot-menu', role: 'menu', style: menuStyle },
              h('div', { className: 'dsh-shot-menu-title' }, '选择截图方式'),
              h(
                'button',
                { type: 'button', className: 'dsh-shot-menu-row', role: 'menuitem', onClick: () => start('hidden') },
                h('span', { className: 'dsh-shot-menu-icon' }, h(Icon, { name: 'camera' })),
                h(
                  'span',
                  { className: 'dsh-shot-menu-text' },
                  h('span', { className: 'dsh-shot-menu-label' }, '隐藏窗口截图'),
                  h('span', { className: 'dsh-shot-menu-desc' }, '先隐藏窗口，截取窗口后面的画面'),
                ),
                h('span', { className: 'dsh-shot-menu-key' }, 'Alt+A'),
              ),
              h(
                'button',
                { type: 'button', className: 'dsh-shot-menu-row', role: 'menuitem', onClick: () => start('direct') },
                h('span', { className: 'dsh-shot-menu-icon' }, h(Icon, { name: 'reselect' })),
                h(
                  'span',
                  { className: 'dsh-shot-menu-text' },
                  h('span', { className: 'dsh-shot-menu-label' }, '直接截图'),
                  h('span', { className: 'dsh-shot-menu-desc' }, '保留当前窗口，直接截取屏幕'),
                ),
                h('span', { className: 'dsh-shot-menu-key' }, 'Alt+Shift+A'),
              ),
            )
          : null,
      );
    }

    function Toolbar(props) {
      const snapshot = props.snapshot;
      const hasShapes = snapshot.shapes.length > 0;
      const tool = (name) => () => setState({ tool: name });
      const colors = ['#ff453a', '#ffd60a', '#0a84ff', '#32d74b'];
      return h(
        'div',
        { className: 'dsh-shot-toolbar', style: props.style, onPointerDown: (event) => event.stopPropagation() },
        h('button', { type: 'button', className: 'dsh-shot-tool' + (snapshot.tool === 'rect' ? ' is-active' : ''), title: '矩形', onClick: tool('rect') }, h(Icon, { name: 'rect' })),
        h('button', { type: 'button', className: 'dsh-shot-tool' + (snapshot.tool === 'ellipse' ? ' is-active' : ''), title: '椭圆', onClick: tool('ellipse') }, h(Icon, { name: 'ellipse' })),
        h('button', { type: 'button', className: 'dsh-shot-tool' + (snapshot.tool === 'arrow' ? ' is-active' : ''), title: '箭头', onClick: tool('arrow') }, h(Icon, { name: 'arrow' })),
        h('button', { type: 'button', className: 'dsh-shot-tool' + (snapshot.tool === 'pen' ? ' is-active' : ''), title: '画笔', onClick: tool('pen') }, h(Icon, { name: 'pen' })),
        h('button', { type: 'button', className: 'dsh-shot-tool' + (snapshot.tool === 'mosaic' ? ' is-active' : ''), title: '马赛克', onClick: tool('mosaic') }, h(Icon, { name: 'mosaic' })),
        h('span', { className: 'dsh-shot-sep' }),
        h(
          'span',
          { className: 'dsh-shot-colors' },
          colors.map((color) =>
            h('button', {
              key: color,
              type: 'button',
              className: 'dsh-shot-color' + (snapshot.color === color ? ' is-active' : ''),
              style: { background: color },
              title: `颜色 ${color}`,
              onClick: () => setState({ color }),
            }),
          ),
        ),
        h('span', { className: 'dsh-shot-sep' }),
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-shot-tool',
            title: '撤销',
            disabled: !hasShapes,
            onClick: () => setState({ shapes: snapshot.shapes.slice(0, -1) }),
          },
          h(Icon, { name: 'undo' }),
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-shot-tool',
            title: '重选',
            onClick: () => setState({ selection: null, shapes: [] }),
          },
          h(Icon, { name: 'reselect' }),
        ),
        h('span', { className: 'dsh-shot-sep' }),
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-shot-action',
            title: '保存到图片文件夹',
            disabled: snapshot.busy,
            onClick: () => void finish('save'),
          },
          h(Icon, { name: 'save' }),
          '保存',
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-shot-action',
            title: '取消 (Esc)',
            disabled: snapshot.busy,
            onClick: () => close(),
          },
          h(Icon, { name: 'close' }),
          '取消',
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-shot-action dsh-shot-primary',
            title: '复制并完成 (Enter)',
            disabled: snapshot.busy,
            onClick: () => void finish('copy'),
          },
          h(Icon, { name: snapshot.busy ? 'spinner' : 'check' }),
          snapshot.busy ? '处理中' : '完成',
        ),
      );
    }

    function Overlay() {
      const snapshot = useSnapshot();
      const fit = useMemo(() => (snapshot.phase === 'ready' ? getFit(snapshot) : null), [snapshot]);
      const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
      const [drawing, setDrawing] = useState(null);
      const drag = useRef(null);
      const root = useRef(null);
      const canvas = useRef(null);
      const imageEl = useRef(null);

      useEffect(() => {
        const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, []);

      useEffect(() => {
        setDrawing(null);
        drag.current = null;
      }, [snapshot.phase, snapshot.url]);

      useEffect(() => {
        if (snapshot.phase !== 'ready') return undefined;
        const onKey = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            close();
          } else if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            void finish('copy');
          }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
      }, [snapshot.phase]);

      useEffect(() => {
        if (snapshot.phase !== 'ready') return;
        const element = root.current;
        if (element) element.focus({ preventScroll: true });
      }, [snapshot.phase]);

      const selection = snapshot.selection;
      const hasSelection = selection !== null && selection.w > 8 && selection.h > 8;

      useLayoutEffect(() => {
        if (!fit || !selection || !canvas.current) return;
        const ratio = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.round(selection.w));
        const height = Math.max(1, Math.round(selection.h));
        const target = canvas.current;
        if (target.width !== Math.round(width * ratio) || target.height !== Math.round(height * ratio)) {
          target.width = Math.round(width * ratio);
          target.height = Math.round(height * ratio);
        }
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        const context = target.getContext('2d');
        if (!context) return;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);
        const source = {
          image: snapshot.image,
          x: selection.x / fit.scale,
          y: selection.y / fit.scale,
          scale: 1 / fit.scale,
        };
        for (const shape of snapshot.shapes) drawShape(context, shape, 1, source);
        if (drawing) drawShape(context, drawing, 1, source);
      }, [fit, selection, snapshot.shapes, snapshot.image, drawing]);

      if (viewport.width <= 0 || viewport.height <= 0) return null;

      if (snapshot.phase === 'capturing') return null;

      if (snapshot.phase === 'error') {
        return h(
          'div',
          { className: 'dsh-shot-overlay', style: { background: 'rgba(8,8,10,.55)' }, onPointerDown: (event) => event.stopPropagation() },
          h(
            'div',
            { className: 'dsh-shot-error' },
            h('p', { className: 'dsh-shot-error-title' }, '截图失败'),
            h('p', { className: 'dsh-shot-error-text' }, snapshot.error || '未知错误'),
            h(
              'div',
              { className: 'dsh-shot-error-actions' },
              h('button', { type: 'button', className: 'dsh-shot-action', onClick: () => close() }, '关闭'),
            ),
          ),
        );
      }

      if (snapshot.phase === 'toast') {
        return h('div', { className: 'dsh-shot-overlay', style: { background: 'rgba(8,8,10,.25)', pointerEvents: 'none' } }, h('div', { className: 'dsh-shot-toast' }, snapshot.toast));
      }

      if (snapshot.phase !== 'ready' || !fit) return null;

      const point = (event) => {
        const box = imageEl.current ? imageEl.current.getBoundingClientRect() : null;
        if (!box) return null;
        return { x: clamp(event.clientX - box.left, 0, fit.width), y: clamp(event.clientY - box.top, 0, fit.height) };
      };

      const startShape = (local, tool) => {
        const width = 3;
        return {
          tool,
          color: snapshot.color,
          width,
          points: [{ x: local.x, y: local.y }, { x: local.x, y: local.y }],
        };
      };

      const onPointerDown = (event) => {
        if (event.button !== 0) return;
        const current = point(event);
        if (!current) return;
        event.preventDefault();
        const currentSelection = snapshot.selection;
        if (currentSelection && inside(currentSelection, current)) {
          if (root.current) root.current.setPointerCapture(event.pointerId);
          const local = { x: current.x - currentSelection.x, y: current.y - currentSelection.y };
          drag.current = { kind: 'shape', tool: snapshot.tool };
          setDrawing(startShape(local, snapshot.tool));
          return;
        }
        if (root.current) root.current.setPointerCapture(event.pointerId);
        drag.current = { kind: 'select', start: current };
        setState({ selection: { x: current.x, y: current.y, w: 0, h: 0 }, shapes: [] });
      };

      const onPointerMove = (event) => {
        const active = drag.current;
        if (!active) return;
        const current = point(event);
        if (!current) return;
        if (active.kind === 'select') {
          setState({ selection: normalizeRect(active.start, current, fit) });
        } else if (active.kind === 'shape') {
          setDrawing((shape) => {
            if (!shape) return shape;
            const selectionNow = snapshot.selection;
            if (!selectionNow) return shape;
            const local = {
              x: clamp(current.x - selectionNow.x, 0, Math.max(1, selectionNow.w)),
              y: clamp(current.y - selectionNow.y, 0, Math.max(1, selectionNow.h)),
            };
            if (shape.tool === 'pen') return { ...shape, points: [...shape.points, local] };
            return { ...shape, points: [shape.points[0], local] };
          });
        }
      };

      const onPointerUp = (event) => {
        const active = drag.current;
        drag.current = null;
        if (!active) return;
        if (active.kind === 'select') {
          const current = point(event);
          if (!current) return;
          const rect = normalizeRect(active.start, current, fit);
          if (rect.w < 6 || rect.h < 6) setState({ selection: null, shapes: [] });
          else setState({ selection: rect });
          return;
        }
        if (active.kind === 'shape') {
          const shape = drawing;
          setDrawing(null);
          if (!shape) return;
          const first = shape.points[0];
          const last = shape.points[shape.points.length - 1];
          const width = Math.abs(last.x - first.x);
          const height = Math.abs(last.y - first.y);
          if (shape.tool === 'pen' ? shape.points.length < 2 : width < 3 && height < 3) return;
          setState({ shapes: [...snapshot.shapes, shape] });
        }
      };

      const dims = selection
        ? [
            { left: fit.left, top: fit.top, width: fit.width, height: selection.y },
            { left: fit.left, top: fit.top + selection.y + selection.h, width: fit.width, height: Math.max(0, fit.height - selection.y - selection.h) },
            { left: fit.left, top: fit.top + selection.y, width: selection.x, height: selection.h },
            { left: fit.left + selection.x + selection.w, top: fit.top + selection.y, width: Math.max(0, fit.width - selection.x - selection.w), height: selection.h },
          ]
        : [{ left: fit.left, top: fit.top, width: fit.width, height: fit.height }];

      const absolute = selection
        ? { x: fit.left + selection.x, y: fit.top + selection.y }
        : null;

      let toolbarStyle = null;
      if (hasSelection) {
        const width = 470;
        const top = absolute.y + selection.h + 10 + 52 > viewport.height ? Math.max(8, absolute.y - 52) : absolute.y + selection.h + 10;
        const left = clamp(absolute.x + selection.w / 2, Math.min(width / 2 + 8, viewport.width / 2), viewport.width - Math.min(width / 2 + 8, viewport.width / 2));
        toolbarStyle = { top, left, transform: 'translateX(-50%)' };
      }

      return h(
        'div',
        {
          className: 'dsh-shot-overlay',
          ref: root,
          tabIndex: -1,
          'data-dsh-screenshot': 'overlay',
          onPointerDown,
          onPointerMove,
          onPointerUp,
          onPointerCancel: onPointerUp,
          onContextMenu: (event) => event.preventDefault(),
        },
        h('img', {
          ref: imageEl,
          className: 'dsh-shot-image',
          src: snapshot.url,
          alt: '',
          draggable: false,
          style: { left: fit.left, top: fit.top, width: fit.width, height: fit.height },
        }),
        dims.map((style, index) => h('div', { key: `dim-${index}`, className: 'dsh-shot-dim', style })),
        selection
          ? h('div', {
              className: 'dsh-shot-sel',
              style: { left: absolute.x, top: absolute.y, width: Math.max(0, selection.w), height: Math.max(0, selection.h) },
            })
          : null,
        hasSelection
          ? h(
              'div',
              {
                className: 'dsh-shot-size',
                style: {
                  left: clamp(absolute.x, 0, Math.max(0, viewport.width - 90)),
                  top: Math.max(4, absolute.y - 25),
                },
              },
              `${Math.round(selection.w / fit.scale)} × ${Math.round(selection.h / fit.scale)}`,
            )
          : null,
        hasSelection
          ? h('canvas', {
              ref: canvas,
              className: 'dsh-shot-canvas',
              style: { left: absolute.x, top: absolute.y },
            })
          : null,
        hasSelection ? h(Toolbar, { snapshot, style: toolbarStyle }) : null,
        h(
          'div',
          {
            className: 'dsh-shot-hint',
            style: hasSelection ? { top: 16, bottom: 'auto' } : undefined,
          },
          hasSelection
            ? '拖动画图 · Enter 复制并完成 · Esc 取消'
            : '按住鼠标拖动选择截图区域 · Enter 复制整屏 · Esc 取消',
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-shot-close',
            title: '取消 (Esc)',
            'aria-label': '取消截图',
            onPointerDown: (event) => event.stopPropagation(),
            onClick: () => close(),
          },
          '×',
        ),
      );
    }

    function composeBlob() {
      return new Promise((resolve, reject) => {
        const snapshot = getState();
        const fit = getFit(snapshot);
        const selection = snapshot.selection;
        const useSelection = selection !== null && selection.w >= 2 && selection.h >= 2;
        const crop = useSelection
          ? {
              x: selection.x / fit.scale,
              y: selection.y / fit.scale,
              w: selection.w / fit.scale,
              h: selection.h / fit.scale,
            }
          : { x: 0, y: 0, w: snapshot.imageW, h: snapshot.imageH };
        const width = Math.max(1, Math.round(crop.w));
        const height = Math.max(1, Math.round(crop.h));
        const target = document.createElement('canvas');
        target.width = width;
        target.height = height;
        const context = target.getContext('2d');
        if (!context) {
          reject(new Error('无法创建画布'));
          return;
        }
        context.imageSmoothingEnabled = true;
        context.drawImage(snapshot.image, crop.x, crop.y, crop.w, crop.h, 0, 0, width, height);
        const scale = width / Math.max(1, useSelection ? selection.w : snapshot.imageW);
        const source = { image: snapshot.image, x: crop.x, y: crop.y, scale };
        for (const shape of snapshot.shapes) drawShape(context, shape, scale, source);
        target.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('无法生成 PNG'));
        }, 'image/png');
      });
    }

    async function copyBlob(blob) {
      try {
        const response = await fetch('/dsh-screenshot/copy', {
          method: 'POST',
          headers: { 'content-type': 'image/png', 'x-dsh-screenshot': '1' },
          body: blob,
        });
        if (!response.ok) throw new Error(await response.text().catch(() => '复制失败'));
      } catch (hostError) {
        if (navigator.clipboard && typeof navigator.clipboard.write === 'function' && typeof window.ClipboardItem === 'function') {
          await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
          return;
        }
        throw hostError;
      }
    }

    async function saveBlob(blob) {
      const response = await fetch('/dsh-screenshot/save', {
        method: 'POST',
        headers: { 'content-type': 'image/png', 'x-dsh-screenshot': '1' },
        body: blob,
      });
      if (!response.ok) throw new Error(await response.text().catch(() => '保存失败'));
      return response.json();
    }

    function toast(message, duration) {
      if (toastTimer !== 0) clearTimeout(toastTimer);
      setState({ phase: 'toast', toast: message, busy: false });
      toastTimer = window.setTimeout(() => {
        toastTimer = 0;
        close();
      }, duration ?? 1600);
    }

    async function finish(action) {
      const snapshot = getState();
      if (snapshot.phase !== 'ready' || snapshot.busy) return;
      setState({ busy: true });
      try {
        const blob = await composeBlob();
        if (action === 'save') {
          const result = await saveBlob(blob);
          toast(`已保存到 ${result.path}`, 2400);
        } else {
          await copyBlob(blob);
          toast('已复制到剪贴板，按 Ctrl+V 粘贴到输入框', 1800);
        }
      } catch (error) {
        setState({ busy: false, phase: 'error', error: error instanceof Error ? error.message : String(error) });
      }
    }

    function onKey(event) {
      if (event.altKey && !event.ctrlKey && !event.metaKey && event.code === 'KeyA') {
        if (state.phase === 'ready' || state.phase === 'capturing') return;
        event.preventDefault();
        event.stopPropagation();
        void begin(event.shiftKey ? 'direct' : 'hidden');
      }
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style');
          style.setAttribute('data-dsh-screenshot', 'styles');
          style.textContent = CSS;
          document.head.appendChild(style);
          return () => style.remove();
        });

        ctx.effect(() => {
          window.addEventListener('keydown', onKey, true);
          return () => window.removeEventListener('keydown', onKey, true);
        });

        ctx.effect(() => () => {
          close({ focus: false });
        });

        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.composer.dock',
              id: 'dsh-screenshot',
              order: 8,
            },
            ScreenshotButton,
          ),
        );

        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            {
              name: 'shell.overlay',
              id: 'dsh-screenshot-overlay',
              order: 100,
            },
            Overlay,
          ),
        );
      },
    };
  },
});
