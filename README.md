# Proyecto Módulo 8

Este proyecto consiste en el desarrollo de una API REST utilizando Node.js, Express y PostgreSQL, implementando Sequelize como ORM.

La aplicación permite gestionar usuarios y pedidos, manejar autenticación con JWT y realizar subida de archivos al servidor.

## Tecnologías utilizadas

* Node.js
* Express
* PostgreSQL
* Sequelize (ORM)
* JSON Web Token (JWT)
* express-fileupload
* dotenv
* fs (manejo de archivos)

## Instrucciones para instalación y ejecución

1. Clonar el repositorio o descargar el proyecto
2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env` en la raíz del proyecto:

```env
DB_NAME=modulo7_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD
DB_HOST=localhost
DB_PORT=5432
PORT=3000
JWT_SECRET=clave_super_secreta
```

4. Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE modulo7_db;
```

5. Ejecutar el proyecto:

```bash
npm run dev
```
## Autenticación (JWT)

Para acceder a rutas protegidas, se debe obtener un token mediante login en postman o similares.

### Cómo hacer el Login

En postman, 
**POST** `http://localhost:3000/api/login`

```json
{
  "email": "ximena@gmail.com",
  "password": "1234"
}
```
Como respuesta deberías recibir algo asi:

```
{
    "status": 200,
    "message": "Login existoso",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsIm5vbWJyZSI6IlhpbWVuYSIsImVtYWlsIjoieGltZW5hQGdtYWlsLmNvbSIsImlhdCI6MTc3NTM1NjQ3OCwiZXhwIjoxNzc1MzYwMDc4fQ.qfz4TjRUl37Wt0Nsla32NrPuG-skysnqESFCqWw66Vo",
        "user": {
            "id": 38,
            "nombre": "Ximena",
            "email": "ximena@gmail.com"
        }
    }
}

```

De esta respuesta, lo que nos importa es el "token".

### Uso del token

Agregar en headers:

```http
Authorization: Bearer TU_TOKEN
```

---

## Endpoints principales

### Usuarios

* GET `/api/usuarios` → obtener todos los usuarios (protegido)
* POST `/api/usuarios` → crear usuario
* PUT `/api/usuarios/:id` → actualizar usuario (protegido)
* DELETE `/api/usuarios/:id` → eliminar usuario (protegido)

---

### Pedidos

* GET `/api/pedidos` → obtener pedidos (protegido)
* POST `/api/pedidos` → crear pedido (protegido)

---

### Relaciones

* GET `/api/usuarios/:id/pedidos` → pedidos de un usuario (protegido)
* GET `/api/usuarios-con-pedidos` → todos los usuarios con pedidos (protegido)

---

### Upload de archivos

* POST `/api/upload` → subir archivo (protegido)
* DELETE `/api/upload/:nombre` → eliminar archivo (protegido)

---

## Subida de archivos

* Se aceptan archivos: `jpg`, `jpeg`, `png`, `pdf`
* Tamaño máximo: 2MB
* Los archivos se almacenan en la carpeta `/uploads`

Para acceder a un archivo:

```http
http://localhost:3000/uploads/NOMBRE_DEL_ARCHIVO
```

---

## Relación entre modelos

Se implementa una relación 1:N entre usuarios y pedidos, dado que un mismo usuario puede tener múltiples pedidos, pero un pedido puede pertenecer sólo a un usuario.

---

## Transacciones

Se implementan transacciones con Sequelize para asegurar consistencia en operaciones críticas, permitiendo rollback en caso de error.

---

## Consideraciones

* Las rutas protegidas corresponden a las rutas más críticas de la API, y se encuentran bajo autenticación JWT, con el objetivo de resguardar la integridad y seguridad de los datos.

Las rutas protegidas corresponden principalmente a aquellas que permiten por ejemplo:
    - Visualizar información sensible como listas de usuarios y pedidos.
    - Modificar o eliminar datos existentes.
    - Crear registros asociados a bases de datos.
    - Subir y eliminar archivos del servidor.

Se decidió proteger estas rutas porque este tipo de acciones no debería estar disponible para cualquie usuario sin autenticar, ya que podrían comprometer la información del sistema o permitir manipulaciones indebidas de datos.

Asi mismo, se mantuvieron públicas las rutas necesarias para el acceso inicial, como el registro y el login.

De esta manera, se puede asegurar que sólo usuarios autenticados puedan acceder a funcionalidades críticas, replicando un comportamiento similar al de aplicaciones reales donde se requiere validación de identidad antes de operar sobre los datos.

* Las contraseñas actualmente se manejan en texto plano para simplificar la implementación del flujo de autenticación con JWT. Si bien, esto permite demostrar el funcionamiento del login de manera clara, no es una práctica recomendada en entornos reales, puesto que expone un riesgo de seguridad importante en caso de filtración de la base de datos. Como mejora futura, se recomienda usar bcrypt para hashear las contraseñas antes de almacenarlas y comparar de forma segura durante el inicio de sesión.

* Para poder consumir correctamente los endpoints de la API, el servidor debe estar en ejecución en el entorno local. Esto significa que antes de realizar pruebas en Postman o similares, se debe iniciar la aplicación en consola mediante el comando correspondiente "npm run dev" o "npm start". Si el servidor no está activo, las rutas no responderán y no será posible acceder ni a las rutas protegidas ni a los recursos públicos.

* El proyecto fue desarrollado para ejecutarse en un entorno local, por lo que su funcionamiento depende también de una configuración correcta del archivo ".env", de la base de datos PostgreSQL activa y de las dependencias instaladas con "npm install". En caso de mover el proyecto a otro equipo, es necesario configurar estos elementos para su correcta ejecución.
