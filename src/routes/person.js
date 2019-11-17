let express = require("express")
let router = express.Router()

// querystring => query property on the request object
// localhost:3000/person?name=thomas&age=20
router.get('/person', (req, res) =>{
	if(req.query.name){
		res.send(`you have requested a person, ${req.query.name}`);
	}
	else{
		res.send('you have requested a person');
	}
	
})

// params propierty on the request object
// localhost:3000/person/thomas
router.get('/person/:name', (req, res) =>{
	res.send(`you have requested a person, ${req.params.name}`);
})

router.get('/error', (req, res) =>{
	throw new Error('Forced error.');
})
module.exports = router;