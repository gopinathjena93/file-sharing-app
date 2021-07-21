const router = require('express').Router();
const nodemailer = require('nodemailer');
const File = require('../models/file');


router.post('/', async (req, res) => {
	try {
		const from_address = req.body.from_email_address;
		const to_address = req.body.to_email_address;
		const uuid = req.body.uuid;
		const file = await File.findOne({ uuid: uuid });
		console.log('hiiiiiiii')
		console.log(process.env.SMTP_EMAIL);
		console.log(process.env.SMTP_PASSWORD);

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.SMTP_EMAIL, // generated ethereal user
				pass: process.env.SMTP_PASSWORD, // generated ethereal password
			},
		});
		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: from_address, // sender address
			to: to_address, // list of receivers
			subject: "Download File Link", // Subject line
			text: "This is a text message", // plain text body
			html: require('../services/emailTemplate')({
				from_address: from_address,
				downloadLink: `${process.env.APP_BASE_URL}files/${file.uuid}?source=email`,
				size: parseInt(file.size / 1000) + ' KB',
				expires: '24 hours'
			})
		});
		res.send({ success: "Message Send Successfully" })		
	} catch (e) {
		console.log('Error : ', e.message)
	}


});
module.exports = router;