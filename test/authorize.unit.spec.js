const should = require("should");
const sinon = require("sinon");
const { authorize } = require("../api/contacts/contact.controller");

describe("#authorize", () => {
  let reqStub;
  let resStub;
  let next = (smth) => smth;

  describe("request without Authorize header", () => {
    before(() => {
      reqStub = () => {
        return {
          get: function (headerName) {
            return this.headers[headerName];
          },

          headers: {
            notAutorizeHeader: "bla-bla-bla",
          },
        };
      };

      resStub = () => {
        const res = {};
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns(res);
        return res;
      };

      // nextStep = (smth) => {
      //   console.log("sdsdsdsd");
      //   return console.log("NEXT!!!", smth);
      // };
    });

    it("should return 401 err", async () => {
      const req = reqStub;
      const res = resStub();
      // const next = nextStep();

      const result = await authorize(req, res, next);

      console.log(result);
      // done();
    });
  });
});
