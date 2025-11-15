import fs from "fs/promises";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

export class ContainerRepository {

    static containers = null;
    constructor() {
    }

    static async #init() {

    }

    /**
     * Load containers from a TEMP JSON file and delete the file afterwards
     */
    static async loadContainers(tmpJsonPath) {
        await ContainerRepository.#init();
        ContainerRepository.containers = [
            {
                id: 1,
                name: "web_server",
                image: "nginx",
                port: 80
            },
            {
                id: 2,
                name: "db_server",
                image: "mysql",
                port: 3306
            },
            {
                id: 3,
                name: "cache_server",
                image: "redis",
                port: 6379
            }
        ];
        
    }

    async getContainer(id) {
        return ContainerRepository.containers.filter(container => container.id == id)
    }

    async getContainers() {
        return ContainerRepository.containers;
    }

    async insertContainer(data) {
        this.containers.push(obj)
    }

    async deleteContainer(id) {
        ContainerRepository.containers = ContainerRepository.containers.filter(container => container.id != id)
    }
}
