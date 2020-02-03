const tc = require("./Collection");
const Guid = require("guid");

const get = async function get(id) {

    if (!id) throw "You must provide an id to search for";
    ObjId = require("mongodb").ObjectID(id);
    let tasksCollection = await tc.getTasks();
    let task = await tasksCollection.findOne({ _id: ObjId });
    if (task === null || task === undefined) throw "No post with that id";
    return task;
}

const getAll = async function getAll(skip, take) {
    taskCollection = await tc.getTasks();
    result = await taskCollection.find({}).toArray();
    let updatedRes = [{}];

    if (skip && !take) {
        skip = parseInt(skip);
        if (isNaN(skip)) {
            throw "Invalid Skip parameter";
        } else {
            for (let i = skip, j = 0; i < result.length && j < 20; i++, j++) {
                updatedRes[j] = result[i];
            }
        }
    } else if (!skip && take) {

        take = parseInt(take);
        if (isNaN(take)) {
            throw "Invalid Take parameter";
        } else {
            for (let i = 0, j = 0; i < take && take < 100; i++, j++) {
                updatedRes[j] = result[i];
            }
        }
    } else if (take && skip) {

        skip = parseInt(skip);
        take = parseInt(take);

        if (isNaN(take) || isNaN(skip)) {
            throw "Invalid parameters";
        } else {
            for (let i = skip, j = 0; i < result.length && i < (skip + take) && i < 100; i++, j++) {
                updatedRes[j] = result[i];
            }
        }
    } else if (!take && !skip) {

        for (let i = 0; i < 20; i++) {
            updatedRes[i] = result[i];
        }
    }
    return updatedRes;
}
const createTask = async function createTask(title, description, hoursEstimated) {
    //create object and insert
    task = {
        "title": title,
        "description": description,
        "hoursEstimated": hoursEstimated,
        "completed": false,
        "comments": []
    }
    taskCollection = await tc.getTasks();

    const insertTask = await taskCollection.insertOne(task);
    if (insertTask.insertedCount === 0) throw "Could not add Task";

    return task;
}
const updateTask = async function updateTask(id, title, description, hoursEstimated, completed, comments) {

    ObjId = require("mongodb").ObjectID(id);
    task = await get(ObjId);

    if (task != null || task != undefined) {
        taskCollection = await tc.getTasks();
        comments = task.comments;
        const updateInfo = await taskCollection.updateOne({ _id: ObjId }, { $set: { title: title, description: description, hoursEstimated: hoursEstimated, completed: completed, comments: comments } });
        if (updateInfo.modifiedCount == 0) {
            throw "could not update Task successfully";
        }
    } else {
        throw "No Task with that id";
    }

    return await get(ObjId);
}
const patchTask = async function patchTask(id, title, description, hoursEstimated, completed) {

    ObjId = require("mongodb").ObjectID(id);
    task = await get(ObjId);
    console.log(isNaN(parseInt(hoursEstimated)), "aay akya ", typeof completed === "boolean");
    if (isNaN(parseInt(hoursEstimated)) || typeof completed !== "boolean") {
        throw 'Hours Estimated must be a number and completed must be a boolean';
    }
    if (task != null || task != undefined) {
        taskCollection = await tc.getTasks();

        let updateObject = {}
        if (title) updateObject["title"] = title;
        if (description) updateObject["description"] = description;
        if (hoursEstimated) updateObject["hoursEstimated"] = hoursEstimated;
        if (completed != null && completed !== undefined) updateObject["completed"] = completed;

        //use $set to do a partial update on the updateObject
        const updateInfo = await taskCollection.updateOne({ _id: ObjId }, { $set: updateObject });
        if (updateInfo.modifiedCount == 0) {
            throw "could not update Task successfully";
        }

        return await get(ObjId);
    } else {
        throw "No Task with that id";
    }
}
const createComment = async function createComment(id, name, comment) {
    ObjId = require("mongodb").ObjectID(id);
    task = await get(ObjId);

    if (task != null || task != undefined) {

        taskCollection = await tc.getTasks();
        newComment = {
            "id": Guid.raw(),
            "name": name,
            "comment": comment
        };
        //$push the newComment object onto the list of comments
        const updateInfo = await taskCollection.updateOne({ _id: ObjId }, { $push: { comments: newComment } })

        if (updateInfo.modifiedCount == 0) {
            throw "could not update Task successfully";
        }
        return await get(ObjId);
    } else {
        throw "No Task with that id";
    }
}
const deleteComment = async function deleteComment(taskId, commentId) {

    taskCollection = await tc.getTasks();
    let task = await get(taskId);
    const updateInfo = await taskCollection.updateOne({ _id: taskId }, { $pull: { comments: { id: commentId } } });
    if (updateInfo.modifiedCount === 0) {
        throw "could not update Task successfully, May be No comments with given Id";
    }
    task = await get(taskId);
    return task;
}

module.exports = { getAll, get, createTask, updateTask, createComment, deleteComment, patchTask }