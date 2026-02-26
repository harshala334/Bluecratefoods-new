import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    default: 'individual'
  })
  userType: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  backgroundImage: string;

  @Column({ default: false })
  isVerifiedCreator: boolean;

  @Column({
    type: 'enum',
    enum: ['none', 'pending', 'verified', 'rejected'],
    default: 'none'
  })
  creatorStatus: string;

  @Column({ nullable: true })
  creatorApplicationReason: string;

  @Column({ type: 'jsonb', default: [] })
  creatorSocialLinks: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
