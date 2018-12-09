import { chai, app, db, expect, handleError } from "./../../test-utils";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../src/utils/handlersServer";

describe("User", () => {
  let userId: number;
  let token: string;
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
            token = jwt.sign({ sub: userId }, JWT_SECRET);
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
        it("should return the User owner of token", () => {
          let body = {
            query: `
                      query  {
                        currentUser {
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
            .set("authorization", `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              const currentUser = res.body.data.currentUser;
              expect(currentUser).to.be.an("object");
              expect(currentUser).to.have.keys(["email", "name"]);
              expect(currentUser.name).to.equal("Ana Paula");
            })
            .catch(error => handleError(error));
        });
      });
    });
  });
  describe("Mutations", () => {
    describe("application/json", () => {
      describe("createUser", () => {
        it("should create new user", () => {
          let body = {
            query: `
              mutation createNewUser($input: UserCreateInput!) {
                createUser(input: $input) {
                  id
                  name
                  email
                }
              }
            `,
            variables: {
              input: {
                name: "Drax",
                email: "drax@guardians.com",
                password: "1234"
              }
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              const createdUser = res.body.data.createUser;
              expect(createdUser).to.be.an("object");
              expect(createdUser.name).to.equal("Drax");
              expect(createdUser.email).to.equal("drax@guardians.com");
              expect(parseInt(createdUser.id)).to.be.a("number");
            })
            .catch(error => handleError(error));
        });
      });
      describe("updateUser", () => {
        it("should update a user", () => {
          let body = {
            query: `
              mutation updateUser($input: UserUpdateInput!) {
                updateUser(input: $input) {
                  id
                  name
                  email
                  photo
                }
              }
            `,
            variables: {
              input: {
                name: "Josefino",
                email: "josefino@guardians.com",
                photo: "https://photo.com"
              }
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .set("authorization", `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              const updatedUser = res.body.data.updateUser;
              expect(updatedUser).to.be.an("object");
              expect(updatedUser.name).to.equal("Josefino");
              expect(updatedUser.email).to.equal("josefino@guardians.com");
              expect(updatedUser.photo).to.be.not.null;
              expect(parseInt(updatedUser.id)).to.be.a("number");
            })
            .catch(error => handleError(error));
        });
        it("should block operation if token is invalid", () => {
          let body = {
            query: `
              mutation updateUserExistingUser($input: UserUpdateInput!) {
                updateUser(input: $input) {
                  id
                  name
                  email
                  photo
                }
              }
            `,
            variables: {
              input: {
                name: "Josefino",
                email: "josefino@guardians.com",
                photo: "https://photo.com"
              }
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .set("authorization", `Bearer INVALID_TOKEN`)
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.data.updateUser).to.be.null;
              expect(res.body).to.have.keys(["data", "errors"]);
              expect(res.body.errors).to.be.an("array");
              expect(res.body.errors[0].message).to.equal(
                "JsonWebTokenError: jwt malformed"
              );
            })
            .catch(error => handleError(error));
        });
      });
      describe("updateUserPassword", () => {
        it("should update password of an existing User", () => {
          let body = {
            query: `
              mutation updateUserPassword($input: UserUpdatePasswordInput!) {
                updateUserPassword(input: $input) 
              }
            `,
            variables: {
              input: {
                password: "123456"
              }
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .set("authorization", `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.data.updateUserPassword).to.be.true;
            })
            .catch(error => handleError(error));
        });
      });
      describe("deleteUser", () => {
        it("should delete an existing User", () => {
          let body = {
            query: `
              mutation {
                deleteUser
              }
            `
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .set("authorization", `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.data.deleteUser).to.be.true;
            })
            .catch(error => handleError(error));
        });
        it("should block operation if token not provided", () => {
          let body = {
            query: `
              mutation {
                deleteUser
              }
            `
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.errors[0].message).to.equal(
                "Unauthorized Token  not provided"
              );
            })
            .catch(error => handleError(error));
        });
      });
    });
  });
});
