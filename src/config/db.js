const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const conectarDB = async () => {
	try {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true,
		});
        console.log("DB is Connected");
	} catch (error) {
		console.log("Hubo un error de conexion a la DB");
		console.log(error);
		process.exit(1);
	}
};

module.exports = conectarDB;
