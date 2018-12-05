import { chai, db, app, expect, handleError } from "../../test-utils";
import { JWT_SECRET } from "../../../src/utils/handlersServer";
import { UserInstance } from "../../../src/models/UserModel";
import * as jwt from "jsonwebtoken";
import { PostInstance } from "../../../src/models/PostModel";

describe("Comment", () => {
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
});
