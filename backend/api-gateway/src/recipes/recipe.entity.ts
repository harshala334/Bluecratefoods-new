import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column()
    time: string;

    @Column()
    difficulty: string;

    @Column('int')
    servings: number;

    @Column('float', { default: 0 })
    rating: number;

    @Column('int', { default: 0 })
    reviews: number;

    @Column('text')
    description: string;

    @Column()
    category: string;

    @Column('float')
    basePrice: number;

    @Column('jsonb')
    ingredients: any[];

    @Column('jsonb')
    steps: any[];

    @Column('jsonb')
    nutrition: any;

    @Column('jsonb', { nullable: true })
    utensils: any[];

    // Optional: Link to user who created it
    @Column({ nullable: true })
    authorName: string;

    @Column({ nullable: true })
    authorId: string;

    @Column({ default: true })
    isPublic: boolean;

    @Column('jsonb', { nullable: true, default: [] })
    tags: string[];

    @Column('jsonb', { nullable: true, default: [] })
    searchKeywords: string[];

    @Column({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    })
    status: string;

    @Column({ default: false })
    isApproved: boolean;

    @Column({ nullable: true })
    videoUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
