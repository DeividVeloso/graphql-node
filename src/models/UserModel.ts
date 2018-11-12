import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";

export interface UserAttributes {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  photo?: string;
  createAt?: string;
  updateAt?: string;
}

//Definindo a interface de Instancia, para poder chamar métodos do Sequelize, find, save etc
export interface UserInstance
  extends Sequelize.Instance<UserAttributes>,
    UserAttributes {
  isPassword(encodedPassword: string, password: string): boolean;
}

export interface UserModel
  extends BaseModelInterface,
    Sequelize.Model<UserInstance, UserAttributes> {}

//Sequelize.Sequelize abre a conexao com o banco de dados
//SequelizeDataTypes são os tipos que vamos definir par anossa tabela
//Ele vai retornar uma instancia de UserModel
export default (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes
): UserModel => {
  const User: UserModel = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      photo: {
        type: DataTypes.BLOB({ length: "long" }),
        allowNull: true,
        defaultValue: null
      }
    },
    {
      tableName: "users",
      hooks: {
        beforeCreate: (
          user: UserInstance,
          options: Sequelize.CreateOptions
        ): void => {
          const salt = genSaltSync();
          user.password = hashSync(user.password, salt);
        },
        beforeUpdate: (
          user: UserInstance,
          options: Sequelize.CreateOptions
        ): void => {
          if (user.changed("password")) {
            const salt = genSaltSync();
            user.password = hashSync(user.password, salt);
          }
        }
      }
    }
  );

  User.prototype.isPassword = (
    encodedPassword: string,
    password: string
  ): boolean => {
    return compareSync(password, encodedPassword);
  };
  return User;
};
