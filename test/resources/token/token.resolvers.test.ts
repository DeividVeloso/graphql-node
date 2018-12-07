import { chai, db, app, expect, handleError } from "../../test-utils";

describe("Token", () => {
  let userId;
  beforeEach(() => {
    return db.User.destroy({ where: {} }).then(() => {
      return db.User.create({
        name: "Ana Paula",
        email: "aninha@gmail.com",
        password: "1234"
      }).then(user => {
        userId = user.get("id");
      });
    });
  });
  describe("Mutation", () => {
    describe("application/json", () => {
      describe("createToken", () => {
        it("should return Token", () => {
          let body = {
            query: `
                      mutation createTokenUser($email: String!, $password: String!) {
                          createToken(email: $email, password: $password) {
                              token
                          }
                      }
                    `,
            variables: {
              email: "aninha@gmail.com",
              password: "1234"
            }
          };

          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              const createToken = res.body.data.createToken;
              expect(res.body.data).to.be.an("object");
              expect(createToken.token).to.not.be.null;
            })
            .catch(error => handleError(error));
        });
        it("should return null when user doesnt exist", () => {
          let body = {
            query: `
                      mutation createTokenUser($email: String!, $password: String!) {
                          createToken(email: $email, password: $password) {
                              token
                          }
                      }
                    `,
            variables: {
              email: "veloso.deivid@gmail.com",
              password: "1234"
            }
          };

          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              const createToken = res.body.data.createToken;
              expect(res.body.data).to.be.an("object");
              expect(createToken).to.be.null;
            })
            .catch(error => handleError(error));
        });
      });
    });
  });
});
