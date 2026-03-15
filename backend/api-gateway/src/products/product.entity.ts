import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column()
    image: string;

    @Column()
    category: string;

    @Column('float')
    basePrice: number;

    @Column('float', { default: 0 })
    rating: number;

    @Column('int', { default: 0 })
    reviews: number;

    @Column()
    time: string;

    @Column()
    difficulty: string;

    @Column('int')
    servings: number;

    @Column('jsonb')
    ingredients: any[];

    @Column('jsonb')
    steps: any[];

    @Column('jsonb')
    nutrition: any;

    @Column('jsonb', { nullable: true })
    utensils: any[];

    @Column('jsonb', { nullable: true })
    userReviews: any[];

    @Column('jsonb', { nullable: true })
    bulkTiers: any[];

    @Column('jsonb', { nullable: true })
    tags: string[];

    @Column('int', { default: 0 })
    spiceLevel: number;

    @Column({ nullable: true })
    unit: string;

    @Column('float', { nullable: true })
    mrp: number;

    @Column({ nullable: true })
    weight: string;

    @Column({ nullable: true })
    authorName: string;

    @Column({ nullable: true })
    authorId: string;

    @Column({ nullable: true })
    videoUrl: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    })
    status: string;

    @Column({ default: false })
    isApproved: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
