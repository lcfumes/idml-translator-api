const express = require('express');
const upload = require('../shared/multerConfig');
const { uploadController } = require('../interfaces/HttpController');

const router = express.Router();

router.post('/upload', upload.single('file'), uploadController);

module.exports = router;
