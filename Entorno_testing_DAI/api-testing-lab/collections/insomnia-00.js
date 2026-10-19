insomnia.test('Status 200', () => insomnia.expect(insomnia.response.status).to.eql(200));
insomnia.test('Content-Type JSON', () => { const h = insomnia.response.headers.find(h => h.key.toLowerCase() === 'content-type'); insomnia.expect(h.value).to.include('application/json'); });
const body = insomnia.response.json();
insomnia.test('Reset confirmado', () => insomnia.expect(body.reset).to.eql(true));
insomnia.baseEnvironment.set('token', '');
insomnia.baseEnvironment.set('taskId', '');
