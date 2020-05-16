import { Request, Response } from "express";
//import DbConnection = require("../data/Connection");
const tdata = require("../data/tasks");
const MongoId = require("mongodb");
var tasksData: any;

export class Tasks {

    constructor() {
        tasksData = new tdata.TasksData();
    }
    public routes(app): void {

        app.route("/api/tasks").get(async (req: Request, res: Response) => {
            try {
                let data = await tasksData.getAll(req.query.skip, req.query.take);
                res.status(200).json(data);
            } catch (e) {
                res.status(500).json({ "Error": e });
            }
        });
        app.route("/api/tasks/:id").get(async (req: Request, res: Response) => {
            try {
                let id:any = req.params.id;
                id = MongoId.ObjectID(id);
                let data = await tasksData.get(id);
                res.status(200).json(data);
            } catch (e) {
                res.status(500).json({ "Error": "Error Getting Data" });
            }
        });
        app.route("/api/tasks").post(async (req: Request, res: Response) => {
            try {
                let data = req.body;
                const task = await tasksData.create(data.title, data.description, data.hoursEstimated);
                res.status(200).json(task);
            } catch (e) {
                res.status(500).json({ "Error": e });;
            }
        })
        app.route("/api/tasks/:id").put(async (req: Request, res: Response) => {
            try {
                let id: string = req.params.id;
                let taskInfo = req.body;
                if (taskInfo.comments) {
                    throw 'You Cannot modify Comments using PUT, Remove comments from body.';
                }
                if (!id || !taskInfo.title || !taskInfo.description || !taskInfo.hoursEstimated || isNaN(taskInfo.hoursEstimated) || typeof taskInfo.completed !== "boolean") {
                    throw '-> check the following -> Provide all the information -> Hours-Estimated must be a Number -> completed must be a boolean';
                } else {
                    const updatedTask = await tasksData.updateTask(id, taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed);
                    res.status(200).send(updatedTask);
                }
            } catch (e) {
                res.status(500).json({ "Error": e });;
            }
        })
        app.route("/api/tasks/:id").patch(async (req: Request, res: Response) => {
            try {
                let id: string = req.params.id;
                const taskInfo = req.body;
                if (taskInfo.comments) {
                    throw 'You Cannot modify Comments using PATCH, Remove comments from body.';
                }
                if (!taskInfo.title && !taskInfo.description && !taskInfo.hoursEstimated && !taskInfo.completed) {
                    throw '-> check the following -> Provide at least one information -> Hours-Estimated must be a Number -> completed must be a boolean';
                } else {
                    const patchedTask = await tasksData.patchTask(id, taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed);
                    res.status(200).send(patchedTask);
                }
            } catch (e) {
                res.status(500).send({ error: e });
            }
        })
        app.route("/api/tasks/:id/comments").post(async (req: Request, res: Response) => {
            // "id": AutoGenerate,
            // "name": string,
            // "comments": comment[]
            try {
                let id = req.params.id;
                let commentInfo = req.body;
                if (commentInfo.id) {
                    throw 'You must remove comment Id';
                }
                if (!commentInfo.name || !commentInfo.comment) {
                    throw 'You must provide all the information';
                } else {
                    const newComment = await tasksData.createComment(id, commentInfo.name, commentInfo.comment);
                    res.status(200).send(newComment);
                }
            } catch (e) {
                res.status(500).send({ error: e });
            }
        })
        app.route("/api/tasks/:taskId/:commentId").delete(async(req: Request, res: Response)=>{
            
            try {
                const taskId = req.params.taskId;
                const commentId = req.params.commentId;
        
                if (!taskId || !commentId) {
                    throw 'You must provide all the information';
                } else {
                    const task = await tasksData.deleteComment(taskId, commentId);
                    res.status(200).send(task);
                }
            } catch (e) {
                res.status(500).send({ error: e });
            }        
        })
        app.use("*",async(req: Request, res: Response)=>{
            res.status(404).send({
                "error":"Invalid Page"
            })
        })
    }
}