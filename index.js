// Import express
const express = require('express');

// Initialize express
const app = express();


app.use(express.json());
const apiRoute = require('./to-do-list-web/routes/api.js');
app.use('/todolist', apiRoute);
app.use('/todolist', express.static(__dirname + '/to-do-list-web/dist/to-do-list-web'));
app.get('/todolist/*', (req, res) => {
    res.sendFile(__dirname + '/to-do-list-web/dist/to-do-list-web/index.html');
});



const linetvRoute = require('./web/linetv/linetv.js');
app.use('/linetv', linetvRoute);
app.use('/linetv', express.static(__dirname + '/web/linetv'));




app.use('/', express.static(__dirname + '/web'));




// Expose endpoints to port 3000
app.listen(3000, () => {
    console.log("Listening to port 3000");

});
// app.listen(80, () => {
// console.log("Listening to port 80");
// });
