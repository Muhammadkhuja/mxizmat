import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IUstaCreatorAttr {
  user_id: number | undefined;
  name: string | undefined;
  phone_number: string | undefined;
  category_id: number | undefined;
  last_state: string | undefined;
}

@Table({ tableName: "usta" })
export class Usta extends Model<Usta, IUstaCreatorAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.BIGINT,
  })
  declare user_id: number;

  @Column({ type: DataType.STRING() })
  declare name: string;

  @Column({ type: DataType.STRING() })
  declare phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  declare workshop_name?: string;

  @Column({
    type: DataType.STRING,
  })
  declare address?: string;

  @Column({
    type: DataType.STRING,
  })
  declare landmark?: string;

  @Column({ type: DataType.STRING() })
  declare location: string;

  @Column({ type: DataType.STRING() })
  declare start_at: string;

  @Column({ type: DataType.STRING() })
  declare end_at: string;

  @Column({
    type: DataType.INTEGER(),
  })
  declare time: number;

  @Column({
    type: DataType.STRING,
  })
  declare last_state: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare category_id: number;
}
