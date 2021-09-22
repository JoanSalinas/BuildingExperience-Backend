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



db.connectDb();

const app = express()


//middleware
app.use(cookieParser())
app.use(bodyParser.json(/*{ limit: '150mb', uploadDir: __dirname + '/public/uploads'})*/))

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(errorHandler)

//mostra la data i que vol fer a la consola
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
const io = require('socket.io')(server, options)

socket(io);


//fa que escolti al port del envoirment o al 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, err => {
	if (err) {
		console.error(err)
	} else {
		console.log(`App listen to port: ${PORT}`)
	}
}); 

