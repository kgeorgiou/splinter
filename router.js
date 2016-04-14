var express             = require('express'),
    router              = express.Router(),
    SplinterController  = require('./controllers/SplinterController');

router.post('/splint', SplinterController.processURL);

module.exports = router;
