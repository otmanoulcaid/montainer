import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.userRepository.loadUsers('src/data/user.data.json');
    }

    async getUser(obj) {
        if (!obj || !obj.id)
            throw new Error("Missing user ID");

        return await this.userRepository.getUser(obj.id);
    }

    async getUsers() {
        return await this.userRepository.getUsers();
    }
}
