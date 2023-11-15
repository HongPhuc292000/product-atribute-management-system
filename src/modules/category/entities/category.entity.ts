import { Expose } from 'class-transformer';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, ManyToOne, OneToMany, Entity, JoinColumn } from 'typeorm';

@Entity()
export class Category extends CustomBaseEntity {
  @Expose()
  @Column({ length: 30, nullable: false })
  name: string;

  @OneToMany(() => Category, (category) => category.parent)
  childs: Category[];

  @Expose()
  @ManyToOne(() => Category, (category) => category.childs)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;
}
