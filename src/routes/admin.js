const User = require('../models/user')
const userController = require('../controllers/user')
const groupController = require('../controllers/group')
const newsController = require('../controllers/noticia')
const router = require("express").Router()
var multer  = require('multer')
//10MB = 10 * 1024 * 1024
var upload = multer({ dest: 'uploads/', limits: { fieldSize: 10 * 1024 * 1024 } })

router.get('/allUsers', (req, res) => {
	return userController.getAllUsers(req, res)
})
router.get('/allGroups', (req, res) => {
	return groupController.getAllGroups(req, res)
})
router.put('/addPost', upload.single('file'), (req, res) => {
	return groupController.addPost(req, res)
})

router.post('/createNew', (req, res) => {
	return newsController.createNew(req, res)
})


module.exports = router