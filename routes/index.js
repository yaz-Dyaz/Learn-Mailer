const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const storage = require('../utils/storage');
const media = require('../controllers/media');
const multer = require('multer')();
const nodemailer = require('../utils/nodemailer')

const middlewares = require('../utils/middlewares');
const qrimage = require('../utils/qrimage');
const { json } = require('sequelize');

router.post('/auth/register', user.register);
router.post('/auth/login', user.login);
router.get('/auth/whoami', middlewares.auth, user.whoami);
router.get('/auth/oauth', user.googleOauth2);
router.post('/auth/forgot-password', user.forgotPassword);

router.post('/storage/images', storage.image.single('media'), media.storageSingle);
router.post('/storage/multi/images', storage.image.array('media'), media.storageArray);
router.post('/imagekit/upload', multer.single('media'), media.imagekitUpload);

router.get('/test/mailer', async (req, res) => {
  try {
    const html = await nodemailer.getHtml('welcome.ejs', { user: { name: 'Binar' } });
    nodemailer.sendMail('just.for.learn000@gmail.com', 'Ini Subject 5', html);

    return res.status(200).json({
      status: true,
      message: 'success',
      data: null
    });
  } catch (err) {
    throw err;
  }
});

module.exports = router;