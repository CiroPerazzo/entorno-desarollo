# Entorno de prueba — TP DAI, tema 10

Una misma API de tareas para comparar **Postman, Insomnia, Newman y Supertest**. Los datos son ficticios y se guardan en memoria: no hay que crear una base de datos ni un archivo `.env`.

## 1. Arranque en Windows

1. Instalá Node.js 22 o superior, si todavía no lo tenés. Verificá con `node -v` y `npm -v`.
2. Extraé el ZIP completo. Abrí la carpeta `api-testing-lab` en VS Code.
3. Abrí Terminal > Nueva terminal y ejecutá:

```powershell
npm ci
npm start
```

Dejá esta terminal abierta. Entrá en **http://127.0.0.1:3000** desde el navegador: vas a ver la página de bienvenida. En **http://127.0.0.1:3000/api/tasks** vas a ver las tareas en JSON.

La instalación necesita internet. Una vez instaladas las dependencias, la API y las pruebas de terminal trabajan localmente. Las aplicaciones visuales deben estar instaladas por separado. Este ZIP no las instala.

Si PowerShell dice que `npm.ps1` no puede ejecutarse, usá una terminal de tipo **Command Prompt / Símbolo del sistema** en VS Code, o escribí `npm.cmd` en lugar de `npm`.

## 2. Probar con Postman

1. Usá la aplicación de escritorio de Postman. Si usás la versión web, necesitás su agente de escritorio para acceder al servidor local.
2. Elegí **Import** y seleccioná `collections/dai.postman_collection.json`.
3. Abrí la colección **DAI — Laboratorio de testing**. En sus variables, `baseUrl` debe valer `http://127.0.0.1:3000`.
4. Abrí **00 Reiniciar datos** y presioná **Send**. Luego probá **01 API encendida** y mirá los resultados de las pruebas de la respuesta.
5. Para el flujo completo, elegí **Run / Collection Runner**, seleccioná los 15 pedidos, mantené el orden **00 a 14**, elegí una iteración y ejecutá.
6. La solicitud 03 guarda el token. La 08 guarda el identificador de la tarea. Las siguientes reutilizan esos valores.

Los tests están en **Scripts > Post-response**. Cada `pm.test` representa una comprobación. Revisá status, Content-Type y contenido del JSON. No necesitás importar un entorno separado: las variables están en la colección. Si creás un entorno propio, evitá que tenga variables vacías con los mismos nombres porque pueden ocultar las de la colección.

**Resultado esperado:** 15 solicitudes y 50 aserciones aprobadas. Las solicitudes que devuelven 400, 401 o 404 también aprueban porque ese rechazo es el comportamiento esperado.

## 3. Probar con Newman

Newman ya se instala como dependencia del proyecto; no hace falta instalarlo globalmente.

Con `npm start` abierto en la primera terminal, abrí una segunda y ejecutá:

```powershell
npm run test:newman
```

Vas a ver el reporte de las mismas pruebas de la colección. Se generan `reports/newman.json` y `reports/newman.xml`.

También podés ejecutar Newman directamente:

```powershell
npx newman run collections/dai.postman_collection.json
```

Si querés verificar todo sin iniciar la API manualmente:

```powershell
npm run test:newman:auto
```

Este último comando inicia una instancia temporal de la API en un puerto libre, corre Newman y la cierra. No modifica la instancia que tenés abierta en el puerto 3000.

La colección entregada usa el formato **v2.1 JSON**, compatible con Newman. Si luego la modificás en Postman, conservá ese formato para seguir usando Newman.

## 4. Probar con Insomnia

1. Con la API encendida, abrí Insomnia y elegí **Import / From File**.
2. Seleccioná **`collections/dai.insomnia.json`**. Es una colección nativa con scripts `insomnia.test`.
3. Revisá **Base Environment**: `baseUrl` debe ser `http://127.0.0.1:3000`. `token` y `taskId` comienzan vacíos y se completan al ejecutar el flujo.
4. Abrí **00 Reiniciar datos**, enviá la solicitud y revisá **Scripts > After-response** y los resultados de sus tests.
5. Ejecutá las solicitudes en orden, **00 a 14**, o usá el **Collection Runner** manteniendo ese orden y una sola iteración. La solicitud 03 prepara el token y la 08 el identificador.
6. Comprobá que las 50 aserciones aprueben, incluidos los rechazos esperados.

**Alternativa de importación:** Insomnia permite importar `collections/dai.postman_collection.json` y convertir sus scripts. Usá una sola de las dos colecciones para la demostración para no confundirlas.

Si tu versión importa solicitudes pero no conserva scripts, hay una copia de cada script nativo en `collections/insomnia-00.js` a `insomnia-14.js`: pegá el que corresponda en **After-response** de cada solicitud. Para una comprobación rápida, empezá por 00 y 01, y después ejecutá el flujo completo. No alcanza con ver el status de la respuesta: tienen que aparecer las comprobaciones.

**Alcance de la verificación:** las aplicaciones de escritorio Postman e Insomnia no fueron abiertas en este entorno. Los archivos, scripts y la API se entregan preparados; hay que comprobar la importación visual en tu computadora. Las 50 aserciones de los scripts nativos también se comprobaron con un harness local contra la API real (`node check-insomnia.cjs`); esto no valida el importador ni la interfaz de Insomnia. La documentación oficial y las fuentes están al final.

## 5. Probar con Supertest

En una terminal dentro del proyecto:

```powershell
npm run test:supertest
```

No necesitás tener `npm start` abierto. Supertest prueba instancias independientes de la aplicación usando puertos temporales. Los tests están en **`tests/api.test.js`** y el runner es `node:test`.

**Resultado esperado:** 11 tests aprobados. Algunos contienen varias solicitudes o valores inválidos. No se compara esa cantidad directamente con las 50 aserciones de Newman: los casos están agrupados de otra manera.

Ejemplo: `.expect(201)` comprueba que la creación respondió con 201. `assert.equal(res.body.completed, true)` comprueba un valor del cuerpo. Supertest envía el pedido HTTP; `node:test` ejecuta los tests y muestra el reporte.

## 6. Verificación completa y falla intencional

```powershell
npm run verify
```

Ejecuta Supertest y Newman con su propia API temporal. Termina correctamente solo si ambos aprueban.

Para mostrar cómo se detecta una prueba fallida:

```powershell
npm run demo:fallo
```

Este comando usa una colección separada. Pide `/api/health`, que responde 200, pero su aserción espera 201. **Debe mostrar una falla y terminar con código 1.** Eso es intencional: la API sigue bien, la expectativa escrita es incorrecta. La colección principal queda intacta. Después ejecutá `npm run test:newman:auto` para mostrar el resultado correcto.

También podés importar `collections/fallo-controlado.postman_collection.json` en Postman para verlo visualmente.

## 7. Cómo explicarlo en la presentación

Duración sugerida de la demo: 5 a 7 minutos.

1. **Problema:** «Tenemos varios endpoints y queremos comprobarlos después de cada cambio sin revisar todo a mano».
2. **Postman:** mostrar una solicitud válida, una inválida y sus scripts. «Las condiciones guardadas deciden si la respuesta cumple lo esperado». Después ejecutar la colección completa.
3. **Newman:** ejecutar `npm run test:newman`. «Son las mismas solicitudes y aserciones, ejecutadas desde la terminal». Mostrar el resumen y un reporte.
4. **Insomnia:** mostrar un caso y su script After-response; ejecutar la colección. «Es otra interfaz para preparar solicitudes y pruebas sobre la misma API».
5. **Supertest:** mostrar un test en `tests/api.test.js` y ejecutar `npm run test:supertest`. «Acá las pruebas viven en el código del backend y las ejecuta node:test».
6. **Falla controlada:** ejecutar `npm run demo:fallo` y explicar la diferencia entre el status recibido y el esperado.

Conclusión para decir: «Postman e Insomnia permiten diseñar solicitudes y ejecutar comprobaciones desde una interfaz. Newman ejecuta la colección de Postman desde la terminal. Supertest permite escribir pruebas HTTP en JavaScript dentro del proyecto. En todos los casos, primero tenemos que definir qué respuesta esperamos».

## 8. Contrato de esta API

URL base: `http://127.0.0.1:3000`.

| Método | Ruta | Función | Respuestas principales |
|---|---|---|---|
| GET | `/api/health` | Estado del servidor | 200 |
| POST | `/api/testing/reset` | Restablecer datos ficticios | 200 |
| POST | `/api/login` | Obtener token de demostración | 200, 401 |
| GET | `/api/tasks` | Listar tareas | 200 |
| GET | `/api/tasks/:id` | Consultar una tarea | 200, 404 |
| POST | `/api/tasks` | Crear tarea, con token | 201, 400, 401 |
| PATCH | `/api/tasks/:id` | Cambiar completed, con token | 200, 400, 401, 404 |
| DELETE | `/api/tasks/:id` | Borrar tarea, con token | 204, 401, 404 |

Login: `{"email":"alumno@demo.com","password":"Demo1234!"}`.

Crear: `{"title":"Probar API en clase"}`. Título de 3 a 100 caracteres sin contar espacios en los extremos.

Completar: `{"completed":true}`. Debe ser booleano, no el texto `"true"`.

Header para modificar tareas: `Authorization: Bearer token-demo-dai`.

## 9. Problemas frecuentes

- **ECONNREFUSED / no conecta:** iniciá `npm start`, mantené esa terminal abierta y verificá `baseUrl`.
- **Puerto ocupado:** detené otra instancia con Ctrl+C. Para usar otro puerto en PowerShell: `$env:PORT=3001`, luego `npm start`. Cambiá `baseUrl` a `http://127.0.0.1:3001`. Para Newman: `$env:BASE_URL='http://127.0.0.1:3001'`, luego `npm run test:newman`.
- **401 al crear una tarea válida:** ejecutá primero el login 03 y revisá el header Authorization.
- **Variable taskId vacía:** ejecutá primero la creación 08.
- **Datos inesperados:** volvé a ejecutar desde 00. No corras Postman, Insomnia y Newman a la vez contra el mismo servidor: comparten los datos.
- **404 después de borrar:** es lo esperado; la tarea ya no existe.

## 10. Alcance didáctico y archivos

Es una API nueva de práctica, separada del TP11. No modifica ese repositorio. El token fijo simula autenticación: no implementa JWT, usuarios reales ni seguridad de producción. El endpoint reset solo reinicia los datos ficticios de esta API. El servidor escucha únicamente en 127.0.0.1.

- `src/app.js`: rutas, validaciones y estado de la API.
- `src/server.js`: inicio del servidor local.
- `collections/`: colecciones y scripts de prueba.
- `tests/api.test.js`: tests con Supertest.
- `scripts/run-newman.js`: ejecución de Newman y reportes.
- `CASOS.md`: listado de escenarios y códigos esperados.
- `reports/`: resultados de las ejecuciones.
- `package-lock.json`: versiones de dependencias para `npm ci`.

## Fuentes oficiales

- Insomnia: scripts e importación de Postman: https://developer.konghq.com/insomnia/scripts/
- Insomnia: pruebas de APIs: https://developer.konghq.com/insomnia/test/
- Newman: instalación y ejecución: https://learning.postman.com/docs/reference/newman-cli/installing-running-newman/
- Newman: compatibilidad de colecciones: https://learning.postman.com/docs/reference/newman-cli/command-line-integration-with-newman/
- Supertest: https://github.com/forwardemail/supertest
- Node.js test runner: https://nodejs.org/api/test.html
