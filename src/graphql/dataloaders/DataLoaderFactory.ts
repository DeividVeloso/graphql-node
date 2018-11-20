import { DbConnection } from "../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../models/UserModel";
import { DataLoaders } from "../../interfaces/DataLoadersInterface";
import { UserLoader } from "./UserLoader";
import * as DataLoader from "dataloader";
import { PostInstance } from "../../models/PostModel";
import { PostLoader } from "./PostLoader";

export class DataLoaderFactory {
  constructor(private db: DbConnection) {}
  getLoaders(): DataLoaders {
    return {
      userLoader: new DataLoader<number, UserInstance>((ids: number[]) =>
        UserLoader.batchUser(this.db.User, ids)
      ),
      postLoader: new DataLoader<number, PostInstance>((ids: number[]) =>
        PostLoader.batchPost(this.db.Post, ids)
      )
    };
  }
}
