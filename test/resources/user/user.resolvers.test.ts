import { chai, app, db, expect, handleError } from "./../../test-utils";

describe("User", () => {
  let userId: number;
  beforeEach(() => {
    return db.Comment.destroy({ where: {} }).then((rows: number) =>
      db.Post.destroy({ where: {} }).then((rows: number) =>
        db.User.destroy({ where: {} }).then(() => {
          return db.User.bulkCreate([
            {
              name: "Ana Paula",
              email: "aninha@gmail.com",
              password: "1234"
            },
            {
              name: "Lola",
              email: "lola@gmail.com",
              password: "1234"
            },
            {
              name: "Champs",
              email: "champs@gmail.com",
              password: "1234"
            }
          ]).then(users => {
            userId = users[0].get("id");
            //console.log("XXXX", userId);
          });
        })
      )
    );
  });
  describe("Queries", () => {
    describe("application/json", () => {
      describe("users", () => {
        it("should return a list of Users", () => {
          let body = {
            query: `
                    query {
                        users {
                            name
                            email
                        }
                    }
                  `
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              const userList = res.body.data.users;
              expect(res.body.data).to.be.an("object");
              expect(userList).to.be.an("array");
              expect(userList[0]).to.not.have.keys(["id", "photo", "createAt"]);
              expect(userList[0]).to.have.keys(["name", "email"]);
            })
            .catch(error => handleError(error));
        });
        it("should paginate a list of Users", () => {
          let body = {
            query: `
                      query getUsersList($first: Int, $offset: Int) {
                          users(first: $first, offset: $offset) {
                              name
                              email
                              createdAt
                          }
                      }
                    `,
            variables: {
              first: 2,
              offset: 1
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              const userList = res.body.data.users;

              expect(res.body.data).to.be.an("object");
              expect(userList)
                .to.be.an("array")
                .of.length(2);
              expect(userList[0]).to.not.have.keys(["id", "photo"]);
              expect(userList[0]).to.have.keys(["name", "email", "createdAt"]);
            })
            .catch(error => handleError(error));
        });
      });
      describe("user", () => {
        it("should return a single user", () => {
          let body = {
            query: `
                      query getSingleUser($id: ID!) {
                        user(id: $id) {
                              name
                              email
                              createdAt
                          }
                      }
                    `,
            variables: {
              id: userId
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              const user = res.body.data.user;
              expect(res.body.data).to.be.an("object");
              expect(user).to.not.have.keys(["id", "photo"]);
              expect(user).to.have.keys(["name", "email", "createdAt"]);
              expect(user.name).to.equal("Ana Paula");
              expect(user.email).to.equal("aninha@gmail.com");
            })
            .catch(error => handleError(error));
        });

        it("should return only 'name' of user", () => {
          let body = {
            query: `
                      query getSingleUser($id: ID!) {
                        user(id: $id) {
                              name
                          }
                      }
                    `,
            variables: {
              id: userId
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              const user = res.body.data.user;
              expect(res.body.data).to.be.an("object");
              expect(user).to.not.have.keys(["id", "photo"]);
              expect(user).to.have.key("name");
              expect(user.name).to.equal("Ana Paula");
              expect(user.email).to.be.undefined;
            })
            .catch(error => handleError(error));
        });
        it("should return error with user not found", () => {
          let body = {
            query: `
                      query getSingleUser($id: ID!) {
                        user(id: $id) {
                              name
                          }
                      }
                    `,
            variables: {
              id: -1
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.data.user).to.be.null;
              expect(res.body.errors).to.be.an("array");
              expect(res.body).to.have.keys(["data", "errors"]);
              expect(res.body.errors[0].message).to.equal(
                "Error: User with id -1 not found!"
              );
            })
            .catch(error => handleError(error));
        });
      });
    });
  });
});
