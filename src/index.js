const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
require("./config/db")();

// ? settings
app.use(morgan("dev"));
app.set("port", process.env.PORT || 4000);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const whiteList = [process.env.FRONT_END_URL]
const corsOptions = {
	origin: (origin,callback) => {
		const existe = whiteList.some(dominio => dominio === origin);
		console.log(origin);
		if(existe){
		} else {
			// callback(new Error("No Permitido por CORS"))
		}
		callback(null,true)
	}
}
app.use(cors(corsOptions));

// ? static files
app.use(express.static(path.join(__dirname, "public")));

// ? Routes
app.use("/api/usuarios", require("./routes/usuarios.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/enlaces", require("./routes/enlaces.routes"));
app.use("/api/archivos", require("./routes/archivos.routes"));

app.listen(app.get("port"), () => {
	console.log("Server on port", app.get("port"));
});
