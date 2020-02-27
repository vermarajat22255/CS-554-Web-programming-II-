const bluebird = require("bluebird");
const flat = require("flat");
const unflatten = flat.unflatten;
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const dataFile = require('../people.json');

const getHistory = async function getHistory() {
    return await client.lrangeAsync("history", 0, 19);
};
const getById = async(id) => {
    return new Promise((resolve, reject) => {
        setTimeout(async() => {
            let person = null;
            //find person
            for (let i = 0; i < dataFile.length; i++) {
                if (dataFile[i].id == id) {
                    await client.lpushAsync("history", JSON.stringify(dataFile[i]));
                    person = JSON.stringify(dataFile[i]);
                    break;
                }
            }
            if (person != null) {
                resolve(person);
            } else {
                reject(new Error("Person Not found with that id"));
            }
        }, 5000);
    });
};
module.exports = {
    getHistory,
    getById
}