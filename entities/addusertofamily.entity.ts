import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entities';

export enum Status {
  Pending = 'Pending',
  accepted = 'accepted',
  rejected = 'rejected',
}

@Entity()
export class AddUserToFamily {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: Status, default: 'Pending', nullable: true })
  status: Status;

  @ManyToOne(() => User, (User) => User.AddUserToFamily)
  User: User;
}
