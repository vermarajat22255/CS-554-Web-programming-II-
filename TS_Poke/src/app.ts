import * as express from "express";
import {Tasks} from "./routes/tasks";
var totalRequest:number = 0;
var visited:object = {};

class App {
    public app: express.Application;
    public taskRoutes: Tasks= new Tasks();
    constructor(){
        this.app = express();
        this.config();
        this.taskRoutes.routes(this.app); 
    }
    Logger1 = (req: express.Request, res: express.Response, next: Function)=>{
        console.log("Logger 1: Requested Method", req.method + " at URL http://localhost:3000" + req.originalUrl);
        next();    
    }
    Logger2 = (req: express.Request, res: express.Response, next: Function)=>{
        let url:string = req.originalUrl;
        if (visited[url] != undefined) {
            visited[url] += 1;
        } else {
            visited[url] = 1;
        }
        console.log("Logger 2: Count of http://localhost:3000" + url + " : " + visited[url]);
        next();    
    } 
    private config(): void{
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
        this.app.use(this.Logger1);
        this.app.use(this.Logger2);
    }
}
export default new App().app;