const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

module.exports = function (req,res,next) {
	const authHeader = req.get("Authorizations");

	if (authHeader) {
		const token = authHeader.split(" ")[1];
		
		// * validar el token
		try {
			const cifrado = jwt.verify(token, process.env.SECRETA);
			req.usuario = cifrado;
		} catch (error) {
			res.status(401).json({ msg: "Vuelve a iniciar Sesion" });
			return;
		}
	}
	next();
}