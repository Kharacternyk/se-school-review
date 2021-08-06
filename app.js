import btcRate from "./controllers/btcRate.js";
import * as user from "./controllers/user.js";
import express from "express";

export default class App extends express {
    constructor(secret, tokensExpireIn, dbDir, ...params) {
        super(...params);
        this.use(express.json());
        this.get("/btcRate", user.auth(secret), btcRate);
        this.post("/user/create", user.parse, user.create(dbDir));
        this.post("/user/login", user.parse, user.login(secret, tokensExpireIn, dbDir));
        this.use((request, response, next) => response.sendStatus(404));
        this.use((error, request, response, next) =>
            response.status(400).json({error: {message: error.message}}));
    }
}
