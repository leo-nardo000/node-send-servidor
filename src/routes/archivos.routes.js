const router = require("express").Router();

const auth = require("../middlewares/auth");
const archivosController = require("../controllers/archivosController");

router
	.post("/", auth, archivosController.subirArchivo, archivosController.archivo)
	.get("/:archivo",archivosController.descargar,archivosController.eliminarArchivo)

module.exports = router;
