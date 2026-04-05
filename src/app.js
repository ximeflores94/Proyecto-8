
//importando express
const express = require("express");
require("dotenv").config();

//importando la conexión a la base de datos
const db = require("./models");
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");
const orderRoutes = require('./routes/orderRoutes')
const uploadRoutes = require("./routes/uploadRoutes");

//Middleware para que Express pueda leer JSON
app.use(express.json());

//Middleware para permitir subida de archivos
app.use(fileUpload({
  limits: {fileSize: 2 * 1024 * 1024}, //máximo 2MB
  abortOnLimit: true, // se corta si se supera el límite
  responseOnLimit: 'El archivo supera el tamaño máximo permitido de 2MB'
}));

//aqui se hace pública la carpeta uploads para poder acceder a los archivos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api", userRoutes);
app.use("/api", orderRoutes);
app.use("/api", uploadRoutes);

//realizando la ruta de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "Servidor funcionando correctamente",
  });
});

//Creando función para iniciar el servidor
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Conexión existosa a PostgreSQL");

    await db.sequelize.sync({ alter: true });
    console.log("Tablas sincronizadas");

    const totalUsuarios = await db.User.count();

    if(totalUsuarios === 0) {
        const usuarios = await db.User.bulkCreate(
      [
        { nombre: 'Ximena', email: 'ximena@gmail.com', password: '1234' },
        { nombre: 'Camila', email: 'camila@gmail.com', password: '1234' },
        { nombre: 'Ignacia', email: 'ignacia@gmail.com', password: '1234' }
      ],
      { returning: true }
    );

    await db.Order.bulkCreate([
        {
            descripcion: 'Pedido 1',
            total: 10000,
            userId: usuarios[2].id
        },
        {
            descripcion: 'Pedido 2',
            total: 20000,
            userId: usuarios[2].id
        },
        {
            descripcion: 'Pedido 3',
            total: 15000,
            userId: usuarios[1].id
        }
    ]);
}

    app.listen(PORT, () => {
      console.log(`Servidor correindo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error.message);
  }
};

//Ejecutando la función
startServer();
