import * as DataLoader from "dataloader";

import { UserInstance } from "../models/UserModel";
import { PostInstance } from "../models/PostModel";
import { DataLoaderParam } from "./DataLoaderParamInterface";

export interface DataLoaders {
  //Ele vai fazer o Loader pelo ID que é do tipo number
  //Vai retornar um UserInstance
  userLoader: DataLoader<DataLoaderParam<number>, UserInstance>;
  postLoader: DataLoader<DataLoaderParam<number>, PostInstance>;
}
