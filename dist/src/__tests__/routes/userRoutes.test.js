"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = __importDefault(require("../../database/models/UserModel"));
describe("User routes", () => {
    beforeAll(async () => {
        await UserModel_1.default.deleteMany();
    });
    test("GET /api/v1/users", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/v1/users");
        expect(res.statusCode).toBe(200);
    });
    describe("POST /api/v1/users", () => {
        test("user created successfully", async () => {
            const data = {
                email: "test@example.com",
                firstname: "testname",
                lastname: "testlastname",
                password: "123456789",
            };
            const { status } = await (0, supertest_1.default)(app_1.default)
                .post("/api/v1/users")
                .send(data);
            expect(status).toBe(201);
        });
        test("user email already exist", async () => {
            const data = {
                email: "test@example.com",
                firstname: "testname",
                lastname: "testlastname",
                password: "123456789",
            };
            const { status } = await (0, supertest_1.default)(app_1.default)
                .post("/api/v1/users")
                .send(data);
            expect(status).toBe(400);
        });
    });
    let token;
    let correctUserId;
    test("POST /api/v1/auth/login", async () => {
        const data = { email: "test@example.com", password: "123456789" };
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/auth/login")
            .send(data);
        token = response.body.token;
        correctUserId = response.body.data._id;
        expect(response.statusCode).toBe(200);
    });
    describe("GET /api/v1/users/:userId", () => {
        test("x-access-token not provided", async () => {
            const wrongUserId = mongoose_1.default.Types.ObjectId();
            const { body } = await (0, supertest_1.default)(app_1.default).get(`/api/v1/users/${wrongUserId}`);
            expect(body === null || body === void 0 ? void 0 : body.name).toBe("x-access-token-error");
        });
        test("x-access-token modified", async () => {
            const wrongUserId = mongoose_1.default.Types.ObjectId();
            const { body } = await (0, supertest_1.default)(app_1.default)
                .get(`/api/v1/users/${wrongUserId}`)
                .set("x-access-token", "token");
            expect(body === null || body === void 0 ? void 0 : body.name).toBe("JsonWebTokenError");
        });
        test("userId: not found", async () => {
            const wrongUserId = mongoose_1.default.Types.ObjectId();
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/api/v1/users/${wrongUserId}`)
                .set("x-access-token", token);
            expect(res.status).toBe(404);
        });
        test("userId: wrong format", async () => {
            const wrongUserId = "123456";
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/api/v1/users/${wrongUserId}`)
                .set("x-access-token", token);
            expect(res.body.error.name).toBe("InvalidUserId");
        });
        test("userId: correct", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .get(`/api/v1/users/${correctUserId}`)
                .set("x-access-token", token);
            expect(res.statusCode).toBe(200);
        });
    });
    describe("PUT /api/v1/users/:userId", () => {
        test("update personal information", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/v1/users/${correctUserId}`)
                .send({
                firstname: "updated1",
                lastname: "updated2",
            });
            expect(res.status).toBe(200);
        });
    });
    describe("PUT /api/v1/users/:userId?email", () => {
        test("update email + userId correct", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/v1/users/${correctUserId}?email=update`)
                .send({ email: "newtest@example.com" });
            expect(res.status).toBe(200);
        });
        test("update email + userId wrong format", async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put(`/api/v1/users/${"correctUserId"}?email=update`)
                .send({ email: "newtest@example.com" });
            expect(res.body.error.name).toBe("InvalidUserId");
        });
    });
});
