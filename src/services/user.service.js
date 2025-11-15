export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
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
