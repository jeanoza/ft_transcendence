import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class User {
  id: number;
  name?: string;
  email?: string;
}

//@Entity({ schema: 'boilerplate', name: 'users' })
//export class User {
//  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
//  id: number;

//  @Column('varchar', { name: 'firstname', unique: true, length: 30 })
//  firstName: string;

//  @Column('varchar', { name: 'lastname', unique: true, length: 30 })
//  lastName: string;

//  @Column('varchar', { name: 'email', unique: true, length: 30 })
//  email: string;

//  @Column('varchar', { name: 'password', length: 100, select: false })
//  password: string;

//  @CreateDateColumn()
//  createdAt: Date;

//  @UpdateDateColumn()
//  updatedAt: Date;

//  @DeleteDateColumn()
//  deletedAt: Date;
//}
