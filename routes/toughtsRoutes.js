const express = require("express");
const router = express.Router();
const ToughtController = require("../controllers/ToughtController");

//helper
const checkAuth = require('../helpers/auth').checkAuth


router.get('/dashboard',checkAuth ,ToughtController.dashboard);
router.get('/add',checkAuth ,ToughtController.createTought);
router.post('/add',checkAuth ,ToughtController.createToughtSave);
router.post('/remove',checkAuth ,ToughtController.removeTought);
router.get('/', ToughtController.showToughts);

module.exports = router;