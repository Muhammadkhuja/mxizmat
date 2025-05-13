import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IUserCreatorAttr {
  user_id: number;
  name: string;
  phone: string;
  location: string;
  start_at: string;
  end_at: string;
  time: string;

}

@Table({ tableName: "user" })
export class User extends Model<User, IUserCreatorAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  declare user_id: number;

  @Column({ type: DataType.STRING(100) })
  declare name: string;

  @Column({ type: DataType.STRING(50) })
  declare phone: string;

  @Column({ type: DataType.STRING(50) })
  declare location: string;

  @Column({ type: DataType.STRING(15) })
  declare start_at: string;

  @Column({ type: DataType.STRING(3) })
  declare end_at: string;

  @Column({
    type: DataType.STRING(50),
  })
  declare time: string;
}
