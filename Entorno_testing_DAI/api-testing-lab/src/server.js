const { createApp } = require('./app');
const port = Number(process.env.PORT || 3000);
const server = createApp().listen(port, '127.0.0.1', () => console.log(`Demo disponible en http://127.0.0.1:${port}`));
server.on('error', err => { console.error(err.code === 'EADDRINUSE' ? `El puerto ${port} está ocupado. Cerrá la otra API o cambiá PORT.` : err.message); process.exit(1); });
