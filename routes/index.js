var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Tiempo twitter' });
});

router.get('/:name', function (req, res) {
    var name = req.params.name;
    res.render(name);
});

module.exports = router;