const itemsRoutes = require("./items");

const constructorMethod = app => {
    app.use("/", itemsRoutes);
    app.use("*", (req, res) => {
        res.status(404).json({ "msg": "404 Invalid path" });
    });
};

module.exports = constructorMethod;