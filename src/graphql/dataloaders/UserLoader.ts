import { UserInstance, UserModel } from "../../models/UserModel";
import { Promise } from "bluebird";

export class UserLoader {
  static batchUser(User: UserModel, ids: number[]): Promise<UserInstance[]> {
    return Promise.resolve(
      User.findAll({
        where: { id: { $in: ids } }
      })
    );
  }
}
