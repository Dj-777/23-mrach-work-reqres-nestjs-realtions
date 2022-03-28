import { Column, Entity,  PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Family {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: number;

    @Column()
    reciverId: number;
}