const User = require('../models/user')
const userController = require('../controllers/user')
const router = require("express").Router()
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
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

//Mira si el token de la web es valid i retorna la info de usuari
router.get('/checkWeb', (req, res) => {
	return userController.checkWeb(req, res)
})

//per fer test
/*router.get('/allUsers', (req, res) => {
	return userController.getAllUsers(req, res)
})*/


// UPDATE
router.put('/user', (req, res) => {
	return userController.updateMyUser(req, res)
})
router.put('/userImage', upload.single('file'), (req, res) => {
	return userController.updateMyImage(req, res)
})

/*
// DELETE
router.delete('/user', (req, res) => {
  	return userController.deleteUser(req, res)
})
*/
module.exports = router