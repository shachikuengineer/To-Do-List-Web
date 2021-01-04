const express = require('express');
const router = express.Router();

// auth
var auth = require('../API/auth.js');

router.get('/API/auth/login', (req, res) => {
    var result = auth.oauth(req.query.provider);
    res.status(result[0]).send(result[1]);
});
router.get('/API/auth/token', (req, res) => {
    var result = auth.token(req.query.authorizationCode);
    res.status(result[0]).send(result[1]);
});

router.post('/API/auth/login', (req, res) => {
    var result = auth.login(req.body.email, req.body.password);
    res.status(result[0]).send(result[1]);
});

router.get('/API/auth/logout', (req, res) => {
    var result = auth.logout();
    res.status(result[0]).send(result[1]);
});

// accounts
var accounts = require('../API/accounts.js');

router.post('/API/accounts/create', (req, res) => {
    var result = accounts.create(req.body.email, req.body.password);
    res.status(result[0]).send(result[1]);
});
router.get('/API/accounts/me', (req, res) => {
    var result = accounts.getInfo();
    res.status(result[0]).send(result[1]);
});
router.post('/API/accounts/me/actions/update_password', (req, res) => {
    var result = accounts.updatePassword(req.body.oldPassword, req.body.newPassword);
    res.status(result[0]).send(result[1]);
});
router.post('/accounts/me/actions/deactivate', (req, res) => {
    var result = accounts.deactive(req.body.password);
    res.status(result[0]).send(result[1]);
});
router.get('/API/accounts/me/actions/providers/:provider', (req, res) => {
    var result = accounts.connectOAuth(req.params.provider);
    res.status(result[0]).send(result[1]);
});
router.delete('/API/accounts/me/actions/providers/:provider', (req, res) => {
    var result = accounts.disconnectOAuth(req.params.provider);
    res.status(result[0]).send(result[1]);
});

// users
var users = require('../API/users.js');

router.get('/API/users/me', (req, res) => {
    var result = users.getInfo();
    res.status(result[0]).send(result[1]);
});
router.put('/API/users/me', (req, res) => {
    var result = users.update(req.body);
    res.status(result[0]).send(result[1]);
});
router.get('/API/users', (req, res) => {
    var result = users.search(req.query.query);
    res.status(result[0]).send(result[1]);
});
router.get('/API/users/:uid', (req, res) => {
    var result = users.getInfo(req.params.uid);
    res.status(result[0]).send(result[1]);
});

// list
var list = require('../API/list.js');

router.get('/API/list', (req, res) => {
    var result = list.getList();
    res.status(result[0]).send(result[1]);
});
router.post('/API/list', (req, res) => {
    var result = list.create(req.body);
    res.status(result[0]).send(result[1]);
});


module.exports = router;