import User from "../models/user.js";

export const auth = secret => (request, response, next) => {
    const auth = request.headers.authorization;
    if (!auth) {
        return response.sendStatus(401);
    }
    const [scheme, token, ...tail] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
        return response.sendStatus(401);
    }
    const user = User.authenticate(token, secret);
    if (user) {
        request.user = user;
        next();
    } else {
        response.sendStatus(401);
    }
}

export function parse(request, response, next) {
    if (typeof request.body.email != "string" ||
        typeof request.body.password != "string" ||
        request.body.email.length === 0) {
        return response.sendStatus(400);
    }
    request.email = request.body.email;
    request.password = request.body.password;
    next();
}

export const create = dbDir => async (request, response) => {
    const user = new User(request.email, dbDir);
    await user.setPassword(request.password);
    response.sendStatus(200);
}

export const login = (secret, tokensExpireIn, dbDir) => async (request, response) => {
    const user = new User(request.email, dbDir);
    const token = await user.login(request.password, secret, tokensExpireIn);
    if (token) {
        response.json(token);
    } else {
        response.sendStatus(401);
    }
}