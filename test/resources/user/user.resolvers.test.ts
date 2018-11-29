import { chai, app, db, expect, handleError } from "./../../test-utils";

describe("User", () => {
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
          ]);
        })
      )
    );
  });
  describe("Queries", () => {
    describe("application/json", () => {
      describe("user", () => {
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
              expect(userList).to.be.an("array");
              expect(userList[0]).to.not.have.keys(["id", "photo"]);
              expect(userList[0]).to.have.keys(["name", "email", "createdAt"]);
            })
            .catch(error => handleError(error));
        });
      });
    });
  });
});
