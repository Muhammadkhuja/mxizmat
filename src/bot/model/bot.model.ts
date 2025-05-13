import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IBotCreatorAttr {
  user_id: number;
  user_name: string;
  first_name: string;
  last_name: string;
//   phone_number: string;
  lang: string;
}

@Table({ tableName: "bot" })
export class Bot extends Model<Bot, IBotCreatorAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  declare user_id: number;

  @Column({ type: DataType.STRING(100) })
  declare user_name: string;

  @Column({ type: DataType.STRING(50) })
  declare first_name: string;

  @Column({ type: DataType.STRING(50) })
  declare last_name: string;

  @Column({ type: DataType.STRING(15) })
  declare phone_number: string;

  @Column({ type: DataType.STRING(3) })
  declare lang: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare status: boolean;

  @Column({
    type: DataType.STRING(50),
  })
  declare location: string;
}
