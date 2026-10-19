insomnia.test('Status 404', () => insomnia.expect(insomnia.response.status).to.eql(404));
insomnia.test('Content-Type JSON', () => { const h = insomnia.response.headers.find(h => h.key.toLowerCase() === 'content-type'); insomnia.expect(h.value).to.include('application/json'); });
const body = insomnia.response.json();
insomnia.test('Ya no existe', () => insomnia.expect(body.error).to.eql('Tarea no encontrada'));
