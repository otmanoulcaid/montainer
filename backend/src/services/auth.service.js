import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserService } from './user.service.js';

export class AuthService {

    constructor() {
        this.userService = UserService.getService()
    }

    async login(matricule, password, res) {
        matricule = Number(matricule);
        const user = await this.userService.getUserByMatricule(matricule);
        if (!user) throw new Error("User not found");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Invalid password");

        const payload = { role: user.role, matricule: user.matricule };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev8env', {
            expiresIn: "1h"
        });

        // Cookie sécurisé
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60
        });

        return {
            message: "Logged in",
            user: {
                id: user._id,
                matricule: user.matricule,
                role: user.role
            }
        };
    }

    logout(res) {
        res.clearCookie("accessToken");
        return { message: "Logged out successfully" };
    }

    verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET || "dev8env");
    }

    verifyTokenFromCookie(req) {
        const token = req.cookies.jwt;
        if (!token) throw new Error("No token provided");
        return jwt.verify(token, process.env.JWT_SECRET || "dev8env");
    }
}
