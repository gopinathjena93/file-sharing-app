const router = require('express').Router();

const path = require('path');

const multer = require('multer');

const File = require('../models/file');

const { v4: uuidv4 } = require('uuid');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        //console.log(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})

const upload = multer({
    storage,
    limit: { fileSize: 100000 * 100 }
}).single('myfile');

router.post('/', (req, res) => {

    upload(req, res, async (err) => {
        console.log(req.file)
        if (!req.file) {
            return res.json({ error: "All files are mandatory" });
        }
        if (err) {
            res.status(500).send({ error: err.message })
        }

        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        })
        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}files/${response.uuid}` });
    })
})


module.exports = router;
