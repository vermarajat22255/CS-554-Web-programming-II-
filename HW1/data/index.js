const tasksData = require("./tasks");

const constructorMethod = app => {
    app.use("/tasks", tasksData);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;