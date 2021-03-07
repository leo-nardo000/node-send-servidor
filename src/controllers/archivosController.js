const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const fs = require("fs");

const Enlaces = require("../models/Enlaces");

exports.subirArchivo = (req, res, next) => {
	const configuracionMulter = {
		storage: multer.diskStorage({
			destination: (req, file, cb) => {
				cb(null, path.join(__dirname + "/../public/uploads/"));
			},
			filename: (req, file, next) => {
				const extension = file.originalname.substring(
					file.originalname.lastIndexOf("."),
					file.originalname.length
				);
				// % se extrae la extension de esta forma ya que hay archivos como el psd con el mimetype muy extraño
				next(null, `${shortid.generate()}${extension}`);
			},
		}),
		limits: { fileSize: req.usuario ? 5000000 : 1000000 },
	};
	// % si el usuario esta autenticado deja que suba archivos mas grandes
	const upload = multer(configuracionMulter).single("archivo");

	upload(req, res, function (error) {
		if (error) {
			if (error instanceof multer.MulterError) {
				if (error.code === "LIMIT_FILE_SIZE") {
					return res
						.status(400)
						.json({ msg: "Imagen muy pesada, maximo 1 MB" });
				} else {
					return res.status(400).json({ msg: error.message });
				}
			} else if (error.hasOwnProperty("message")) {
				return res.status(400).json({ msg: error.message });
			}
		}
		if (!req.file) {
			return res.status(400).json({ msg: "Debes subir un archivo" });
		}
		next();
	});
};

exports.archivo = async (req, res) => {
	return res.status(200).json({
		nombre: req.file.filename,
		nombre_original: req.file.originalname,
		msg: "Archivo Subido Correctamente",
	});
};

exports.eliminarArchivo = async (req, res) => {
	try {
		fs.unlinkSync(path.join(__dirname, `/../public/uploads/${req.archivo}`));
	} catch (error) {
		console.log(error);
	}
};

exports.descargar = async (req, res, next) => {
	try {
		const enlace = await Enlaces.findOne({ nombre: req.params.archivo });
		if (!enlace) {
			return res.status(400).json({ msg: "No existe ese archivo" });
		}

		const ruta = __dirname + "/../public/uploads/" + req.params.archivo;
		res.download(ruta);

		if (enlace.descargas === 1) {
			await Enlaces.findOneAndRemove({ nombre: req.params.archivo });

			req.archivo = enlace.nombre;
			return next();
			// % eliminar el archivo y la entrada de la bd
		} else {
			enlace.descargas--;
			await enlace.save();
		}
	} catch (error) {
		console.log(error);
	}
};