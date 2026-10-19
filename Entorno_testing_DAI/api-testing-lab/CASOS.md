# Casos compartidos en Postman, Newman e Insomnia

| Caso | Método y ruta | HTTP esperado |
|---|---|---|
| 00 Reiniciar datos | `POST /api/testing/reset` | 200 |
| 01 API encendida | `GET /api/health` | 200 |
| 02 Login incorrecto | `POST /api/login` | 401 |
| 03 Login correcto | `POST /api/login` | 200 |
| 04 Listado inicial | `GET /api/tasks` | 200 |
| 05 Crear sin token | `POST /api/tasks` | 401 |
| 06 Crear título inválido | `POST /api/tasks` | 400 |
| 07 Errores no crearon tareas | `GET /api/tasks` | 200 |
| 08 Crear tarea válida | `POST /api/tasks` | 201 |
| 09 Consultar tarea creada | `GET /api/tasks/{{taskId}}` | 200 |
| 10 Completar con tipo incorrecto | `PATCH /api/tasks/{{taskId}}` | 400 |
| 11 Completar tarea | `PATCH /api/tasks/{{taskId}}` | 200 |
| 12 Borrar tarea | `DELETE /api/tasks/{{taskId}}` | 204 |
| 13 Consultar tarea borrada | `GET /api/tasks/{{taskId}}` | 404 |
| 14 Listado final limpio | `GET /api/tasks` | 200 |

Un 400, 401 o 404 esperado debe aprobar el test. No es una prueba fallida: confirma que la API rechazó correctamente la solicitud.
