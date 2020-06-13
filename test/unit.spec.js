
const request = require("supertest");
const expect = require("chai").expect;
const ContactServer = require("../api/server");

describe("Unit test for contactsController authorize", () => {
  let server;
  const illegalToken = "15s3v1f53v13d5fv";

  before(async () => {
    server = new ContactServer();
    server = await server.start();
  });

  after(() => {
    server.close();
  });

  describe("GET /contacts ", () => {
    it("should throw 401 error without Authorization header", (done) => {
      request(server)
        .get("/contacts")
        .set("Content-Type", "application/json")
        .expect(401)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.text).to.equal('{"message":"Not authorized"}');

          return done();
        });
    });

    it("should throw 401 error wrong token", (done) => {
      request(server)
        .get("/contacts")
        .set("Authorization", `Bearer ${illegalToken}`)
        .expect(401)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.text).to.equal('{"message":"Not authorized"}');

          return done();
        });
    });
  });
});
