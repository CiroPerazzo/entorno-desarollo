const newman = require('newman');
const fs = require('node:fs');
const path = require('node:path');
const { createApp } = require('../src/app');
const fail = process.argv.includes('--fallo');
const auto = process.argv.includes('--auto');
const collectionPath = path.join(__dirname, '../collections', fail ? 'fallo-controlado.postman_collection.json' : 'dai.postman_collection.json');
fs.mkdirSync(path.join(__dirname, '../reports'), { recursive: true });
let server;
function run(baseUrl) {
  newman.run({
    collection: JSON.parse(fs.readFileSync(collectionPath, 'utf8')),
    envVar: [{ key: 'baseUrl', value: baseUrl }],
    reporters: ['cli', 'json', 'junit'],
    reporter: {
      json: { export: path.join(__dirname, '../reports', fail ? 'newman-fallo.json' : 'newman.json') },
      junit: { export: path.join(__dirname, '../reports', fail ? 'newman-fallo.xml' : 'newman.xml') }
    },
    timeoutRequest: 5000
  }, (err, summary) => {
    if (err) console.error(err.message);
    const failed = Boolean(err || !summary || summary.run.failures.length);
    if (server) server.close();
    process.exitCode = failed ? 1 : 0;
  });
}
if (auto) {
  server = createApp().listen(0, '127.0.0.1', () => run(`http://127.0.0.1:${server.address().port}`));
} else {
  run(process.env.BASE_URL || 'http://127.0.0.1:3000');
}
