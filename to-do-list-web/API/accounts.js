module.exports = {
    // Create an account
    create: function (email, password) {
        var status = 200;
        return [status, {
            email: email
        }];
    },
    // Get my account info
    getInfo: function () {
        var status = 200;
        return [status, {
            uid: 0,
            email: "user@example.com",
            connected: ["google"],
            userStatus: 0
        }];
    },
    // Update my password
    updatePassword: function (oldPassword, newPassword) {
        var status = 200;
        return [status, null];
    },
    // Delete my account
    deactivate: function (password) {
        var status = 200;
        return [status, null];

        //[403,{message:'password error'}]
    },
    // Connect to OAuth account
    connectOAuth: function (provider) {
        var status = 200;
        if (provider === 'google') {
            return [status, null];
        }
        else if (provider === 'facebook') {
            return [status, null];
        }
        else {
            return [400, { message: 'The provider is not supported!' }];
        }
    },
    // Disconnect to OAuth account
    disconnectOAuth: function (provider) {
        var status = 200;
        if (provider === 'google') {
            return [status, null];
        }
        else if (provider === 'facebook') {
            return [status, null];
        }
        else {
            return [400, { message: 'The provider is not supported!' }];
        }
    }

};