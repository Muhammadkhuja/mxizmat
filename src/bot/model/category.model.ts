import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ICategoryCreatorAttr {
  user_id: number;
  name: string;

}

@Table({ tableName: "category" })
export class Category extends Model<Category, ICategoryCreatorAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  declare user_id: number;

  @Column({ type: DataType.STRING(100) })
  declare name: string;

}
