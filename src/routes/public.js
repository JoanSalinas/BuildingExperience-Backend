const User = require('../models/user')
const userController = require('../controllers/user')
const groupController = require('../controllers/group')
const newsController = require('../controllers/noticia')
const router = require("express").Router()
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

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
router.post('/loginWeb', async (req, res) => {
	return userController.loginWeb(req, res)
})
router.post('/savePhoto', upload.single('file'), async (req, res) => {
	return groupController.saveFile(req, res)
})
router.get('/exploreProjects', async (req, res) => {
	return groupController.exploreProjects(req, res)
})
router.get('/exploreGroups', async (req, res) => {
	return groupController.exploreGroups(req, res)
})
router.get('/getProject', async (req, res) => {
	return groupController.getProject(req, res)
})
router.get('/allNews', async (req, res) => {
	return newsController.getNews(req, res)
})

module.exports = router