import fs from "fs/promises";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

export class ContainerRepository {

    constructor() {
        // this.client = new MongoClient("mongodb://localhost:27017");
        this.dbName = "docker_manager";
        this.collectionName = "containers";
        this.db = null;
        this.collection = null;
    }

    async init() {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection(this.collectionName);
    }

    /**
     * Load containers from a TEMP JSON file and delete the file afterwards
     */
    async loadContainers(tmpJsonPath) {
        const raw = await fs.readFile(tmpJsonPath, "utf-8");
        const containers = JSON.parse(raw);
        const result = await this.collection.insertMany(containers);
        await fs.unlink(tmpJsonPath);

        return {
            inserted: result.insertedCount,
            fileDeleted: true
        };
    }

    async getContainer(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    // async getContainers() {
    //     return await this.collection.find().toArray();
    // }

    async getContainers() {
        return [
            {
                name: "web_server",
                image: "nginx",
                port: 80
            },
            {
                name: "db_server",
                image: "mysql",
                port: 3306
            },
            {
                name: "cache_server",
                image: "redis",
                port: 6379
            }
        ];
    }


    async deleteContainer(id) {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return { deleted: result.deletedCount === 1 };
    }
}
