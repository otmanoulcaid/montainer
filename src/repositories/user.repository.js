import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import fs from "fs/promises";

export class UserRepository {

    static #repo = null

    constructor() {
        this.client = new MongoClient("mongodb://admin:secret@localhost:27017/?authSource=admin");
        this.dbName = "docker_manager";
        this.collectionName = "users";

        this.db = null;
        this.collection = null;
    }

    static getRepo() {
        if (!UserRepository.#repo)
            UserRepository.#repo = new UserRepository();
        return UserRepository.#repo
    }

    async init() {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection(this.collectionName);
        console.log("MongoDB connected (users collection ready)");
    }

    async loadUsers(tmpFilePath) {
        await this.init();
        const raw = await fs.readFile(tmpFilePath, "utf-8");
        const users = JSON.parse(raw);
        for (const user of users) {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
        await this.collection.deleteMany({});
        const result = await this.collection.insertMany(users);
        // await fs.unlink(tmpFilePath);

        return {
            inserted: result.insertedCount,
            fileDeleted: true
        };
    }

    async getUser(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async findUserByMatricule(matricule) {
        return await this.collection.findOne({ matricule: Number(matricule) });
    }

    async getUsers() {
        return await this.collection.find().toArray();
    }
}
