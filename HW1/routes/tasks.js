const express = require('express');
const router = express.Router();
const tasksData = require("../data/tasks");

router.get('/', async(req, res) => {
    let taskList;
    try {
        let skip = req.query.skip;
        let take = req.query.take;
        taskList = await tasksData.getAll(skip, take);
        res.status(200).json(taskList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});
router.get('/:id', async(req, res) => {
    let task;
    try {
        let id = req.params.id;
        task = await tasksData.get(id);
        res.status(200).json(task);
    } catch (e) {
        res.status(500).json({ error: "Invalid Id" });
    }
});
router.post('/', async(req, res) => {
    //{
    // "id": uuid,
    // "title": string,
    // "description": string,
    // "hoursEstimated": number,
    // "completed": boolean,
    // "comments": comment[{}]
    //}
    let newTask;
    try {
        let taskInfo = req.body;
        if (!taskInfo.title || !taskInfo.description || !taskInfo.hoursEstimated || isNaN(parseInt(taskInfo.hoursEstimated))) {
            throw 'You must provide all the information, also check for hours type(number)';
        } else {
            newTask = await tasksData.createTask(taskInfo.title, taskInfo.description, taskInfo.hoursEstimated);
            res.status(200).send(newTask);
        }
    } catch (e) {
        res.status(500).send({ error: "Can't create Task" });
    }
});
router.put('/:id', async(req, res) => {
    let updatedTask;
    try {
        let id = req.params.id;
        let taskInfo = req.body;
        if (taskInfo.comments) {
            throw 'You Cannot modify Comments using PUT, Remove comments from body.';
        }
        if (!id || !taskInfo.title || !taskInfo.description || !taskInfo.hoursEstimated || isNaN(taskInfo.hoursEstimated) || typeof taskInfo.completed !== "boolean") {
            throw '-> check the following -> Provide all the information -> Hours-Estimated must be a Number -> completed must be a boolean';
        } else {
            updatedTask = await tasksData.updateTask(id, taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed, taskInfo.comments);
            res.status(200).send(updatedTask);
        }
    } catch (e) {
        res.status(500).send({ error: e });
    }
});
router.patch('/:id', async(req, res) => {
    let patchedTask;
    try {
        let id = req.params.id;
        let taskInfo = req.body;
        if (taskInfo.comments) {
            throw 'You Cannot modify Comments using PATCH, Remove comments from body.';
        }
        if (!taskInfo.title && !taskInfo.description && !taskInfo.hoursEstimated && !taskInfo.completed) {
            throw '-> check the following -> Provide at least one information -> Hours-Estimated must be a Number -> completed must be a boolean';
        } else {
            patchedTask = await tasksData.patchTask(id, taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed);
            res.status(200).send(patchedTask);
        }
    } catch (e) {
        res.status(500).send({ error: e });
    }
});
router.post("/:id/comments", async(req, res) => {
    // "id": AutoGenerate,
    // "name": string,
    // "comments": comment[]
    let newComment;
    try {
        let id = req.params.id;
        let commentInfo = req.body;
        if (commentInfo.id) {
            throw 'You must remove comment Id';
        }
        if (!commentInfo.name || !commentInfo.comment) {
            throw 'You must provide all the information';
        } else {
            newComment = await tasksData.createComment(id, commentInfo.name, commentInfo.comment);
            res.status(200).send(newComment);
        }
    } catch (e) {
        res.status(500).send({ error: e });
    }
});
router.delete("/:taskId/:commentId", async(req, res) => {
    let task;
    try {
        let taskId = req.params.taskId;
        let commentId = req.params.commentId;

        if (!taskId || !commentId) {
            throw 'You must provide all the information';
        } else {
            ObjId = require("mongodb").ObjectID(taskId);
            task = await tasksData.deleteComment(ObjId, commentId);
            console.log(task.comments);
            res.status(200).send(task);
        }
    } catch (e) {
        res.status(500).send({ error: e });
    }
});
module.exports = router;