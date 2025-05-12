const express = require('express');
const upload = require('../shared/multerConfig');
const { uploadController } = require('../interfaces/HttpController');

const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload and translate an IDML file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The IDML file to translate
 *       - in: formData
 *         name: language
 *         type: string
 *         required: false
 *         description: "The target language (default: pt)"
 *     responses:
 *       200:
 *         description: Translation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 filename:
 *                   type: string
 */


router.post('/upload', upload.single('file'), uploadController);

module.exports = router;
