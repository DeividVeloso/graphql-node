"use strict";
exports.__esModule = true;
exports["default"] = function (sequelize, DataTypes) {
    var Comment = sequelize.define("Comment", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, { tableName: "comments" });
    Comment.associate = function (models) {
        Comment.belongsTo(models.Post, {
            foreignKey: {
                allowNull: false,
                field: "post",
                name: "post"
            }
        });
        Comment.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: "user",
                name: "user"
            }
        });
    };
    return Comment;
};
