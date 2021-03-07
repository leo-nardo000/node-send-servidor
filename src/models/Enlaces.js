const {Schema,model} = require("mongoose")

const EnlacesSchema = new Schema({
    url :{
        type:String,
        required:true
    },
    nombre:{
        type:String,
        required:true
    },
    nombre_original:{
        type:String,
        required:true
    },
    descargas:{
        type:Number,
        default:1
    },
    autor:{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        default:null
    },
    password:{
        type:String,
        default:null
    },
    creado:{
        type:Date,
        default: Date.now()
    }
})

module.exports = model("enlaces",EnlacesSchema);