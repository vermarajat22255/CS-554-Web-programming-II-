const dbConnection = require("./Connection");

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getTasks = async() => {

    const db = await dbConnection();
    _col = await db.collection("tasks");
    return _col;
};
/* Now, you can list your collections here: */
module.exports = {
    getTasks
};