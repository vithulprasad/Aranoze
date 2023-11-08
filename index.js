const mongoose = require('mongoose');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const userRoute = require('./routes/userroutes');
const adminRoute = require('./routes/adminroutes');
require('dotenv').config();

app.use(express.json()); // Replaced bodyParser with express.json()
app.use(express.urlencoded({ extended: true }));

// for user route
const path = require('path');

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
mongoose.connect(process.env.mongodb);
app.use('/', userRoute);
app.use('/admin', adminRoute);

app.listen(3000, () => {
  console.log('working');
});
