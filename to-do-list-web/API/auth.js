const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    '849989837028-bfq8dqvqep8e7petdplqi0csvgia35ii.apps.googleusercontent.com',//YOUR_CLIENT_ID
    'JMdL8MJwERQVJ3f2f7tZLPdg',//YOUR_CLIENT_SECRET
    'http://shachikuengineer.ddns.net:3000'//YOUR_REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
    'http://shachikuengineer.ddns.net:3000'
];
module.exports = {
    // Logs user into the system with email and password
    login: function (email, password) {
        var status = 200;
        return [status, {
            email: email
        }];
    },
    // Logs user into the system with OAuth
    login: function (provider) {
        var status = 200;
        if (provider === 'google') {
            const url = oauth2Client.generateAuthUrl({
                // 'online' (default) or 'offline' (gets refresh_token)
                access_type: 'offline',

                // If you only need one scope you can pass it as a string
                scope: scopes
            });
            return [status, {
                url: url
            }];
        }
        else if (provider === 'facebook') {
            const url = 'https://www.facebook.com/v9.0/dialog/oauth?client_id=850841529008611&redirect_uri=http://shachikuengineer.ddns.net:3000';
            return [status, {
                url: url
            }];
        }
        else {
            return [400, {
                message: 'The provider is not supported!'
            }];
        }
    },
    // OAuth Token
    token: function (authorizationCode) {
        // whatever
    },
    // Logs out current logged in user session
    logout: function () {
        var status = 200;
        return [status, {
            email: email
        }];
    }

};