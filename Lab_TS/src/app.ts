import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
class App {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    public app: express.Application;
    private config(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }
    private routes(): void {
        const router = express.Router();
        router.get('/', (req: Request, res: Response) => {
            res.json({ message: "Hello world" })
        })
        router.post('/', (req: express.Request, res: express.Response) => {
            let bodyData = req.body;
            res.json(bodyData);
        })
        this.app.use('/', router);
    }

}
export default new App().app;