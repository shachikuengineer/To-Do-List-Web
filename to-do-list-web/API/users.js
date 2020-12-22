module.exports = {
    // Get my profile
    getInfo: function () {
        var status = 200;
        return [status, {
            avatar: 'string',
            firstName: 'string',
            lastName: 'string'
        }];
    },
    // Get user's profile
    getInfo: function (uid) {
        var status = 200;
        return [status, {
            avatar: 'string',
            firstName: 'string',
            lastName: 'string'
        }];
        //[404,{message:'User not found'}]
    },
    // Update my profile
    update: function (profile) {
        var status = 200;
        if (typeof profile.avatar !== undefined) {

        }
        if (typeof profile.firstName !== undefined) {

        }
        if (typeof profile.lastName !== undefined) {

        }
        return [status, null];
    },
    // Search and get user
    search: function (query) {
        var status = 200;
        return [status, {
            avatar: 'string',
            firstName: 'string',
            lastName: 'string'
        }];

        //[404,{message:'User not found'}]
    }

};