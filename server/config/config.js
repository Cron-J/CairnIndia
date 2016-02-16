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
        tokenExpiry: 2 * 30 * 1000000 * 60 //10 hour
    },
    email: {
        username: "cairnIndiatest@gmail.com",
        password: "cronj123",
        accountName: "Cairn India",
        verifyEmailUrl: "verifyMail"
    },
    url: "http://localhost:8001/#/"
};
