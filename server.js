const express = require('express');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.json());

const path = require('path');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.set('views',(path.join(__dirname,'views')));

PORT = process.env.PORT || 3000;

const connectDB = require('./config/db');
connectDB(); 

app.get("/",(req, res ) => {
	res.render('index');
})

app.use('/api/files', require('./routes/files'));


app.use('/api/files', require('./routes/files'));

app.use('/send-email', require('./routes/send-email'));





app.use('/files',require('./routes/show'));

app.use('/files/download',require('./routes/download'));

app.listen(PORT, () => {
	console.log(`Server listen at ${PORT}`);
})