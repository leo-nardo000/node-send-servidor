const { Schema, model } = require("mongoose");

const UsuariosSchema = new Schema({
	nombre: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		trim: true,
		required: true,
	},
});

module.exports = model("usuarios", UsuariosSchema);
