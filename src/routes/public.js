const User = require('../models/user')
const userController = require('../controllers/user')
const router = require("express").Router()


//create new user //publica
// POST localhost:3000/auth
router.post('/register', async (req, res) => {
	return userController.createUser(req, res)
})
//publica
//POST localhost:3000/auth/login
router.post('/login', async (req, res) => {
	return userController.login(req, res)
})

module.exports = router