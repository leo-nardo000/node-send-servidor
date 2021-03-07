const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const Usuario = require("../models/Usuarios");
require("dotenv").config({ path: "variables.env" });

exports.validarIniciarSesion = [
	check("email")
		.isEmail()
		.withMessage("Debes ingresar un Email valido")
		.normalizeEmail()
		.escape()
		.not()
		.isEmpty(),
	check("password", "La contraseña no puede estar vacia")
		.escape()
		.not()
		.isEmpty(),
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

exports.iniciarSesion = async (req, res, next) => {
	const usuario = await Usuario.findOne({ email: req.body.email });

	if (!usuario) {
		res.status(401).json({ msg: "Ese usuario no existe" });
		return;
	}

	if (!bcrypt.compareSync(req.body.password, usuario.password)) {
		res.status(400).json({ msg: "Contraseña incorrecta" });
		return;
	}

	// * crear el token
	const token = jwt.sign(
		{
			_id: usuario._id,
		},
		process.env.SECRETA,
		{
			expiresIn: "8h",
		}
	);

	res.json({ token });
};

exports.usuarioAutenticado = async (req, res, next) => {
	// * obtiene que usuario esta autenticado
	if (!req.usuario) {
		return res.status(200).json({msg:"Inicia Sesion para obtener un numero de descargas mayor."});
	}
	try {
		const usuario = await Usuario.findById(req.usuario._id).select("-password");
		// % .select: con un guion para que no traiga ese campo
		res.status(200).json({ usuario });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "Hubo un error" });
	}
};
