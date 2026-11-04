// Integration tests use a local PHP server and a fake PHPMailer; no mail is sent.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');

const php = process.env.PHP_BIN || 'php';
const root = path.resolve(__dirname, '..');
const fakeMailer = `<?php
namespace PHPMailer\\PHPMailer;
#[\\AllowDynamicProperties]
class PHPMailer {
    const ENCRYPTION_SMTPS = 'ssl';
    const ENCRYPTION_STARTTLS = 'tls';
    const CHARSET_UTF8 = 'UTF-8';
    private array $calls = [];
    public function __construct($exceptions) {}
    public function __call($name, $args) { $this->calls[$name] = $args; }
    public function send() {
        if (file_get_contents(getenv('TEST_MAIL_MODE')) === 'fail') throw new \\Exception('secret must not be returned');
        file_put_contents(getenv('TEST_MAIL_LOG'), json_encode(['calls' => $this->calls, 'subject' => $this->Subject, 'body' => $this->Body, 'port' => $this->Port, 'secure' => $this->SMTPSecure]));
    }
}`;

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

test('appointment PHP endpoint', async (t) => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'dembassy-api-test-'));
  const web = path.join(temp, 'public_html');
  const api = path.join(web, 'api');
  const privateDir = path.join(temp, 'dembassy-mailer');
  const modeFile = path.join(temp, 'mode');
  const logFile = path.join(temp, 'mail.json');
  const rateFile = path.join(privateDir, 'rate-limit.json');
  const configFile = path.join(privateDir, 'config.php');
  const vendor = path.join(privateDir, 'vendor');
  await fs.mkdir(api, { recursive: true });
  await fs.mkdir(vendor, { recursive: true });
  for (const file of ['appointment.php', 'services.json', 'appointment-options.json']) {
    await fs.copyFile(path.join(root, 'public', 'api', file), path.join(api, file));
  }
  await fs.writeFile(path.join(vendor, 'autoload.php'), fakeMailer);
  await fs.writeFile(modeFile, 'success');
  const config = `<?php return ['SMTP_HOST'=>'example.invalid','SMTP_USERNAME'=>'test','SMTP_PASSWORD'=>'test','SMTP_FROM'=>'sender@example.invalid','APPOINTMENT_TO'=>'team@example.invalid'];`;
  await fs.writeFile(configFile, config);

  const servers = [];
  t.after(async () => {
    for (const server of servers) server.kill();
    await Promise.all(servers.map((server) => new Promise((resolve) => server.exitCode !== null ? resolve() : server.once('exit', resolve))));
    await fs.rm(temp, { recursive: true, force: true });
  });
  async function startServer(overrides = {}) {
    const port = await freePort();
    const env = { ...process.env, TEST_MAIL_MODE: modeFile, TEST_MAIL_LOG: logFile };
    for (const key of ['SMTP_HOST', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM', 'SMTP_PORT', 'SMTP_ENCRYPTION', 'APPOINTMENT_TO', 'APPOINTMENT_AUTOLOAD']) delete env[key];
    Object.assign(env, overrides);
    const server = spawn(php, ['-S', `127.0.0.1:${port}`, '-t', web], { env, stdio: 'ignore' });
    servers.push(server);
    const url = `http://127.0.0.1:${port}/api/appointment.php`;
    for (let i = 0; i < 100; i++) {
      try { await fetch(url); return url; } catch { await new Promise((resolve) => setTimeout(resolve, 50)); }
    }
    throw new Error('PHP test server did not start; set PHP_BIN to a PHP executable.');
  }
  const urls = await Promise.all(Array.from({ length: 4 }, startServer));
  const future = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  const valid = { name: 'José 李', email: 'visitor@example.invalid', service: 'Immigration', date: future, time: 'Morning', message: 'Hello 世界', website: '' };
  async function send(data, url = urls[0]) {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: typeof data === 'string' ? data : JSON.stringify(data) });
    return { status: response.status, body: await response.json() };
  }
  async function reset() { await fs.writeFile(rateFile, ''); }

  await t.test('accepts every displayed service and time; sends a readable copy and Reply-To', async () => {
    const services = JSON.parse(await fs.readFile(path.join(api, 'services.json'), 'utf8'));
    const options = JSON.parse(await fs.readFile(path.join(api, 'appointment-options.json'), 'utf8'));
    for (const service of [...services.map((item) => item.name), options.otherService]) {
      for (const time of options.times) {
        await reset();
        const result = await send({ ...valid, service, time, message: '' });
        assert.equal(result.status, 200);
      }
    }
    await reset();
    assert.equal((await send(valid)).status, 200);
    const mail = JSON.parse(await fs.readFile(logFile, 'utf8'));
    assert.equal(mail.calls.addAddress[0], 'team@example.invalid');
    assert.equal(mail.calls.addCC[0], valid.email);
    assert.equal(mail.calls.addReplyTo[0], valid.email);
    assert.match(mail.body, /José 李/);
    assert.match(mail.body, /Hello 世界/);
  });

  await t.test('rejects malformed or invalid input and discards honeypots', async () => {
    const wrongType = await fetch(urls[0], { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(valid) });
    assert.equal(wrongType.status, 415);
    for (const [payload, status] of [
      ['{', 400], ['[]', 400], [{ ...valid, name: [] }, 400], [{ ...valid, other: {} }, 400],
      [{ ...valid, name: '' }, 422], [{ ...valid, email: 'bad' }, 422],
      [{ ...valid, name: 'Name\r\nBcc: x' }, 422], [{ ...valid, service: 'Unknown' }, 422],
      [{ ...valid, time: 'Night' }, 422], [{ ...valid, date: '2020-01-01' }, 422],
      [{ ...valid, date: '2030-02-30' }, 422], [{ ...valid, message: 'x'.repeat(3001) }, 422],
      ['x'.repeat(20001), 413], [{ ...valid, website: 'spam' }, 200],
    ]) assert.equal((await send(payload)).status, status, JSON.stringify(payload).slice(0, 150));
  });

  await t.test('fails safely for missing configuration, autoload, or rate storage', async () => {
    await reset();
    await fs.writeFile(configFile, '<?php return [];');
    assert.equal((await send(valid)).status, 503);
    await fs.writeFile(configFile, config);
    await fs.rename(path.join(vendor, 'autoload.php'), path.join(vendor, 'autoload.bak'));
    assert.equal((await send(valid)).status, 503);
    await fs.rename(path.join(vendor, 'autoload.bak'), path.join(vendor, 'autoload.php'));
    await fs.unlink(rateFile);
    await fs.mkdir(rateFile);
    assert.equal((await send(valid)).status, 503);
    await fs.rmdir(rateFile);
  });

  await t.test('environment settings take precedence and support SSL port 465', async () => {
    await reset();
    const url = await startServer({ SMTP_FROM: 'override@example.invalid', SMTP_PORT: '465', SMTP_ENCRYPTION: 'ssl' });
    assert.equal((await send(valid, url)).status, 200);
    const mail = JSON.parse(await fs.readFile(logFile, 'utf8'));
    assert.equal(mail.calls.setFrom[0], 'override@example.invalid');
    assert.equal(mail.port, 465);
    assert.equal(mail.secure, 'ssl');
  });

  await t.test('prunes expired entries and enforces the installation-wide limit', async () => {
    const now = Math.floor(Date.now() / 1000);
    await fs.writeFile(rateFile, JSON.stringify([{ time: now - 601, ip: 'a'.repeat(64) }]));
    assert.equal((await send(valid)).status, 200);
    assert.equal(JSON.parse(await fs.readFile(rateFile, 'utf8')).length, 1);
    const records = Array.from({ length: 100 }, (_, i) => ({ time: now, ip: i.toString(16).padStart(64, '0') }));
    await fs.writeFile(rateFile, JSON.stringify(records));
    assert.equal((await send(valid)).status, 429);
    await fs.writeFile(rateFile, '{invalid');
    assert.equal((await send(valid)).status, 503);
  });

  await t.test('real PHPMailer handles a refused SMTP connection', { skip: !process.env.TEST_REAL_AUTOLOAD }, async () => {
    await reset();
    const autoload = process.env.TEST_REAL_AUTOLOAD.replaceAll('\\', '/').replaceAll("'", "\\'");
    await fs.writeFile(configFile, `<?php return ['SMTP_HOST'=>'127.0.0.1','SMTP_PORT'=>'1','SMTP_USERNAME'=>'test','SMTP_PASSWORD'=>'test','SMTP_FROM'=>'sender@example.invalid','APPOINTMENT_AUTOLOAD'=>'${autoload}'];`);
    const result = await send(valid);
    assert.equal(result.status, 503);
    assert.doesNotMatch(result.body.message, /127\.0\.0\.1|test|SMTP connect/);
    await fs.writeFile(configFile, config);
  });

  await t.test('counts failed SMTP attempts and never returns exception details', async () => {
    await reset();
    await fs.writeFile(modeFile, 'fail');
    for (let i = 0; i < 10; i++) {
      const result = await send(valid);
      assert.equal(result.status, 503);
      assert.doesNotMatch(result.body.message, /secret/);
    }
    assert.equal((await send(valid)).status, 429);
    await fs.writeFile(modeFile, 'success');
  });

  await t.test('atomically enforces the limit across concurrent PHP processes', async () => {
    await reset();
    const results = await Promise.all(Array.from({ length: 20 }, (_, i) => send(valid, urls[i % urls.length])));
    assert.equal(results.filter((result) => result.status === 200).length, 10);
    assert.equal(results.filter((result) => result.status === 429).length, 10);
    assert.equal(JSON.parse(await fs.readFile(rateFile, 'utf8')).length, 10);
  });
});
