//external
const express = require("express")
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv/config')
//internal
const userRoute = require('./routes/user')
const errorHandler = require('./config/errorHandler')



app.use(bodyParser.json())

app.use(errorHandler)

//mostra la data i que vol fer a lo consola
app.use((req, res, next) => {
	console.log(`${new Date().toString()} => ${req.originalUrl}`)
	next()
})


app.use('/user',userRoute)

//fa que escolti al port del envoirment o al 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`App listen to port: ${PORT}`)
  }
}); 

//app.use(express.json())
//app.use(express.static('public'))

//handler for error 404 -> resource not found
app.use((req, res, next) => {
	res.status(404).send(`You are lost!`)
})

//handler for error 500
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.sendFile(path.join(__dirname, '../public/500.html'))
})

