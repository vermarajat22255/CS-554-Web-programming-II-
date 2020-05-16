import { Db, MongoClient } from "mongodb";

const settings = {
  mongoConfig: {
    serverURL: "mongodb://localhost:27017/",
    database: "tasks",
  },
};

let _connection: MongoClient;
let _db: Db;

export default async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(settings.mongoConfig.serverURL, {
      useNewUrlParser: true,
    });
    _db = await _connection.db(settings.mongoConfig.database);
  }

  return _db;
};