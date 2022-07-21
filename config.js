require("dotenv").config()

const myKey = process.env.myKey;
const myToken = process.env.myToken;

module.exports = {
    myKey,
    myToken
}
