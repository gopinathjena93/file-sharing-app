const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) =>  { 
    try { 
        console.log('hhhhhhhhhhhhhh');
        const file = await File.findOne({uuid : req.params.uuid});
       console.log('yyyyyyyyyyy')
        const downloadPath = `${process.env.APP_BASE_URL}${file.path}`; 
        console.log(downloadPath)
        res.download(file.path);
    } catch (err) {
        return res.send('Something went wrong please try again');
    }
    
})    

module.exports = router;