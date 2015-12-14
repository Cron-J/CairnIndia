var ip = require('ip');
console.log(ip.address()+":8001/#/");
module.exports = {
    server: {

            host: '127.0.0.1',
            port: 8001
    },
    database: {
        url: 'mongodb://127.0.0.1/Cairn-db'
    },
    key: {
        privateKey: '37LvDSm4XvjYOh9Y',
        tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    email: {
        username: "cairnIndiatest@gmail.com",
        password: "cronj123",
        accountName: "Cairn India",
        verifyEmailUrl: "verifyMail"
    },
    url: "http://"+ip.address()+":8001/#/"
};
