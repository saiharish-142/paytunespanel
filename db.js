const mongoose=require('mongoose')
const { MONGOURI,MONGOURINew } = require('./config/keys');
const db1=mongoose.createConnection(MONGOURI,{useNewUrlParser: true})
const db2=mongoose.createConnection(MONGOURINew,{useNewUrlParser: true})

db1.on('connected',()=>{
    console.log('Connected to db1')
})

db2.on('connected',()=>{
    console.log('Connected to db2')
})

db1.on('error',()=>{
    console.log('Not Connected to db1')
})

db2.on('error',()=>{
    console.log('Not Connected to db2')
})



module.exports={
    db1,
    db2
}





