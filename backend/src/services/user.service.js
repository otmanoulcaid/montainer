import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
    static #userService = null;
    constructor() {
        this.userRepository = UserRepository.getRepo();
        this.userRepository.loadUsers('src/data/xml/users.xml.json');
    }

    static getService() {
        if (!UserService.#userService)
            UserService.#userService = new UserService();
        return UserService.#userService;
    }

    async getUser(obj) {
        if (!obj || !obj.id)
            throw new Error("Missing user ID");

        return await this.userRepository.getUser(obj.id);
    }

    async getUserByMatricule(matricule) {
        return await this.userRepository.findUserByMatricule(matricule)
    }

    async getUsers() {
        return await this.userRepository.getUsers();
    }
}
