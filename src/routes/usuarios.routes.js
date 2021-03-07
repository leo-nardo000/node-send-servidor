const router = require("express").Router();

const usuariosController = require("../controllers/usuariosController");

router.post(
	"/",
	usuariosController.validarNuevoUsuario,
	usuariosController.nuevoUsuario
);

module.exports = router;
