import { Collection } from "mongodb";
import dbConnection from "./Connection";

export interface Task {
  _id: any;
  title: string;
  description: string;
  hoursEstimated: number;
  completed: boolean;
  comments: Comment[];
}

export interface Comment {
  _id: any;
  name: string;
  comment: string;
}

function getCollection<T>(collection: string): () => Promise<Collection<T>> {
  let _col: Collection<T> | undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection<T>(collection);
    }
    return _col;
  };
}
const tasks = getCollection<Task>("tasks");

export { tasks };