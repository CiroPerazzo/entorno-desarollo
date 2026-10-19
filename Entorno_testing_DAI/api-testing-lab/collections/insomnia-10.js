insomnia.test('Status 400', () => insomnia.expect(insomnia.response.status).to.eql(400));
insomnia.test('Content-Type JSON', () => { const h = insomnia.response.headers.find(h => h.key.toLowerCase() === 'content-type'); insomnia.expect(h.value).to.include('application/json'); });
const body = insomnia.response.json();
insomnia.test('Rechaza string', () => insomnia.expect(body.error).to.eql('completed debe ser booleano'));
