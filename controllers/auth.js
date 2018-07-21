const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler')

const keys = require('../config/keys')

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email})
    
    if (candidate) {
        // Пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // generate token, password true
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})


            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            // error
            res.status(401).json({
                message: 'Пароли не совпадают, попробуйте еще раз!'
            })
        }

    } else {
        // error
        res.status(404).json({
            message: 'Пользователь с таким емайлом не найден'
        })
    }


    // res.status(200).json({
    //     login: {
    //         email: req.body.email,
    //         password: req.body.password
    //     }
    // })
}

module.exports.register = async function (req, res) {

    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой!'
        })
    } else {
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            res.status(201).json(user)
        } catch (e) {
            // обработать ошыбку
            errorHandler(res, e)
        }
    }
    // const user = new User({
    //     email: req.body.email,
    //     password: req.body.password
    // })
    //
    // user.save().then(() => console.log('user created'))

    // res.status(200).json({
    //     login: 'register from controller'
    // })
}