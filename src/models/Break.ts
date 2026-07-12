import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface IBreak {
  id: number;
  attendanceId: number;
  userId: number;
  startTime: Date;
  endTime: Date | null;
  durationMinutes: number;
}

interface BreakCreation
  extends Optional<IBreak, "id" | "endTime" | "durationMinutes"> {}

class Break
  extends Model<IBreak, BreakCreation>
  implements IBreak {

  declare id: number;
  declare attendanceId: number;
  declare userId: number;
  declare startTime: Date;
  declare endTime: Date | null;
  declare durationMinutes: number;
}

Break.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    attendanceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    durationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "breaks",
    timestamps: true,
  }
);

export default Break;