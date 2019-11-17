let User = require('../models/user')
let userController = require('../controllers/userController')
let router = require("express").Router()


//create new user //publica
// POST localhost:3000/user
router.post('/register', async (req, res) => {
	return userController.saveUser(req, res)
})
//publica
//POST localhost:3000/user/login
router.post('/login', async (req, res) => {
	return userController.login(req, res)
})

//No cal de moment

// GET localhost:3000/user
router.get('/user', (req, res) => {
	return userController.getUser(req, res)
})
/*
// UPDATE
router.put('/user', (req, res) => {
	return userController.updateUser(req, res)
})

// DELETE
router.delete('/user', (req, res) => {
  	return userController.deleteUser(req, res)
})
*/
module.exports = router