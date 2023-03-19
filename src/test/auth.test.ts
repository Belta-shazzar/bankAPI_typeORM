import { app } from "../app";
import { StatusCodes } from "http-status-codes";
import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const expect = chai.expect;

const testData = {
  fullName: "Test Case",
  email: "test@gmail.com",
  password: "password",
};

describe("Auth API", () => {
  describe("POST /api/v1/auth/sign-up", () => {
    it("should register a new user", () => {
    chai
        .request(app)
        .post("/api/v1/auth/sign-up")
        .send(testData)
        .end((err, res) => {
          console.log(res.body)
          expect(res).to.have.status(StatusCodes.CREATED);

          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("success");
          
        });
    });
  });
});
