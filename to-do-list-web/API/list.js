module.exports = {
    // Get my list
    getList: function () {
        var status = 200;
        return [status, [{
            listId: 0,
            title: 'string',
            themeId: 0,
            participants: [0],
            progress: 0
        }]];
    },
    // Create a list
    create: function (list) {
        var status = 200;
        var participants = list.participants;
        //list.title, list.themeId
        return [status, null];
    },
    // // Search and get user
    // search: function (query) {
    //     var status = 200;
    //     return [status, {
    //         avatar: 'string',
    //         firstName: 'string',
    //         lastName: 'string'
    //     }];

    //     //[404,{message:'User not found'}]
    // }

};