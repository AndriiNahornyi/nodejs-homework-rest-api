/* eslint-disable no-prototype-builtins */
const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../app");
const { createHashPassword } = require("../helpers");
const User = require("../models/user");

mongoose.set("strictQuery", false);

const { MONGO_URI, PORT } = process.env;

describe("test auth routes", () => {
  let server;
  beforeAll(() => (server = app.listen(PORT)));
  afterAll(() => server.close());

  beforeEach((done) => {
    mongoose.connect(MONGO_URI).then(() => done());
  });

  afterEach((done) => {
    mongoose.connection.close();
    done();
  });

  test("test login route", async () => {
    const newUser = {
      email: "andrii@gmail.com",
      password: "andriitest",
      avatarURL: "mockurl",
    };

    const hashPassword = await createHashPassword(newUser.password);
    const user = await User.create({ ...newUser, password: hashPassword });

    const loginUser = {
      email: "andrii@gmail.com",
      password: "andriitest",
    };

    const response = await request(app)
      .post("/api/auth/signin")
      .send(loginUser);

    expect(response.statusCode).toBe(200);
    const { body } = response;
    expect(body.token).toBeTruthy();
    const { token } = await User.findById(user._id);
    expect(body.token).toBe(token);

    expect(typeof body.user).toBe("object");

    expect(body.user.hasOwnProperty("email")).toBe(true);
    expect(body.user.hasOwnProperty("subscription")).toBe(true);
    expect(body.user.hasOwnProperty("avatarURL")).toBe(true);

    expect(typeof body.user.email).toBe("string");
    expect(typeof body.user.subscription).toBe("string");
    expect(typeof body.user.avatarURL).toBe("string");

    await User.findByIdAndDelete(user._id);
  });
});
