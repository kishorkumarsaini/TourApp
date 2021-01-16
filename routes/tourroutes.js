const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();
const authController = require('./../controllers/authController');

router.get('/getAllTours', authController.protect,tourController.getAllTour);
router.post('/createTour',tourController.createTour);
router.patch('/updateTour/:id',tourController.updateTour);
router.delete('/deleteTour/:id',tourController.deleteTour);



module.exports = router;