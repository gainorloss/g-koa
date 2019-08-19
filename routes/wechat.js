module.exports = {
    "get /": async app => {
        await app.next();
    }
}