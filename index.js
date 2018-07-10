const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const chalk = require('chalk');
const session = require('express-session');

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


var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
 
app.set('view engine', 'ejs');

app.use((req, res) => {
    res.render('pages/404');
});


app.get('/', (req, res) => res.redirect('form'));
app.get('/form', (req, res) => res.render('pages/form'));
app.get('/result', (req, res) => res.redirect('form'));
app.post('/result', (req, res) => {

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
});


/*******************************
 * 6/28/2018 In class activity 
 *******************************/
app.get('/video/:id', (req, res) => {
    var id = req.params.id;
    var vid = {
        id,
        name: 'videoName',
        url: 'http://www.something.com'
    };

    res.json(vid);
});

app.post('/video', (req, res) => {
    console.log('Got a POST request');

    res.json({'success': true, 'title': req.body.title});
});

app.get('/tags', (req, res) => {
    console.log('getting tags');

    var tags = [{
        id: 1,
        name: 'too many cats'
    }, {
        id:0,
        name: 'brain-melting videos'
    }];
    // This really doesn't have to be stringified
    res.json(JSON.stringify(tags));

});


/**************************************
 * WK 12 team asssignment
**************************************/

/* Middleware to handle sesion */
const checkLogin = (req, res, next) => {
    console.log(req.session);

    if (!req.session.authorized) {
        console.log(chalk.red('You are not worthy'));
    } else {
        console.log(chalk.green('You are worthy'));
    }

    console.log(chalk.yellow(`${req.method}: ${req.url}`));
    next();
};

app.use(session({
    secret:'fuzzy Kittens',
    resave: false,
    saveUninitialized: true
}));
app.use(checkLogin);


app.get('/getServerTime', (req, res) => {

});

app.post('/login', (req, res) => {

});

app.post('logout', (req, res) => {

});


app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));