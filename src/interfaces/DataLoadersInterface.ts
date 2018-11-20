import * as DataLoader from "dataloader";

import { UserInstance } from "../models/UserModel";
import { PostInstance } from "../models/PostModel";

export interface DataLoaders {
  //Ele vai fazer o Loader pelo ID que é do tipo number
  //Vai retorar um UserInstance
  userLoader: DataLoader<number, UserInstance>;
  postLoader: DataLoader<number, PostInstance>;
}
