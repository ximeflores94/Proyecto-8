const jwt = require('jsonwebtoken');
const fs = require('fs');
//importando el modelo User
const db = require('../models');
const {User, Order } = db;

//Creando una función para obtener todos los usuarios
const getUsers = async (req, res) => {
    try{
        const users = await User.findAll({
            attributes: { exclude: ['password']} //se excluye la contraseña por seguridad
        });

        //Respuesta con los datos
        res.json({
            message: 'Usuarios obtenidos correctamente',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

//función para crear un nuevo usuario
const createUser = async (req, res) => {
    try{
        const { nombre, email, password } = req.body;

        if(!nombre || !email || !password) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios'
            });
        }

        //creando al usuario en la base
        const newUser = await User.create({
            nombre,
            email,
            password
        });

        //respuesta evitando traer la contraseña
        res.status(201).json({
            message: 'Usuario creado correctamente',
            data: {
                id: newUser.id,
                nombre: newUser.nombre,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

//Con esto se actualiza el usuario por su ID
const updateUser = async (req, res) => {
    try {
        
        const {id} = req.params; //obtenemos el ID desde el URL
        const { nombre, email, password } = req.body; //se obtienen los datos desde el body
        const user = await User.findByPk(id);//se busca si el usuario existe por su primary key

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado' //si no existe tal usuario, se manda el mensaje
            });
        }
        //Se actualizan sólo los campos que vengan en la petición, si un campo no viene (vacío), se mantiene el valor anterios.
        user.nombre = nombre || user.nombre;
        user.email = email || user.email;
        user.password = password || user.password;

        //guardamos cambios en la base de datos
        await user.save();

        //se utiliza la respuesta sin incluir la contraseña
        res.json({
            message: 'Usuario actualizado correctamente',
            data: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

//función para eliminar usuarios por ID
const deleteUser = async (req, res) => {
    try{
        const{ id } = req.params;
        const user = await User.findByPk(id);

        if(!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        await user.destroy();
        res.json({
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

//funcion para obtener usuario con pedidos
const getUserWithOrders = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password']},
            include: {
                model: Order
            }
        });
        if (!user){
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            message: 'Usuario con pedidos obtenido correctamente',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener usuario con pedidos',
            error: error.message
        });
    }
};

//Crear usuario más un pedido en una transacción
const createUserWithOrder = async (req, res) => {
    const {nombre, email, password, descripcion, total} = req.body;
    const transaction = await db.sequelize.transaction();
    try {
        const newUser = await User.create(
            {
                nombre,
                email,
                password
            },
            {transaction}
        );
        const newOrder = await Order.create(
            {
                descripcion,
                total,
                userId: newUser.id
            },
            {transaction}
        );

        await transaction.commit();
        res.status(201).json({
            message: 'Usuario y pedidos creados correctamente',
            user: newUser,
            order: newOrder
    });

    } catch (error) {
        await transaction.rollback();

        const log = `
        Fecha: ${new Date().toLocaleDateString()}
        Hora: ${new Date().toLocaleTimeString()}
        Ruta: ${req.originalUrl}
        Método: ${req.method}
        Error: ${error.message}\n`;
        fs.appendFileSync('log_transacciones.txt', log);


        res.status(500).json({
            message: 'Error en la transacción',
            error: error.message
        });
    }
};

//funcion para mostrar tabla de pedidos en HTML
const getUsersWithOrdersHtml = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password']},
            include: {
                model: Order
            }
        });

        if(!user) {
            return res.status(404).send('<h1>Usuario no encontrado<h1/>');
        }

        //construyendo las filas de la tabla con pedidos
        const filasPedidos = user.Orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.descripcion}</td>
                <td>${order.total}</td>
                <td>${order.userId}</td>
            </tr>
         `).join('');

         // se envia a un HTML simple
         res.send(`
              <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Usuario y pedidos</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 30px;
          }
          h1, h2 {
            color: #333;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #163956;
            padding: 10px;
            text-align: left;
          }
            td{
            background-color: #b4d2e0;
            }
          th {
            background-color: #568eb9;
            color: #f5f5d7;
          }
          .card {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            background-color: #294979;
            border-radius: 8px;
            color: #fafff0;
          }
        </style>
      </head>
      <body>
        <h1>Usuario con pedidos</h1>

        <div class="card">
          <p><strong>ID:</strong> ${user.id}</p>
          <p><strong>Nombre:</strong> ${user.nombre}</p>
          <p><strong>Email:</strong> ${user.email}</p>
        </div>

        <h2>Pedidos</h2>

        <table>
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Descripción</th>
              <th>Total</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            ${filasPedidos || '<tr><td colspan="4">No tiene pedidos</td></tr>'}
          </tbody>
        </table>
      </body>
      </html>
    `);

    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
};

//funcion para obtener todos los usuarios con sus pedidos

const getUsersWithOrders = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: {
        model: Order,
        required: true
      }
    });

    res.json({
      message: 'Usuarios con pedidos obtenidos correctamente',
      data: users
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios con pedidos',
      error: error.message
    });
  }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                message: 'Email y password son obligatorios',
                data: null
            });
        }
        //buscando al usuario en la base de datos
        const user = await User.findOne ({ where: {email} });

        if(!user){
            return res.status(401).json({
                status: 401,
                message: 'Credenciales inválidas',
                data: null
            });
        }

        //comparando contraseña
        if (user.password !== password) {
            return res.status(401).json({
                status: 401,
                message: 'Credenciales inválidas',
                data: null
            });
        }
        //creando la información que irá dentro del token (payload)
        const payload = {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        };

        //Generando el token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h' //expira en 1 hora
        });

        //Se responde con el token
        return res.status(200).json({
            status: 200,
            message: 'Login existoso',
            data: {
                token,
                user: payload
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

//Exportando la función para su uso
module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserWithOrders,
    createUserWithOrder,
    getUsersWithOrdersHtml,
    getUsersWithOrders,
    loginUser
};