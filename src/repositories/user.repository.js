import { MongoClient, ObjectId } from "mongodb";
import fs from "fs/promises";

export class UserRepository {

    constructor() {
        this.client = new MongoClient("mongodb://localhost:27017");
        this.dbName = "docker_manager";
        this.collectionName = "users";

        this.db = null;
        this.collection = null;
    }

    async init() {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection(this.collectionName);

        console.log("MongoDB connected (users collection ready)");
    }

    async loadUsers(tmpFilePath) {
        const raw = await fs.readFile(tmpFilePath, "utf-8");
        const users = JSON.parse(raw);

        await this.collection.deleteMany({});
        const result = await this.collection.insertMany(users);
        await fs.unlink(tmpFilePath);

        return {
            inserted: result.insertedCount,
            fileDeleted: true
        };
    }

    async getUser(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async getUsers() {
        return await this.collection.find().toArray();
    }
}
