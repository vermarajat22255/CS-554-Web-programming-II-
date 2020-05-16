import { MongosOptions, ObjectID } from "mongodb";
import { tasks } from "./Collection";
const underScore = require("underscore");
const GuID = require("guid");
const DbConnection = require("../data/Connection");
var _db: any;
var _collection: any;
interface Task {
    title: string;
    description: string;
    hoursEstimated: number;
    completed: boolean;
    comments: Comment[];
}
interface Comment {
    _id: any;
    name: string;
    comment: string;
}
export class TasksData {
    constructor() {
        async function connect() {
            _collection = await tasks();
        }
        connect();
    }
    public getAll = async (skip?: number, take?: number): Promise<Task> => {
        if (skip) {
            if (isNaN(parseInt(skip + ""))) {
                throw "Invalid skip type: skip can only be number"
            };
        }
        if (take) {
            if (isNaN(parseInt(take + ""))) {
                throw "Invalid take type: take can only be number"
            };
        }
        skip = parseInt(skip + "");
        take = parseInt(take + "");
        var data = await _collection.find({}).toArray();

        if (skip && take) {
            var temp = [];
            let j: number = 0;
            for (let i: number = skip; i < data.length; i++, j++) {
                temp[j] = data[i];
            }
            return (take < 101 ? underScore.first(temp, take) : underScore.first(temp, 20));

        } else if (!skip && !take) {
            return (underScore.first(data, 20));
        }
        else if (skip && !take) {
            var temp = [];
            let j: number = 0;
            for (let i: number = skip; i < data.length; i++, j++) {
                temp[j] = data[i];
            }

            return (underScore.first(temp, 20));

        } else if (!skip && take) {
            return (take < 101 ? underScore.first(data, take) : underScore.first(data, 20));
        }
    }
    public get = async (id: any): Promise<Task> => {

        var data = await _collection.findOne({ _id: id });
        if (!data) throw "No Data for this id";
        return data;
    }
    public create = async (title: string, description: string, hoursEstimated: string): Promise<Task> => {

        if (title && typeof (title) === "string" && description && typeof (description) === "string" && hoursEstimated && !isNaN(parseInt(hoursEstimated))) {

            let newObj: Task = {
                comments: [],
                completed: false,
                description: description,
                hoursEstimated: parseInt(hoursEstimated),
                title: title
            };

            const insertTask = await _collection.insertOne(newObj);

            if (insertTask.insertedCount === 0) throw "Could not add Task";
            return newObj;

        } else {
            throw "Must Have title(String), description(String) andn hourestimted(Number) ";
        }
    }
    public updateTask = async (id: string, title: string, description: string, hoursEstimated: number, completed: boolean): Promise<Task> => {

        const ObjId: ObjectID = require("mongodb").ObjectID(id);
        let task = await this.get(ObjId);
        if (task != null || task != undefined) {
            const comments = task.comments;
            const updateInfo = await _collection.updateOne({ _id: ObjId }, { $set: { title: title, description: description, hoursEstimated: hoursEstimated, completed: completed, comments: comments } });
            if (updateInfo.modifiedCount == 0) {
                throw "could not update Task successfully OR Nothing to Update";
            }
        } else {
            throw "No Task with that id";
        }

        return await this.get(ObjId);
    }
    public patchTask = async function patchTask(id: string, title?: string, description?: string, hoursEstimated?: string, completed?: boolean): Promise<Task> {

        const ObjId: ObjectID = require("mongodb").ObjectID(id);
        const task = await this.get(ObjId);

        if ((hoursEstimated && isNaN(parseInt(hoursEstimated))) || (completed && typeof completed !== "boolean")) {
            throw 'Hours Estimated must be a number and completed must be a boolean';
        }
        if (task != null || task != undefined) {

            let updateObject = {}
            if (title) updateObject["title"] = title;
            if (description) updateObject["description"] = description;
            if (hoursEstimated) updateObject["hoursEstimated"] = hoursEstimated;
            if (completed != null && completed !== undefined) updateObject["completed"] = completed;

            //use $set to do a partial update on the updateObject
            const updateInfo = await _collection.updateOne({ _id: ObjId }, { $set: updateObject });
            if (updateInfo.modifiedCount == 0) {
                throw "could not update Task successfully Or Nothing to change";
            }

            return await this.get(ObjId);
        } else {
            throw "No Task with that id";
        }
    }
    public createComment = async function createComment(id: string, name: string, comment: string): Promise<Task> {
        const ObjId: ObjectID = require("mongodb").ObjectID(id);
        const task = await this.get(ObjId);

        if (task != null || task != undefined) {
            // interface comment {
            //     "id": string,
            //     "name": string,
            //     "comment": string
            // }
            const newComment: Comment = {
                "_id": GuID.raw(),
                "name": name,
                "comment": comment
            };
            //$push the newComment object onto the list of comments
            const updateInfo = await _collection.updateOne({ _id: ObjId }, { $push: { comments: newComment } })

            if (updateInfo.modifiedCount == 0) {
                throw "could not update Task successfully";
            }
            return await this.get(ObjId);
        } else {
            throw "No Task with that id";
        }
    }
    public deleteComment = async (tId: string, commentId: string): Promise<Task> => {

        const taskId:ObjectID = require("mongodb").ObjectID(tId);
        const task = await this.get(taskId);
        if (!task) throw "No task with that Id";
        const updateInfo = await _collection.updateOne({ _id: taskId }, { $pull: { comments: { _id: commentId } } });
        if (updateInfo.modifiedCount === 0) {
            throw "could not update Task successfully, May be No comments with given Id";
        }
        const updatedTask = await this.get(taskId);
        return updatedTask;
    }
}