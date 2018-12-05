import { chai, db, app, expect, handleError } from "../../test-utils";
import { JWT_SECRET } from "../../../src/utils/handlersServer";
import { UserInstance } from "../../../src/models/UserModel";

import * as jwt from "jsonwebtoken";
import { PostInstance } from "../../../src/models/PostModel";
import { request } from "http";

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
                query getPost($id: ID!) {
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
              expect(post).to.not.have.keys(["id", "photo", "createAt"]);
              expect(post).to.have.keys(["title", "author", "comments"]);
              expect(post.title).to.be.equal("First post");
              expect(post.author.name).to.be.equal("Champs");
            })
            .catch(error => handleError(error));
        });
        it("should return error with post not found", () => {
          let body = {
            query: `
                      query getPost($id: ID!) {
                        post(id: $id) {
                            title
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
              expect(res.body.data.post).to.be.null;
              expect(res.body.errors).to.be.an("array");
              expect(res.body).to.have.keys(["data", "errors"]);
              expect(res.body.errors[0].message).to.equal(
                "Error: Post id -1 not found"
              );
            })
            .catch(error => handleError(error));
        });
      });
    });
  });
  describe("Mutations", () => {
    describe("application/json", () => {
      describe("createPost", () => {
        it("shoulde create a new Post", () => {
          let body = {
            query: `
            mutation createPost($input: PostInput!) {
              createPost(input: $input) {
                  id
                  title
                  content
                  author {
                    name
                  }
                }
            }
            `,
            variables: {
              input: {
                title: "Novo Post do Champs",
                content: "Show essa graphql",
                photo: "http://photo.com"
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
              const createPost = res.body.data.createPost;
              expect(createPost).to.be.an("object");
              expect(createPost.title).to.equal("Novo Post do Champs");
              expect(createPost.content).to.equal("Show essa graphql");
              expect(parseInt(createPost.id)).to.be.a("number");
              expect(createPost.author.name).to.equal("Champs");
            });
        });
      });
      describe("updatePost", () => {
        it("should update a Post", () => {
          let body = {
            query: `
            mutation updatePost($id: ID!, $input: PostInput!) {
              updatePost(id: $id, input: $input) {
                  id
                  title
                  content
                  author {
                    name
                  }
                }
            }
            `,
            variables: {
              id: postId,
              input: {
                title: "Novo Post do Champs",
                content: "Show essa graphql",
                photo: "http://photo.com"
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
              const updatePost = res.body.data.updatePost;
              expect(updatePost).to.be.an("object");
              expect(updatePost.title).to.equal("Novo Post do Champs");
              expect(updatePost.content).to.equal("Show essa graphql");
              expect(parseInt(updatePost.id)).to.be.a("number");
              expect(updatePost.author.name).to.equal("Champs");
            });
        });
      });
      describe("deletePost", () => {
        it("should delete a Post", () => {
          let body = {
            query: `
            mutation deletePost($id: ID!) {
              deletePost(id: $id)
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
            .set("authorization", `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              const deletePost = res.body.data.deletePost;
              expect(deletePost).to.be.true;
            })
            .catch(error => handleError(error));
        });
      });
    });
    describe("application/json", () => {
      describe("posts", () => {
        it("should paginate a list of Posts", () => {
          let query = `
                query getPostsList($first: Int, $offset: Int) {
                    posts(first: $first, offset: $offset) {
                        title
                        content
                        photo
                    }
                }
            `;
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/graphql")
            .send(query)
            .query({
              variables: JSON.stringify({
                first: 2,
                offset: 1
              })
            })
            .then(res => {
              const postsList = res.body.data.posts;
              expect(res.body.data).to.be.an("object");
              expect(postsList)
                .to.be.an("array")
                .with.length(2);
              expect(postsList[0]).to.not.have.keys([
                "id",
                "photo",
                "createAt"
              ]);
              expect(postsList[0]).to.have.keys(["title", "content", "photo"]);
              expect(postsList[0].title).to.be.equal("Second post");
            })
            .catch(error => handleError(error));
        });
      });
    });
  });
});
