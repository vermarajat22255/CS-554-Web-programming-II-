const express = require('express');
const card = require("../public/details");
const router = express.Router();

router.get('/', async(req, res) => {
    try {
        res.status(200).render("./index", { card: card });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});
module.exports = router;