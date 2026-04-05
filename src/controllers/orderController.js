const db = require("../models");
const { Order, User } = db;

const createOrder = async (req, res) => {
  try {
    const { descripcion, total, userId } = req.body;

    if (!descripcion || !total || !userId) {
      return res.status(400).json({
        message: "Faltan datos obligatorios",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "El usuario no existe",
      });
    }

    const newOrder = await Order.create({
      descripcion,
      total,
      userId,
    });

    res.status(201).json({
      message: "Pedido creado correctamente",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear pedido",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json({
      message: "Pedidos obtenidos correctamente",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener pedidos",
      error: error.message,
    });
  }
};

const getOrdersHtml = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: {
        model: User,
        attributes: ["id", "nombre", "email"],
      },
    });

    const filas = orders
      .map(
        (order) => `
<tr>
        <td>${order.id}</td>
        <td>${order.descripcion}</td>
        <td>${order.total}</td>
        <td>${order.userId}</td>
        <td>${order.User ? order.User.nombre : "Sin usuario"}</td>
        <td>${order.User ? order.User.email : "Sin email"}</td>
      </tr>
    `,
      )
      .join("");

    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Tabla de pedidos</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 30px;
            background-color: #f8f9fa;
          }

          h1 {
            color: #333;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #275575;
            padding: 10px;
            text-align: left;
          }

          th {
            background-color: #5989b9;
            color: #fcf6e4;
          }

          td {
            background-color: #cde1f5;
          }

          tr:nth-child(even) {
            background-color: #f2f2f2;
          }

          .empty {
            margin-top: 20px;
            font-style: italic;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>Todos los pedidos</h1>

        ${
          orders.length > 0
            ? `
              <table>
                <thead>
                  <tr>
                    <th>ID Pedido</th>
                    <th>Descripción</th>
                    <th>Total</th>
                    <th>User ID</th>
                    <th>Nombre Usuario</th>
                    <th>Email Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  ${filas}
                </tbody>
              </table>
            `
            : `<p class="empty">No hay pedidos registrados.</p>`
        }
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <h1>Error</h1>
      <p>${error.message}</p>
    `);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersHtml
};
