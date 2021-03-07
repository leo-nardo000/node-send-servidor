const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const Enlaces = require("../models/Enlaces");

exports.validarNuevoEnlace = [
	check("nombre", "Sube un archivo").not().isEmpty().escape(),
	check("nombre_original", "Sube un archivo").not().isEmpty().escape(),
	function (req, res, next) {
		const errores = validationResult(req);

		if (!errores.isEmpty()) {
			res
				.status(400)
				.json({ errores: errores.array().map((error) => error.msg) });
			return;
		}
		next();
	},
];

exports.nuevoEnlace = async (req, res, next) => {
	const { nombre_original, nombre } = req.body;

	const enlace = new Enlaces();
	enlace.url = shortid.generate();
	enlace.nombre = nombre;
	enlace.nombre_original = nombre_original;
	if (req.usuario) {
		const { password, descargas } = req.body;
		// % usuarios premium al registrarse
		if (descargas) {
			enlace.descargas = descargas;
		}
		if (password) {
			enlace.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		}
		enlace.autor = req.usuario._id;
	}

	try {
		await enlace.save();
		res.json({ url: enlace.url });
	} catch (error) {
		console.log(error);
	}
};

// * obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {
	// * verificar que exista
	try {
		const enlace = await Enlaces.findOne({ url: req.params.url });
		if (!enlace) {
			res.status(404).json({ msg: "no existe ese enlace" });
			return;
		}
		res.status(200).json({
			archivo: {
				nombre: enlace.nombre,
				nombre_original: enlace.nombre_original,
				url:enlace.url
			},password: false,
		});
	} catch (error) {
		console.log(error);
		next();
	}
};

exports.enlaces = async (req, res) => {
	try {
		const enlaces = await Enlaces.find().select("url -_id");
		res.status(200).json(enlaces);
	} catch (error) {
		console.log(error);
	}
};

exports.tienePassword = async (req, res, next) => {
	const enlace = await Enlaces.findOne({ url: req.params.url });
	if (!enlace) {
		res.status(404).json({ msg: "no existe ese enlace" });
		return;
	}

	if (enlace.password) {
		return res.json({
			archivo: {
				nombre: enlace.nombre,
				nombre_original: enlace.nombre_original,
				url:enlace.url
			},
			password: true,
		});
	}
	next();
};

exports.verificarPassword = async (req,res,next) => {
	const enlace = await Enlaces.findOne({ url: req.params.url });

	if (bcrypt.compareSync(req.body.password,enlace.password)) {
		// console.log("password correcta");
		next();
	} else {
		return res.status(400).json({msg:"Contraseña Incorrecta"})
	}
}