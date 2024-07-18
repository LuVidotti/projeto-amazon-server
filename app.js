const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const PORT = process.env.PORT;
const rotaUsuarios = require("./routes/usuarios");

//config
    //mongoose
    mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.l2kybso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
        console.log("conectado ao banco de dados com sucesso!!!");
    }).catch((erro) => {
        console.log("Erro ao se conectar ao banco de dados, erro: "+erro);
    })

    //body-parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //cors
    app.use(cors());

//rotas
app.get("/", (req,res) => {
    res.send("Ola mundo");
})

app.use("/usuarios", rotaUsuarios);


//server
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})