insomnia.test('Status 201', () => insomnia.expect(insomnia.response.status).to.eql(201));
insomnia.test('Content-Type JSON', () => { const h = insomnia.response.headers.find(h => h.key.toLowerCase() === 'content-type'); insomnia.expect(h.value).to.include('application/json'); });
const body = insomnia.response.json();
insomnia.test('Identificador correcto', () => insomnia.expect(body.id).to.eql(2));
insomnia.test('Título correcto', () => insomnia.expect(body.title).to.eql('Probar API en clase'));
insomnia.test('Comienza pendiente', () => insomnia.expect(body.completed).to.eql(false));
insomnia.baseEnvironment.set('taskId', String(body.id));
