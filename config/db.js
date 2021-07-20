const mongoose = require('mongoose');
require('dotenv').config()

function connectDB() {
	mongoose.connect(process.env.MANGO_CONNECTION_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});

	const connection = mongoose.connection;
	connection.once('open', () => {
		console.log("Database connected")
	}).catch(err => {
		console.log("Database connection Error");
	})
}

module.exports = connectDB; 