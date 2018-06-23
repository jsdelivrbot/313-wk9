const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/form', (req, res) => res.render('pages/form'))
    .get('/result', (req, res) => res.redirect('form'))
    .post('/result', (req, res) => {
        res.render('pages/result');
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));