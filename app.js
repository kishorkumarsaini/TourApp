const { json } = require('express');
const express = require('express');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourroutes');
const app = express();


app.use(express.json());

app.use('/api/v2/user',userRouter);
app.use('/api/v2/tour',tourRouter);


module.exports = app;
