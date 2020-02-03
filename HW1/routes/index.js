const tasksRoutes = require("./tasks");

const constructorMethod = app => {
    app.use("/api/tasks", tasksRoutes);
    app.use("*", (req, res) => {
        res.status(404).json({ "msg": "Invalid path" });
    });
};

module.exports = constructorMethod;