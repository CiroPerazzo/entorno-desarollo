insomnia.test('Status 401', () => insomnia.expect(insomnia.response.status).to.eql(401));
insomnia.test('Content-Type JSON', () => { const h = insomnia.response.headers.find(h => h.key.toLowerCase() === 'content-type'); insomnia.expect(h.value).to.include('application/json'); });
const body = insomnia.response.json();
insomnia.test('Error explicado', () => insomnia.expect(body.error).to.eql('Credenciales inválidas'));
