import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';

@Injectable()
export class RecipesService implements OnModuleInit {
    constructor(
        @InjectRepository(Recipe)
        private recipesRepository: Repository<Recipe>,
    ) { }

    async onModuleInit() {
        await this.seed();
    }

    async findAll(query?: any): Promise<Recipe[]> {
        const qb = this.recipesRepository.createQueryBuilder('recipe');

        // By default, only show approved recipes
        // If authorId is provided, allow seeing their own pending recipes
        if (query?.authorId) {
            qb.where('recipe.authorId = :authorId', { authorId: query.authorId });
        } else {
            qb.where('recipe.isApproved = :isApproved', { isApproved: true });
        }

        if (query?.search) {
            const searchLower = `%${query.search.toLowerCase()}%`;
            qb.andWhere('(LOWER(recipe.name) LIKE :search OR EXISTS (SELECT 1 FROM jsonb_array_elements_text(recipe.tags) AS t WHERE LOWER(t) LIKE :search))', { search: searchLower });
        }

        return qb.orderBy('recipe.createdAt', 'DESC').getMany();
    }

    async findOne(id: number): Promise<Recipe> {
        return this.recipesRepository.findOne({ where: { id } });
    }

    async create(createRecipeDto: any, user?: any): Promise<Recipe> {
        return this.recipesRepository.save({
            ...createRecipeDto,
            authorName: user?.name || 'BlueCrate User',
            authorId: user?.id,
            rating: 0,
            reviews: 0,
            isPublic: true,
            status: 'pending',
            isApproved: false,
        });
    }

    async getPending(): Promise<Recipe[]> {
        return this.recipesRepository.find({
            where: { status: 'pending' },
            order: { id: 'DESC' }
        });
    }

    async getAllAdmin(): Promise<Recipe[]> {
        return this.recipesRepository.find({
            order: { id: 'DESC' }
        });
    }

    async approve(id: number): Promise<Recipe> {
        const recipe = await this.recipesRepository.findOne({ where: { id } });
        if (recipe) {
            recipe.status = 'approved';
            recipe.isApproved = true;
            return this.recipesRepository.save(recipe);
        }
    }

    async reject(id: number): Promise<Recipe> {
        const recipe = await this.recipesRepository.findOne({ where: { id } });
        if (recipe) {
            recipe.status = 'rejected';
            recipe.isApproved = false;
            return this.recipesRepository.save(recipe);
        }
    }

    async remove(id: number): Promise<void> {
        await this.recipesRepository.delete(id);
    }

    async rejectByAuthor(authorId: string): Promise<void> {
        await this.recipesRepository.update({ authorId }, {
            status: 'rejected',
            isApproved: false
        });
    }

    async seed() {
        const initialRecipes: Partial<Recipe>[] = [
            {
                name: 'Avocado Toast Supreme',
                image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800',
                time: '5 min',
                difficulty: 'Easy',
                servings: 2,
                rating: 4.8,
                reviews: 124,
                description: 'Crispy sourdough bread topped with creamy avocado, poached eggs, and a sprinkle of chili flakes. The perfect breakfast or brunch.',
                category: '10min',
                basePrice: 12.50,
                tags: ['breakfast', 'healthy', 'quick', 'avocado'],
                ingredients: [
                    { id: 1, name: 'Sourdough Bread', amount: 2, unit: 'slices', price: 1.50, category: 'Bakery', isMandatory: true },
                    { id: 2, name: 'Avocado', amount: 1, unit: 'pc', price: 2.00, category: 'Produce', isMandatory: true },
                    { id: 3, name: 'Eggs', amount: 2, unit: 'pcs', price: 1.00, category: 'Dairy' },
                    { id: 4, name: 'Chili Flakes', amount: 1, unit: 'g', price: 0.20, category: 'Spices' }
                ],
                steps: [
                    { id: 1, title: 'Toast Bread', description: 'Toast the sourdough slices until golden brown.', time: 2 },
                    { id: 2, title: 'Mash Avocado', description: 'Mash the avocado with salt, pepper, and lime juice.', time: 2 },
                    { id: 3, title: 'Assemble', description: 'Spread avocado on toast and top with poached eggs.', time: 1 }
                ],
                nutrition: { calories: 350, protein: 12, carbs: 25, fat: 18 },
                authorName: 'BlueCrate Chef',
                status: 'approved',
                isApproved: true
            },
            {
                name: 'Spicy Chicken Wings',
                image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800',
                time: '45 min',
                difficulty: 'Medium',
                servings: 4,
                rating: 4.9,
                reviews: 85,
                description: 'Super crispy and fiery chicken wings tossed in a secret spicy sauce. Not for the faint of heart!',
                category: '20minPlus',
                basePrice: 18.00,
                tags: ['spicy', 'chicken', 'snack', 'party'],
                ingredients: [
                    { id: 1, name: 'Chicken Wings', amount: 1000, unit: 'g', price: 8.00, category: 'Poultry', isMandatory: true },
                    { id: 2, name: 'Hot Sauce', amount: 100, unit: 'ml', price: 2.50, category: 'Pantry', isMandatory: true },
                    { id: 3, name: 'Butter', amount: 50, unit: 'g', price: 1.00, category: 'Dairy' }
                ],
                steps: [
                    { id: 1, title: 'Bake Wings', description: 'Bake the wings until crispy.', time: 35 },
                    { id: 2, title: 'Toss in Sauce', description: 'Melt butter, mix with hot sauce, and toss the wings.', time: 5 }
                ],
                nutrition: { calories: 650, protein: 45, carbs: 5, fat: 48 },
                authorName: 'BlueCrate Chef',
                status: 'approved',
                isApproved: true
            }
        ];

        for (const recipeData of initialRecipes) {
            const existing = await this.recipesRepository.findOne({ where: { name: recipeData.name } });
            if (existing) {
                // Update tags and approval status for existing seed recipes
                await this.recipesRepository.update(existing.id, {
                    tags: recipeData.tags,
                    status: 'approved',
                    isApproved: true
                });
            } else {
                await this.recipesRepository.save(recipeData);
            }
        }
    }
}
