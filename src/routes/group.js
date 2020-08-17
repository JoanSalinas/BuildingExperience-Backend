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


module.exports = router