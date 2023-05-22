const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const songRouter = require('./routes/songRoutes');

const app = express();

mongoose.connect(process.env.MONG_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected and listening');
        });
    })

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
}); 


// route to song route api
app.use('/api/songs', songRouter);

