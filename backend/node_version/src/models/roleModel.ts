// models/roleModel.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Role extends Model {
    public id!: number;
    public name!: string;
    public permissions!: string[];
}

Role.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Role',
        tableName: 'roles', 
        timestamps: false,
      }
);

export default Role;
