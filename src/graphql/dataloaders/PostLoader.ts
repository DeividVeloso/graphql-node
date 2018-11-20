import { PostInstance, PostModel } from "../../models/PostModel";
import { Promise } from "bluebird";

export class PostLoader {
  static batchPost(Post: PostModel, ids: number[]): Promise<PostInstance[]> {
    return Promise.resolve(
      Post.findAll({
        where: { id: { $in: ids } }
      })
    );
  }
}
