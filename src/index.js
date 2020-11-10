//external
const express = require("express")
const http = require('http')
require('dotenv/config')

//const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')


//internal
const db = require("./config/db")
//routes
const publicRoute = require('./routes/public')
const userRoute = require('./routes/user')
const chatRoute = require('./routes/chat')
const groupRoute = require('./routes/group')
const adminRoute = require('./routes/admin')
const errorHandler = require('./config/errorHandler')
const cors = require('cors')

const socket = require('./controllers/socket')
const { verifyToken, verifyAdmin } = require('./controllers/verify')

/*

const fs = require("fs");
const options = {
	//rutes de les claus i el certificat
	/*
		NODE PRO TIP: Note fs.readFileSync - unlike fs.readFile, fs.readFileSync will block the entire process until it completes.
		In situations like this - loading vital configuration data - the sync functions are okay. 
		In a busy server, however, using a synchronous function during a request 
		will force the server to deal with the requests one by one!
	*//*
		key: fs.readFileSync('./key.pem'),
		cert: fs.readFileSync('./cert.pem')
};*/


db.connectDb();

const app = express()

//app.createServer()

//middleware
//app.use(express.limit('4M'));
/*app.use('/savePhoto', upload.single('file'), async (req, res) => {
	console.log("data", req.body)
	return res.status(200).send('Ok FALSO')
})*/
app.use(cookieParser())
app.use(bodyParser.json(/*{ limit: '150mb', uploadDir: __dirname + '/public/uploads'})*/))
/*app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	limit: '150mb',
	extended: true
}));*/

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
//app.use(cors({credentials: true, origin: '*'}))
app.use(errorHandler)

//mostra la data i que vol fer a lo consola
app.use((req, res, next) => {
	if(req.header('auth-token')) console.log("User => " + req.header('auth-token'))
	else if(req.cookies.token && req.cookies.token !== undefined)console.log("User cookie => ", req.cookies.token)
	else console.log("Not an user")
	console.log(`${new Date().toString()} =>  ${req.originalUrl}`)
	next()
})

//rutes
app.use(express.static('public'))
app.use('/public', publicRoute)
app.use('/user', verifyToken, userRoute)
app.use('/chat', verifyToken, chatRoute)
app.use('/group', verifyToken, groupRoute)
app.use('/admin', verifyToken, verifyAdmin, adminRoute)

const server  = require('http').createServer(app)
const options = { /* ... */ };
const io = require('socket.io')(server, options/*, {
	path: '/chat'
}*/)
/* Per fer aixo s'ha de guardar despres el usuari, bastant lio ara mateix
io.use(function(socket, next) {
	var handshakeData = socket.request;
	// make sure the handshake data looks good as before
	// if error do this:
		// next(new Error('not authorized'));
	// else just call next
	next();
});
*/
socket(io);

/*io.on('connection', socket => { 
	console.log('hello')});*/

//fa que escolti al port del envoirment o al 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, err => {
	if (err) {
		console.error(err)
	} else {
		console.log(`App listen to port: ${PORT}`)
	}
}); 


//app.use(express.json())
//app.use(express.static('public'))
/*
//handler for error 404 -> resource not found
app.use((req, res, next) => {
	res.status(404).send(`You are lost!`)
})

//handler for error 500
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.sendFile(path.join(__dirname, '../public/500.html'))
})
*/
/*
https.createServer(options, app).listen(PORT, err => {
	if (err) {
		console.error(err)
	} else {
		console.log(`App listen to port: ${PORT}`)
	}
});*/