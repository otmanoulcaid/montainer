import { MongoClient, ObjectId } from "mongodb";
import fs from "fs/promises";

export class UserRepository {

    constructor() {
        this.users = null
    }

    static async loadUsers() {
        this.users = [
            {
                id: 1,
                fullName: "Otmane El Amrani",
                role: "DevOps Engineer",
                tele: "+212612345678",
                experienceYears: 3
            },
            {
                id: 2,
                fullName: "Sara Benjelloun",
                role: "Technicien Monitoring",
                tele: "+212665432198",
                experienceYears: 2
            },
            {
                id: 3,
                fullName: "Youssef El Idrissi",
                role: "DevOps Engineer",
                tele: "+212701223344",
                experienceYears: 5
            },
            {
                id: 4,
                fullName: "Hind Marzouki",
                role: "Technicien Monitoring",
                tele: "+212634998877",
                experienceYears: 1
            }
        ];
    }


    async getUser(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async getUsers() {
        return await this.collection.find().toArray();
    }
}
