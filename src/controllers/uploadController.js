//Importando las herramientas para manejar rutas de archivos
const path = require('path');
const fs = require('fs');

//código para subir archivos
const uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.archivo) {
      return res.status(400).json({
        status: 400,
        message: 'No se subió ningún archivo',
        data: null
      });
    }

    //Se guarda el archivo en una variable
    const archivo = req.files.archivo;
    //Se obtiene la extensión del archivo (ej: png, jpg)
    const extension = archivo.name.split('.').pop().toLowerCase();
    //Se definen las extensiones permitidas
    const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'pdf'];

    //Verificando si la extensión es permitida
    if (!extensionesPermitidas.includes(extension)) {
      return res.status(400).json({
        status: 400,
        message: 'Extensión no permitida',
        data: {
          extensionesPermitidas
        }
      });
    }
    //Se define la carpeta donde se guardarán los archivos
    const uploadPath = path.join(__dirname, '../uploads');
    //Si la carpeta no existe, se crea
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    //Se crea un nombre único, esto para evitar que se sobrescriban los archivos
    const nombreFinal = `${Date.now()}.${extension}`;
    //Se construye la ruta comnpleta del archivo
    const rutaArchivo = path.join(uploadPath, nombreFinal);

    //Se mueve el archivo desde la memoria al disco (carpeta uploads)
    archivo.mv(rutaArchivo, (err) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: 'Error al guardar el archivo',
          data: null,
          error: err.message
        });
      }

      //Se responde con la información del archivo subido
      return res.status(200).json({
        status: 200,
        message: 'Archivo subido correctamente',
        data: {
          nombreOriginal: archivo.name,
          nombreGuardado: nombreFinal,
          tipo: archivo.mimetype,
          tamañoKB: (archivo.size / 1024).toFixed(2),
          url: `/uploads/${nombreFinal}`
        }
      });
    });
  } catch (error) {
    //Error general
    return res.status(500).json({
      status: 500,
      message: 'Error en la subida del archivo',
      data: null,
      error: error.message
    });
  }
};

//Codigo para la eliminación del archivo
const deleteFile = async (req, res) => {
  try {
    
    const { nombre } = req.params;//Se recibe el nombre del archivo desde la URL
    const rutaArchivo = path.join(__dirname, '../uploads', nombre);// se construye la ruta del archivo en el servidor

    //Se valida si el archivo existe
    if (!fs.existsSync(rutaArchivo)) {
      return res.status(404).json({
        status: 404,
        message: 'Archivo no encontrado',
        data: null
      });
    }

    //Se elimina el archivo del servidor
    fs.unlinkSync(rutaArchivo);

    //Respuesta confirmando la eliminación
    return res.status(200).json({
      status: 200,
      message: 'Archivo eliminado correctamente',
      data: { nombre }
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Error al eliminar el archivo',
      data: null,
      error: error.message
    });
  }
};

//Exportando funciones
module.exports = {
  uploadFile,
  deleteFile
};