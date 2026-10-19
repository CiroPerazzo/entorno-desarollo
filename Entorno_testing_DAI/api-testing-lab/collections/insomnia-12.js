insomnia.test('Status 204', () => insomnia.expect(insomnia.response.status).to.eql(204));
insomnia.test('Respuesta sin body', () => insomnia.expect(insomnia.response.text()).to.eql(''));
