const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Import Routes
const authRoutes = require('./router/auth');
const postRoutes = require('./router/posts');

dotenv.config();

//connect to DB
mongoose.connect(`${process.env.DB_CONNECT}`, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	console.log('connected to DB')
});



//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoutes);
app.use('/api/posts', postRoutes);


app.listen(process.env.PORT || 3000, () => {
	console.log('Server is up and runing');
});
