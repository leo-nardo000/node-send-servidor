const router = require("express").Router();

const auth = require("../middlewares/auth");
const enlacesController = require("../controllers/enlacesController");
const archivosController = require("../controllers/archivosController");

router
	.post(
		"/",
		auth,
		enlacesController.validarNuevoEnlace,
		enlacesController.nuevoEnlace
	)
	.get(
		"/:url",
		enlacesController.tienePassword,
		enlacesController.obtenerEnlace
		// archivosController.eliminarArchivo
	)
	.get("/", enlacesController.enlaces)
	.post(
		"/:url",
		enlacesController.verificarPassword,
		enlacesController.obtenerEnlace
	);

module.exports = router;
