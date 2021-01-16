const mongoose = require('mongoose');
const doenv = require('dotenv');


doenv.config({path:'./config.env'});


//Database Connection 

const DB = process.env.DATABASE;
mongoose.connect(DB,
    {
        useCreateIndex :true,
        useNewUrlParser :true,
        useUnifiedTopology: true,
        useFindAndModify :false
    }).then(()=>console.log('Database connect successfully'));





const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log('App is running the Port: '+port);
});