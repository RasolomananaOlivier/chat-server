import supertest from "supertest";
import httpServer from "../../app";
import mongoose from "mongoose";
import UserModel, { IUserPostRequest } from "../../database/models/UserModel";

describe("User routes", () => {
  beforeAll(async () => {
    await UserModel.deleteMany();
  });

  test("GET /api/v1/users", async () => {
    const res = await supertest(httpServer).get("/api/v1/users");
    expect(res.statusCode).toBe(200);
  });

  describe("POST /api/v1/users", () => {
    test("user created successfully", async () => {
      const data: IUserPostRequest = {
        email: "test@example.com",
        firstname: "testname",
        lastname: "testlastname",
        password: "123456789",
        avatarUrl: "",
      };

      const { status } = await supertest(httpServer)
        .post("/api/v1/users")
        .send(data);
      expect(status).toBe(201);
    });

    test("user email already exist", async () => {
      const data: IUserPostRequest = {
        email: "test@example.com",
        firstname: "testname",
        lastname: "testlastname",
        password: "123456789",
        avatarUrl: "",
      };

      const { status } = await supertest(httpServer)
        .post("/api/v1/users")
        .send(data);
      expect(status).toBe(400);
    });
  });

  let token: string;
  let correctUserId: string;
  test("POST /api/v1/auth/login", async () => {
    const data = { email: "test@example.com", password: "123456789" };

    const response = await supertest(httpServer)
      .post("/api/v1/auth/login")
      .send(data);

    token = response.body.token;
    correctUserId = response.body.data._id;
    expect(response.statusCode).toBe(200);
  });

  describe("GET /api/v1/users/:userId", () => {
    test("x-access-token not provided", async () => {
      const wrongUserId = mongoose.Types.ObjectId();

      const { body } = await supertest(httpServer).get(
        `/api/v1/users/${wrongUserId}`
      );

      expect(body?.name).toBe("x-access-token-error");
    });

    test("x-access-token modified", async () => {
      const wrongUserId = mongoose.Types.ObjectId();

      const { body } = await supertest(httpServer)
        .get(`/api/v1/users/${wrongUserId}`)
        .set("x-access-token", "token");

      expect(body?.name).toBe("JsonWebTokenError");
    });

    test("userId: not found", async () => {
      const wrongUserId = mongoose.Types.ObjectId();

      const res = await supertest(httpServer)
        .get(`/api/v1/users/${wrongUserId}`)
        .set("x-access-token", token);

      expect(res.status).toBe(404);
    });

    test("userId: wrong format", async () => {
      const wrongUserId = "123456";

      const res = await supertest(httpServer)
        .get(`/api/v1/users/${wrongUserId}`)
        .set("x-access-token", token);

      expect(res.body.error.name).toBe("InvalidUserId");
    });

    test("userId: correct", async () => {
      const res = await supertest(httpServer)
        .get(`/api/v1/users/${correctUserId}`)
        .set("x-access-token", token);

      expect(res.statusCode).toBe(200);
    });
  });

  describe("PUT /api/v1/users/:userId", () => {
    test("update personal information", async () => {
      const res = await supertest(httpServer)
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
      const res = await supertest(httpServer)
        .put(`/api/v1/users/${correctUserId}?email=update`)
        .send({ email: "newtest@example.com" });

      expect(res.status).toBe(200);
    });

    test("update email + userId wrong format", async () => {
      const res = await supertest(httpServer)
        .put(`/api/v1/users/${"correctUserId"}?email=update`)
        .send({ email: "newtest@example.com" });

      expect(res.body.error.name).toBe("InvalidUserId");
    });
  });
});
