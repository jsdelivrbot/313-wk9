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


const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();


var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');


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

    res.json({
        'success': true,
        'title': req.body.title
    });
});

app.get('/tags', (req, res) => {
    console.log('getting tags');

    var tags = [{
        id: 1,
        name: 'too many cats'
    }, {
        id: 0,
        name: 'brain-melting videos'
    }];
    // This really doesn't have to be stringified
    res.json(JSON.stringify(tags));

});


/**************************************
 * WK 12 team asssignment
 **************************************/

const logRequest = (req, res, next) => {
    console.log(chalk.yellow(`${req.method}: ${req.url}`));
    next();
};

/* Middleware to handle sesion */
const verifyLogin = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401);
        res.json({messsage: 'You are\'t logged in...'});
    }
};

app.use(session({
    secret: 'fuzzy Kittens',
    resave: false,
    saveUninitialized: true
}));
app.use(logRequest);


app.post('/login', (req, res) => {
    client.query('SELECT * FROM users;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
        // client.end();
    });

    var user = req.body.username;
    var pass = req.body.password;

    // console.log(user, pass);

    if (user === 'admin' && pass === 'password') {
        req.session.user = user;
        // req.session.pass = pass;
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.post('/logout', (req, res) => {
    if (req.session.user) {
        console.log(req.session.user);
        req.session.destroy();
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }

});

app.get('/getServerTime', verifyLogin, (req, res) => {
    res.json({
        success: true,
        time: new Date()
    });
});

/* 404 page. Must be last! */
app.use((req, res) => {
    res.render('pages/404');
});

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));