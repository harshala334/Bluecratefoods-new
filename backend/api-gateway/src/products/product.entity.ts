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

    @Column({ nullable: true })
    time: string;

    @Column({ nullable: true })
    difficulty: string;

    @Column('int', { nullable: true })
    servings: number;

    @Column('jsonb', { nullable: true })
    ingredients: any[];

    @Column('jsonb', { nullable: true })
    steps: any[];

    @Column('jsonb', { nullable: true })
    nutrition: any;

    @Column('jsonb', { nullable: true })
    utensils: any[];

    @Column('jsonb', { nullable: true })
    userReviews: any[];

    @Column('jsonb', { nullable: true })
    bulkTiers: any[];

    @Column('jsonb', { nullable: true, default: [] })
    tags: string[];

    @Column('jsonb', { nullable: true, default: [] })
    searchKeywords: string[];

    @Column('int', { default: 0 })
    spiceLevel: number;

    @Column({ nullable: true })
    badge: string;

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

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: true })
    inStock: boolean;

    @Column('float', { default: 0 })
    stockQuantity: number;

    @Column('jsonb', { nullable: true, default: [] })
    secondaryCategories: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
