import jwt from "jsonwebtoken";

const EXCLUDED_ROUTES = [
    { method: "POST", path: "/v1/auth/login" },
    { method: "POST", path: "/v1/auth/logout" }
];

export function authMiddleware(req, res, next) {
    const requestPath = req.path;
    const requestMethod = req.method.toUpperCase();

    const isExcluded = EXCLUDED_ROUTES.some(r =>
        r.method === requestMethod && r.path === requestPath
    );

    if (isExcluded) return next();

    try {
        const token = req.cookies?.accessToken;

        if (!token)
            return res.status(401).json({ error: "Authentification requise" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev8env");

        req.user = decoded;
        if (["POST", "DELETE"].includes(requestMethod)) {
            
            if (req.user.role !== "ing")
                return res.status(403).json({ error: "Accès réservé aux DevOps" });
        }
        return next();
    } catch (e) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }
}
