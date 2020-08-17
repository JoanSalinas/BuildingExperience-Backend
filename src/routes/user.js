const User = require('../models/user')
const userController = require('../controllers/user')
const router = require("express").Router()

/*
//create new user //publica
// POST localhost:3000/user
router.post('/register', async (req, res) => {
	return userController.createUser(req, res)
})
//publica
//POST localhost:3000/user/login
router.post('/login', async (req, res) => {
	return userController.login(req, res)
})*/

//No cal de moment

// GET localhost:3000/myUser
router.get('/myUser', (req, res) => {
	return userController.getMyInfo(req, res)
})

// basic info
router.get('/user', (req, res) => {
	return userController.getUser(req, res)
})


//per fer test
/*router.get('/allUsers', (req, res) => {
	return userController.getAllUsers(req, res)
})*/

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