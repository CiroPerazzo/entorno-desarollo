// Harness local: comprueba los scripts contra HTTP real, no la importación de la UI.
const vm = require('node:vm');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createApp } = require('./src/app');
const data = JSON.parse(fs.readFileSync('collections/dai.insomnia.json'));
const env = data.resources.find(r => r._type === 'environment').data;
let checks = 0;
const server = createApp().listen(0, '127.0.0.1', async () => {
  env.baseUrl = `http://127.0.0.1:${server.address().port}`;
  const substitute = s => s.replace(/{{\s*_\.(\w+)\s*}}/g, (_, k) => env[k]);
  try {
    for (const req of data.resources.filter(r => r._type === 'request')) {
      const res = await fetch(substitute(req.url), { method: req.method, headers: Object.fromEntries(req.headers.map(h => [h.name, substitute(h.value)])), ...(req.body.text ? {body:req.body.text}: {}) });
      const text = await res.text();
      const insomnia = {
        response: { status: res.status, json: () => JSON.parse(text), text: () => text, headers: [...res.headers].map(([key,value]) => ({key,value})) },
        test: (name, cb) => { cb(); checks++; },
        expect: actual => ({to: {eql: expected => assert.deepEqual(actual, expected), include: expected => assert.ok(actual.includes(expected))}}),
        baseEnvironment: {set: (key,value) => {env[key] = value;}}
      };
      vm.runInNewContext(req.afterResponseScript, {insomnia}, {timeout:1000});
      console.log(`OK ${req.name}`);
    }
    console.log(`${checks} aserciones de scripts Insomnia aprobadas mediante harness local. No verifica UI/importador real.`);
  } catch (err) { console.error(err); process.exitCode = 1; }
  finally {server.close();}
});
