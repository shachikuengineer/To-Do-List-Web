// Import express
const express = require('express');



// Initialize express
const app = express();

app.use(express.json());
app.use('/', express.static(__dirname + '/web'));
app.use('/todolist', express.static(__dirname + '/to-do-list-web/dist/to-do-list-web'));


// auth
var auth = require('./to-do-list-web/API/auth.js');

app.get('/todolist/API/auth/login', (req, res) => {
    var result = auth.oauth(req.query.provider);
    res.status(result[0]).send(result[1]);
});
app.get('/todolist/API/auth/token', (req, res) => {
    var result = auth.token(req.query.authorizationCode);
    res.status(result[0]).send(result[1]);
});

app.post('/todolist/API/auth/login', (req, res) => {
    var result = auth.login(req.body.email, req.body.password);
    res.status(result[0]).send(result[1]);
});

app.get('/todolist/API/auth/logout', (req, res) => {
    var result = auth.logout();
    res.status(result[0]).send(result[1]);
});

// accounts
var accounts = require('./to-do-list-web/API/accounts.js');

app.post('/todolist/API/accounts/create', (req, res) => {
    var result = accounts.create(req.body.email, req.body.password);
    res.status(result[0]).send(result[1]);
});
app.get('/todolist/API/accounts/me', (req, res) => {
    var result = accounts.getInfo();
    res.status(result[0]).send(result[1]);
});
app.post('/todolist/API/accounts/me/actions/update_password', (req, res) => {
    var result = accounts.updatePassword(req.body.oldPassword, req.body.newPassword);
    res.status(result[0]).send(result[1]);
});
app.post('/accounts/me/actions/deactivate', (req, res) => {
    var result = accounts.deactive(req.body.password);
    res.status(result[0]).send(result[1]);
});
app.get('/todolist/API/accounts/me/actions/providers/:provider', (req, res) => {
    var result = accounts.connectOAuth(req.params.provider);
    res.status(result[0]).send(result[1]);
});
app.delete('/todolist/API/accounts/me/actions/providers/:provider', (req, res) => {
    var result = accounts.disconnectOAuth(req.params.provider);
    res.status(result[0]).send(result[1]);
});

// users
var users = require('./to-do-list-web/API/users.js');

app.get('/todolist/API/users/me', (req, res) => {
    var result = users.getInfo();
    res.status(result[0]).send(result[1]);
});
app.put('/todolist/API/users/me', (req, res) => {
    var result = users.update(req.body);
    res.status(result[0]).send(result[1]);
});
app.get('/todolist/API/users', (req, res) => {
    var result = users.search(req.query.query);
    res.status(result[0]).send(result[1]);
});
app.get('/todolist/API/users/:uid', (req, res) => {
    var result = users.getInfo(req.params.uid);
    res.status(result[0]).send(result[1]);
});

// list
var list = require('./to-do-list-web/API/list.js');

app.get('/todolist/API/list', (req, res) => {
    var result = list.getList();
    res.status(result[0]).send(result[1]);
});
app.post('/todolist/API/list', (req, res) => {
    var result = list.create(req.body);
    res.status(result[0]).send(result[1]);
});

// Expose endpoints to port 3000
app.listen(3000, () => {
    console.log("Listening to port 3000");
});
// app.listen(80, () => {
//     console.log("Listening to port 80");
// });

// var https = require('https');
// var hskey = fs.readFileSync(keyPath);
// var hscert = fs.readFileSync(certPath);
// var server = https.createServer({
//     key: hskey,
//     cert: hscert
// }, app);
// server.listen(443, function () {
//     console.log('runing Web Server in ' + port + ' port...');
// });
