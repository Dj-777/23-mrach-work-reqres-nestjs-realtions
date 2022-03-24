import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AddUserToFamily } from './addusertofamily.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => AddUserToFamily, (AddUserToFamily) => AddUserToFamily.User)
  AddUserToFamily: AddUserToFamily[];
}
