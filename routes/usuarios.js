const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;
const auth = require("../auth/auth");

router.post("/", auth.verificaAdmin, (req,res) => {
    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null) {
        return res.status(400).json({message: "Erro, nome invalido"});
    }

    if(!req.body.email || typeof req.body.email === undefined || req.body.email === null) {
        return res.status(400).json({message: "Erro, email invalido"});
    }

    if(!req.body.senha || typeof req.body.senha === undefined || req.body.senha === null) {
        return res.status(400).json({message: "Erro, senha invalida"});
    }

    if(!req.body.senha2 || typeof req.body.senha2 === undefined || req.body.senha2 === null) {
        return res.status(400).json({message: "Erro, confirmacao de senha invalida"});
    }

    if(req.body.senha.length < 4) {
        return res.status(400).json({message: "Erro, senha muito curta"});
    }

    if(req.body.senha !== req.body.senha2) {
        return res.status(400).json({message: "Erro, as senhas devem coincidir"});
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.senha, salt);

    const novoUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: hash
    }

    new Usuario(novoUsuario).save().then((usuarioCriado) => {
        return res.status(201).json({message: "Usuario criado com sucesso!!!", usuarioCriado:usuarioCriado});
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor, erro: "+erro});
    })
})

router.post("/login", (req,res) => {
    if(!req.body.email || typeof req.body.email === undefined || req.body.email === null) {
        return res.status(400).json({message: "Erro, email invalido"});
    }

    if(!req.body.senha || typeof req.body.senha === undefined || req.body.senha === null) {
        return res.status(400).json({message: "Erro, senha invalida"});
    }

    Usuario.findOne({email:req.body.email}).then((usuario) => {
        if(!usuario) {
            return res.status(404).json({message: "Erro, nenhum usuário encontrado com este e-mail"});
        }

        bcrypt.compare(req.body.senha, usuario.senha, (erro, batem) => {
            if(erro) {
                return res.status(401).json({message: "Erro ao verificar senha"});
            }

            if(!batem) {
                return res.status(401).json({message: "Erro, senha incorreta"})
            } else {
                const token = jwt.sign({userId: usuario._id}, SECRET, {expiresIn: "1h"});
                return res.status(200).json({message: "Login realizado com sucesso!!!", token:token});
            }
        }) 
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor, erro: "+erro});
    })
})

router.get("/", (req,res) => {
    Usuario.find().then((usuarios) => {
        return res.status(200).json(usuarios);
    }).catch((erro) => {
        return res.status(500).json({errorMessage: "Erro interno no servidor, erro: "+erro});
    })
})

module.exports = router;