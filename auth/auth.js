const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

function verificaAdmin(req,res,next) {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(404).json({message: "Erro, faça login novamente"});
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({message: "Erro, faça login novamente"});
        }

        Usuario.findOne({_id: decoded.userId}).then((usuario) => {
            if(!usuario) {
                return res.status(404).json({message: "Erro, usuario nao encontrado"});
            }

            if(usuario.isAdmin === 0) {
                return res.status(401).json({message: "Erro, area permitida apenas para administradores"});
            }

            req.user = usuario;
            next();
        }).catch((erro) => {
            return res.status(500).json({errorMessage: "Erro interno no servidor, erro: "+erro});
        })
    })
}

function verificaUser(req,res,next) {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(404).json({message: "Erro, faça login novamente"});
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({message: "Erro, faça login novamente"});
        }

        Usuario.findOne({_id: decoded.userId}).then((usuario) => {
            if(!usuario) {
                return res.status(404).json({message: "Erro, usuario nao encontrado"});
            }
            
            req.user = usuario;
            next();
        }).catch((erro) => {
            return res.status(500).json({errorMessage: "Erro interno no servidor, erro: "+erro});
        })
    })
}

module.exports = {
    verificaAdmin,
    verificaUser
}