import { User } from 'src/user/entities/user.entity';
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

@Entity({ name: 'matches' })
export class Match {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { array: true, default: [], name: 'score' })
  score: number[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('int', { nullable: true, name: 'winner_id' })
  winnerId: number | null;

  @Column('int', { nullable: true, name: 'loser_id' })
  loserId: number | null;

  @ManyToOne(() => User, (user) => user.matchesAsWinner, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'winner_id', referencedColumnName: 'id' })
  winner: User;

  @ManyToOne(() => User, (user) => user.matchesAsLoser, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'loser_id', referencedColumnName: 'id' })
  loser: User;
}
