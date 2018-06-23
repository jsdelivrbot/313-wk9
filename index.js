const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;


function calcPrice(weight, type) {
    var price = 0;
    weight = Math.floor(weight);

    if (type === 'letterStamped') {
        price = weight * .21 + .5;
    } else if (type === 'lettermetered') {
        price = weight * .21 + .47;
    } else if (type === 'largeEnvelope') {
        price = weight * .21 + 1;
    } else if (type === 'firstClass') {
        if (weight < 4) price = 3.5;
        else if (weight < 8) price = 3.75;
        else {
            price = weight * .35 + 3.75;
        }
    }
    return price;
}


express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/form', (req, res) => res.render('pages/form'))
    .get('/result', (req, res) => res.redirect('form'))
    .post('/result', (req, res) => {

        var weight = req.body.weight;
        var mailType = req.body.mailType;

        if (weight == undefined || mailType == undefined) {
            // send error message
            res.render('pages/result', {
                message: 'Mising Required Parameters'
            });
        } else {
          
            var price = calcPrice(weight, mailType);
          
            res.render('pages/result', {
                price,
                weight,
                mailType
            });
        }
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));