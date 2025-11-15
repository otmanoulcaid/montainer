import fs from "fs/promises";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

export class ContainerRepository {
    constructor() {
        this.client = new MongoClient("mongodb://admin:secret@localhost:27017/?authSource=admin");
        this.dbName = "docker_manager";
        this.collectionName = "containers";
        this.db = null;
        this.collection = null;
    }

    async init() {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection(this.collectionName);
        console.log("MongoDB connected (container collection ready)");
    }

    /**
     * Load containers from a TEMP JSON file and delete the file afterwards
     */
    async loadContainers(tmpJsonPath) {
        await this.init();
        const raw = await fs.readFile(tmpJsonPath, "utf-8");
        const containers = JSON.parse(raw);
        const result = await this.collection.insertMany(containers);
        // await fs.unlink(tmpJsonPath);

        return {
            inserted: result.insertedCount,
            fileDeleted: true
        };
    }

    async getContainer(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async getContainers() {
        return await this.collection.find().toArray();
    }

    async deleteContainer(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return { deleted: result.deletedCount === 1 };
    }
}
