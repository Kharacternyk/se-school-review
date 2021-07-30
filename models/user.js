import jwt from "jsonwebtoken";
import {dirname} from "path";
import * as bcrypt from "bcrypt";
import {promises as fs} from "fs";

export default class User {
    constructor(email, dbDir) {
        this.email = email;
        this._dbPath = dbDir + fsEscape(email);
    }
    async setPassword(password) {
        const mkdirPromise = fs.mkdir(dirname(this._dbPath), {recursive: true});
        const hashPromise = bcrypt.hash(password, 8);
        await mkdirPromise;
        await fs.writeFile(this._dbPath, await hashPromise);
    }
    async login(password, secret, tokenExpiresIn) {
        let hash;
        try {
            hash = await fs.readFile(this._dbPath, {encoding: "UTF-8"});
        } catch (error) {
            if (error.code === "ENOENT") {
                return null;
            }
            throw error;
        }
        if (await bcrypt.compare(password, hash)) {
            const options = {};
            if (tokenExpiresIn) {
                options.expiresIn = tokenExpiresIn;
            }
            const token = jwt.sign({email: this.email}, secret, options);
            return token;
        }
        return null;
    }
    static authenticate(token, secret) {
        try {
            return jwt.verify(token, secret);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return null; 
            } else {
                throw error;
            }
        }
    }
}

/* Replaces all occurrences of '/' with '..', which is illegal in email addresses,
 * and breaks the address into directories on filename limit boundaries.
 */
function fsEscape(email) {
    let escaped = email.replace(/[/]/g, "..");
    let path = "";
    while (escaped) {
        path += "/" + escaped.slice(0, 255);
        escaped = escaped.slice(256);
    }
    return path;
}
