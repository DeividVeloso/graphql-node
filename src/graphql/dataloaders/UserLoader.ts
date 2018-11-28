import { UserInstance, UserModel } from "../../models/UserModel";
const Promise = require("bluebird");
import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";

export class UserLoader {
  static batchUser(
    User: UserModel,
    params: DataLoaderParam<number>[],
    requestedFields: RequestedFields
  ): Promise<UserInstance[]> {
    let ids: number[] = params.map(param => param.key);

    return Promise.resolve(
      User.findAll({
        where: { id: { $in: ids } },
        attributes: requestedFields.getFields(params[0].info, {
          keep: ["id"],
          exclude: ["posts"]
        })
      })
    );
  }
}
