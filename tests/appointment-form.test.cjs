// Exercise the real component with a small hook/JSX harness and fake timers.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../components/appointment-form.tsx'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText;

function harness(fetchMock) {
  const hooks = [];
  const effects = [];
  const timers = new Map();
  let cursor = 0;
  let nextTimer = 0;
  let mounted = true;
  let updatesAfterUnmount = 0;
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = initial;
      return [hooks[index], (value) => { if (!mounted) updatesAfterUnmount++; hooks[index] = value; }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = { current: initial };
      return hooks[index];
    },
    useEffect(effect) {
      const index = cursor++;
      if (!(index in hooks)) { hooks[index] = true; effects.push(effect); }
    },
  };
  const jsx = (type, props) => ({ type, props });
  const modules = {
    react,
    'react/jsx-runtime': { jsx, jsxs: jsx },
    '../lib/site': { services: [{ name: 'Immigration', slug: 'immigration' }] },
    '../public/api/appointment-options.json': { otherService: 'Other', times: ['Morning'] },
  };
  const module = { exports: {} };
  const context = {
    module, exports: module.exports, require: (name) => {
      if (!(name in modules)) throw new Error(`Unexpected import: ${name}`);
      return modules[name];
    },
    AbortController, DOMException, Error, TypeError, Intl, URLSearchParams,
    window: { location: { search: '' } },
    FormData: class { constructor(form) { this.form = form; } get(name) { return this.form.values[name] ?? null; } },
    fetch: fetchMock,
    setTimeout(callback, delay) { const id = ++nextTimer; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  vm.runInNewContext(compiled, context);
  function render() { cursor = 0; return module.exports.AppointmentForm(); }
  const first = render();
  const cleanups = effects.map((effect) => effect()).filter((cleanup) => typeof cleanup === 'function');
  const form = {
    values: { name: 'Jane', email: 'jane@example.invalid', service: 'Immigration', date: '2030-01-01', time: 'Morning', message: 'Hello', website: '' },
    resetCount: 0,
    reset() { this.resetCount++; },
  };
  function find(node, predicate) {
    if (!node || typeof node !== 'object') return undefined;
    if (predicate(node)) return node;
    const children = node.props?.children;
    for (const child of Array.isArray(children) ? children : [children]) {
      const match = find(child, predicate);
      if (match) return match;
    }
    return undefined;
  }
  return {
    form, timers,
    submit() { return first.props.onSubmit({ preventDefault() {}, currentTarget: form }); },
    button() { return find(render(), (node) => node.type === 'button'); },
    message() { return find(render(), (node) => node.props?.role === 'alert' || node.props?.role === 'status'); },
    timeout() { const timer = [...timers.values()][0]; assert.equal(timer.delay, 30000); timer.callback(); },
    unmount() { mounted = false; for (const cleanup of cleanups) cleanup(); },
    updatesAfterUnmount() { return updatesAfterUnmount; },
  };
}

function response(status, payload) {
  return { ok: status >= 200 && status < 300, json: async () => payload };
}

test('successful submission resets the form and clears its timer', async () => {
  let signal;
  const h = harness(async (_url, options) => { signal = options.signal; return response(200, { ok: true, message: 'Sent' }); });
  await h.submit();
  assert.equal(signal.aborted, false);
  assert.equal(h.form.resetCount, 1);
  assert.equal(h.button().props.disabled, false);
  assert.equal(h.message().props.role, 'status');
  assert.equal(h.timers.size, 0);
});

for (const status of [400, 422, 429, 503]) {
  test(`HTTP ${status} preserves input and displays the server message`, async () => {
    const h = harness(async () => response(status, { ok: false, message: `Error ${status}` }));
    await h.submit();
    assert.equal(h.form.resetCount, 0);
    assert.equal(h.form.values.message, 'Hello');
    assert.equal(h.message().props.children, `Error ${status}`);
    assert.equal(h.button().props.disabled, false);
    assert.equal(h.timers.size, 0);
  });
}

test('network failure and malformed responses show appropriate errors', async () => {
  for (const [fetchMock, expected] of [
    [async () => { throw new TypeError('offline'); }, /could not connect/],
    [async () => ({ ok: true, json: async () => { throw new SyntaxError('bad JSON'); } }), /unexpected response/],
    [async () => response(200, { ok: false, message: 'bad' }), /unexpected response/],
  ]) {
    const h = harness(fetchMock);
    await h.submit();
    assert.match(h.message().props.children, expected);
    assert.equal(h.form.resetCount, 0);
    assert.equal(h.timers.size, 0);
  }
});

test('timeout aborts, preserves data, prevents duplicate submission, and releases loading', async () => {
  let calls = 0;
  let signal;
  const h = harness((_url, options) => {
    calls++;
    signal = options.signal;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
  });
  const pending = h.submit();
  assert.equal(h.button().props.disabled, true);
  await h.submit();
  assert.equal(calls, 1);
  h.timeout();
  await pending;
  assert.equal(signal.aborted, true);
  assert.equal(h.form.resetCount, 0);
  assert.equal(h.form.values.name, 'Jane');
  assert.equal(h.button().props.disabled, false);
  assert.equal(h.message().props.children, 'Your request timed out. It may have been received by our team. Please contact us before submitting again to avoid sending a duplicate request.');
  assert.equal(h.timers.size, 0);
});

test('timeout during JSON parsing reports uncertain delivery', async () => {
  let markStarted;
  const started = new Promise((resolve) => { markStarted = resolve; });
  const h = harness(async (_url, options) => ({
    ok: true,
    json: () => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      markStarted();
    }),
  }));
  const pending = h.submit();
  await started;
  h.timeout();
  await pending;
  assert.match(h.message().props.children, /may have been received/);
  assert.equal(h.form.resetCount, 0);
  assert.equal(h.timers.size, 0);
});

test('unmount aborts the active request without updating the unmounted component', async () => {
  let signal;
  const h = harness((_url, options) => {
    signal = options.signal;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
  });
  const pending = h.submit();
  h.unmount();
  await pending;
  assert.equal(signal.aborted, true);
  assert.equal(h.timers.size, 0);
  assert.equal(h.updatesAfterUnmount(), 0);
});
