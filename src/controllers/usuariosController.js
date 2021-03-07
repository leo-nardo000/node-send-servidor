const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const Usuario = require("../models/Usuarios");

exports.validarNuevoUsuario = [
	check("nombre", "El nombre es Obligatorio").not().isEmpty().escape(),
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
		.isEmpty()
        .isLength({min:6})
		.withMessage("La contraseña debe tener al menos 6 caracteres"),
	function (req, res, next) {
		const errores = validationResult(req);

		if (!errores.isEmpty()) {
			res.status(400).json({errores:errores.array().map((error) => error.msg)})
			return;
		}
        next();
	},
];

exports.nuevoUsuario = async (req, res, next) => {
	const usuario = new Usuario(req.body);
	try {
		const existeUsuario = await Usuario.findOne({ email: req.body.email });
		if (existeUsuario) {
			res.status(400).json({ msg: "Error: Ese Correo ya esta Registrado" });
			return;
		}
		usuario.password = await bcrypt.hash(
			req.body.password,
			bcrypt.genSaltSync(10)
		);
		await usuario.save();
		res.status(200).json({ msg: "Usuario creado satisfactoriamente" });
	} catch (error) {
		console.log(error);
		next();
	}
};
