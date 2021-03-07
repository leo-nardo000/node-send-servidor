const router = require("express").Router();

const auth = require("../middlewares/auth");
const authController = require("../controllers/authController");

router
	.post("/", authController.validarIniciarSesion, authController.iniciarSesion)
	.get("/", auth,authController.usuarioAutenticado);

module.exports = router;
