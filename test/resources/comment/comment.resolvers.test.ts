import { CommentInstance } from './../../../src/models/CommentModel';
import { chai, db, app, expect, handleError } from "../../test-utils";
import { JWT_SECRET } from "../../../src/utils/handlersServer";
import { UserInstance } from "../../../src/models/UserModel";
import * as jwt from "jsonwebtoken";
import { PostInstance } from "../../../src/models/PostModel";

describe("Comment", () => {
  let userId: number;
  let postId: number;
  let commentId: number;
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
              return db.Post.create(
                {
                  title: "First post",
                  content: "First post",
                  author: userId,
                  photo: "some_photo"
                },
              );
            })
            .then((post: PostInstance) => {
              postId = post.get("id");
              return db.Comment.bulkCreate([
                {
                  comment: 'First Comment',
                  user: userId,
                  post: postId
                },
                {
                  comment: 'Second Comment',
                  user: userId,
                  post: postId
                },
                {
                  comment: 'Third Comment',
                  user: userId,
                  post: postId
                },
              ]).then((comments: CommentInstance[]) => {
                commentId = comments[0].get("id")
              })
            });
        })
      )
    );
  });
  describe('Queries', () => {
    describe('application/json', () => {
      describe('commentsByPost', () => {
        it('should return a list of Comments', () => {
          let body = {
            query: `
                query getCommentsByPostList($postId: ID!, $first: Int, $offset: Int) {
                       commentsByPost(postId: $postId, first: $first, offset: $offset) {
                          comment 
                          user {
                            id
                          }
                          post {
                            id
                          }
                       }
                    }
                
            `,
            variables: {
              postId: postId,
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
              const commentList = res.body.data.commentsByPost;
              expect(res.body.data).to.be.an("object");
              expect(commentList).to.be.an("array");
              expect(commentList[0]).to.not.have.keys([
                "id",
              ]);
              expect(commentList[0]).to.have.keys(["comment", "user", "post"]);
              expect(commentList[0].comment).to.be.equal("Second Comment");
            })
            .catch(error => handleError(error));
        })
      })
    })
  })
  describe("Mutations",()=>{
    describe("application/json",()=>{
      describe("createComment",()=>{
        it('should create a Comment', () => {
          let body = {
            query: `
                mutation createNewComment($input: CommentInput!) {
                      createComment(input: $input) {
                        id
                        comment
                        user {
                          id
                          name
                        }
                        post {
                          id
                          title
                        }
                      }
                    }
                
            `,
            variables: {
              input: {
                post: postId,
                comment: "Novo Comentário"
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
              const createComment = res.body.data.createComment;
      
              expect(res.body.data).to.be.an("object");
              expect(createComment.user.name).to.be.equal("Champs");
              expect(createComment.post.title).to.be.equal("First post");
              expect(createComment.comment).to.be.equal("Novo Comentário");
            })
            .catch(error => handleError(error));
        })
      })
      describe("updateComment",()=>{
        it('should update a Comment', () => {
          let body = {
            query: `
                mutation updateCommentPost($id: ID!, $input: CommentInput!) {
                      updateComment(id: $id, input: $input) {
                        id
                        comment
                        user {
                          id
                          name
                        }
                        post {
                          id
                          title
                        }
                      }
                    }
                
            `,
            variables: {
              id: commentId,
              input: {
                comment: "Update Comment",
                post: postId
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
              const updateComment = res.body.data.updateComment;
      
              expect(res.body.data).to.be.an("object");
              expect(updateComment.user.name).to.be.equal("Champs");
              expect(updateComment.post.title).to.be.equal("First post");
              expect(updateComment.comment).to.be.equal("Update Comment");
            })
            .catch(error => handleError(error));
        })
      })
      describe("deleteComment",()=>{
        it('should update a Comment', () => {
          let body = {
            query: `
                mutation deleteCommentPost($id: ID!) {
                      deleteComment(id: $id)   
                }
                
            `,
            variables: {
              id: commentId
            }
          };
          return chai
            .request(app)
            .post("/graphql")
            .set("content-type", "application/json")
            .set("authorization", `Bearer ${token}`)
            .send(JSON.stringify(body))
            .then(res => {
              const deleteComment = res.body.data.deleteComment;
      
              expect(res.body.data).to.be.an("object");
              expect(deleteComment).to.be.true
            })
            .catch(error => handleError(error));
        })
      })
    })
  })
});
