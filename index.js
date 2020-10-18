const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const cors = require('cors')
const { MONGOURI } = require('./config/keys')

app.use(express.json())
app.use(cors())

mongoose.connect(MONGOURI,{useNewUrlParser: true,useFindAndModify:false, useUnifiedTopology: true})
mongoose.connection.on('connected',() => {
    console.log("connected to database.....")
})
mongoose.connection.on('error',err=>{
    console.log('error in connection',err)
})

require('./models/user.model')
require('./models/streamingads.model')

app.use('/auth',require('./routes/user.routes'))
app.use('/streamingads',require('./routes/streamingads.routes'))

app.listen(port, () => console.log(`app listening on port ${port}!`))