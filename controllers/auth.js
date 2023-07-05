const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const bycrypt = require('bcryptjs')



const register = async (req, res) => {
    console.log('entre alo register')
    const user = await User.create({...req.body})
    console.log('se creó un usuario')
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token})
}

const login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    if (!user) {
        throw new BadRequestError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new BadRequestError('Invalid password')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}

module.exports = {
    register,
    login
}