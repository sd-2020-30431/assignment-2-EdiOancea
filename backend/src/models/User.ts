import { Model, DataTypes } from 'sequelize';

import sequelize from '../connection/Connection';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
};

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(128),
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING(128),
  }
}, {
  tableName: 'users',
  sequelize: sequelize,
});

export default User;