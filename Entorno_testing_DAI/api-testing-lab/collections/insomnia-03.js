insomnia.test('Status 200', () => insomnia.expect(insomnia.response.status).to.eql(200));
insomnia.test('Content-Type JSON', () => { const h = insomnia.response.headers.find(h => h.key.toLowerCase() === 'content-type'); insomnia.expect(h.value).to.include('application/json'); });
const body = insomnia.response.json();
insomnia.test('Token recibido', () => insomnia.expect(body.token).to.eql('token-demo-dai'));
insomnia.test('Email correcto', () => insomnia.expect(body.user.email).to.eql('alumno@demo.com'));
insomnia.test('No expone contraseña', () => insomnia.expect(Object.prototype.hasOwnProperty.call(body.user, 'password')).to.eql(false));
insomnia.baseEnvironment.set('token', body.token);
