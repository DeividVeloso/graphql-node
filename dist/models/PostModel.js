"use strict";
exports.__esModule = true;
exports["default"] = function (sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        photo: {
            type: DataTypes.BLOB({ length: "long" }),
            allowNull: false
        }
    }, {
        tableName: "posts"
    });
    Post.associate = function (models) {
        Post.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: "author",
                name: "author"
            }
        });
    };
    return Post;
};
