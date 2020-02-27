const peopleData = require('../data/people');
const express = require('express');
const router = express.Router();
const flat = require("flat");
const unflatten = flat.unflatten;
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/history", async(req, res) => {
    let history = await peopleData.getHistory();
    for (let i = 0; i < history.length; i++) {
        history[i] = JSON.parse(history[i]);
    }
    res.status(200).send(history);
});

router.get("/:id", async(req, res) => {
    try {
        let id = req.params.id;
        let person = null;
        if (!isNaN(id) && id > 0) {
            let personList = await client.lrangeAsync("history", 0, -1);

            //Check in cache
            if (personList.length != 0) {
                for (let i = 0; i < personList.length; i++) {
                    if (JSON.parse(personList[i]).id == id) {
                        await client.lpushAsync("history", personList[i]);
                        person = JSON.parse(personList[i]);
                        break;
                    }
                }
            }

            //If Person not in Cache check in Memory
            if (person === null) {
                person = await peopleData.getById(id);
                person = JSON.parse(person);
            }
            res.status(200).send(person);
        } else {
            throw "Invalid Id";
        }

    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;