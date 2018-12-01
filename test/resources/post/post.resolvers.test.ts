import { chai, db, app, expect, handleError } from "../../test-utils";
import { JWT_SECRET } from "../../../src/utils/handlersServer";
import { UserInstance } from "../../../src/models/UserModel";

import * as jwt from "jsonwebtoken";
import { PostInstance } from "../../../src/models/PostModel";

describe("Post", () => {
  let userId: number;
  let postId: number;
  let token: string;

  beforeEach(() => {
    return db.Comment.destroy({ where: {} }).then((rows: number) =>
      db.Post.destroy({ where: {} }).then((rows: number) =>
        db.User.destroy({ where: {} }).then(() => {
          return db.User.create({
            name: "Champs",
            email: "champs@gmail.com",
            password: "1234"
          })
            .then((user: UserInstance) => {
              userId = user.get("id");
              token = jwt.sign({ sub: userId }, JWT_SECRET);
              return db.Post.bulkCreate([
                {
                  title: "First post",
                  content: "First post",
                  author: userId,
                  photo: "some_photo"
                },
                {
                  title: "Second post",
                  content: "Second post",
                  author: userId,
                  photo: "some_photo"
                },
                {
                  title: "Third post",
                  content: "Third post",
                  author: userId,
                  photo: "some_photo"
                }
              ]);
            })
            .then((posts: PostInstance[]) => {
              postId = posts[0].get("id");
            });
        })
      )
    );
  });
  describe("Queries", () => {
    describe("application/json", () => {
      describe("posts", () => {
        it("should return a list of Posts", () => {
          let body = {
            query: `
                query {
                    posts {
                        title
                        content
                        photo
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
              const postsList = res.body.data.posts;
              expect(res.body.data).to.be.an("object");
              expect(postsList).to.be.an("array");
              expect(postsList[0]).to.not.have.keys([
                "id",
                "photo",
                "createAt"
              ]);
              expect(postsList[0]).to.have.keys(["title", "content", "photo"]);
              expect(postsList[0].title).to.be.equal("First post");
            })
            .catch(error => handleError(error));
        });
      });
      describe("post", () => {
        it("should return a single Post with author", () => {
          let body = {
            query: `
                query {
                    getSinglePost($id: ID!) {
                        post(id: $id) {
                            title
                            author {
                                id
                                name
                                email
                            }
                            comments {
                                comment
                            }
                        }
                    }
                }
            `,
            variables: {
              id: postId
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .send(JSON.stringify(body))
            .then(res => {
              const post = res.body.data.post;
              expect(res.body.data).to.be.an("object");
              expect(post).to.be.an("array");
              expect(post).to.not.have.keys(["id", "photo", "createAt"]);
              expect(post).to.have.keys(["title", "content", "author"]);
              expect(post.title).to.be.equal("First post");
              expect(post.author.name).to.be.equal("Champs");
            })
            .catch(error => handleError(error));
        });
      });
    });
  });
});
