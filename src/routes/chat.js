let Chat = require('../models/chat')
let chatController = require('../controllers/chat')
let router = require("express").Router()


router.get('/chat', async (req, res) => {
	return chatController.getChat(req, res)
})

router.post('/create', async (req, res) => {
	return chatController.createChat(req, res)
})

router.put('/joinChat', async (req, res) => {
	return chatController.addUser(req, res)
})
router.put('/leaveChat', async (req, res) => {
	return chatController.removeUser(req, res)
})

module.exports = router