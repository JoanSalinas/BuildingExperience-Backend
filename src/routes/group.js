let Group = require('../models/group')
let groupController = require('../controllers/group')
let router = require("express").Router()


router.get('/group', async (req, res) => {
	return groupController.getGroup(req, res)
})

router.get('/myGroups', async (req, res) => {
	return groupController.getMyGroups(req, res)
})
router.get('/myGroupMembers', async (req, res) => {
	return groupController.getMyGroupMembers(req, res)
})
router.post('/create', async (req, res) => {
	return groupController.createGroup(req, res)
})

router.put('/addUser', async (req, res) => {
	return groupController.addUser(req, res)
})
router.put('/joinGroup', async (req, res) => {
	console.log("hey")
	return groupController.joinGroup(req, res)
})
router.put('/commentPost', async (req, res) => {
	return groupController.addPostComment(req, res)
})
router.put('/addPostLike', async (req, res) => {
	return groupController.addPostLike(req, res)
})
module.exports = router