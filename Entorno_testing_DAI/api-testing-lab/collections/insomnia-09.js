insomnia.test('Status 200', () => insomnia.expect(insomnia.response.status).to.eql(200));
insomnia.test('Content-Type JSON', () => { const h = insomnia.response.headers.find(h => h.key.toLowerCase() === 'content-type'); insomnia.expect(h.value).to.include('application/json'); });
const body = insomnia.response.json();
insomnia.test('Es la tarea creada', () => insomnia.expect(body.id).to.eql(2));
insomnia.test('Título guardado', () => insomnia.expect(body.title).to.eql('Probar API en clase'));
