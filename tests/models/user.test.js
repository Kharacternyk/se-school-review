import User from "../../models/user.js";
import {tmpdir} from "os";
import {promises as fs} from "fs";
import * as fc from "fast-check";

let dbDir;

beforeAll(async () => dbDir = await fs.mkdtemp(tmpdir() + "/"));

test("create/login/authenticate a user", () => fc.assert(fc.asyncProperty(
    fc.string({minLength: 1}),
    fc.emailAddress(),
    fc.string(),
    fc.string(),
    fc.string(),
    async (secret, email, password, fakePassword, fakeToken) => {
        const user = new User(email, dbDir);
        await user.setPassword(password);

        const token = await user.login(password, secret);
        expect(token).toBeTruthy();
        expect(typeof token).toEqual("string");
        expect(User.authenticate(token, secret).email).toEqual(email);

        if (password !== fakePassword) {
            expect(await user.login(fakePassword, secret)).toBe(null);
        }
        if (token !== fakeToken) {
            expect(User.authenticate(fakeToken, secret)).toBe(null);
        }
    }), {
        examples: [
            /* Exceeds the filename length limit */
            ["a", "a".repeat(300) + "@a.a", "a", "b", "a"]
        ],
        interruptAfterTimeLimit: 4000,
    }
));
