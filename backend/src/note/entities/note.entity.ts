import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

//in postgresql do not put schema
@Entity({ name: 'notes' })
export class Note {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 30 })
  title: string;

  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // i put nullable this to keep note when user deleted
  @Column('int', { name: 'author_id', nullable: true })
  authorId: number | null;

  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: User;
}
