import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.entity';

@Controller('recipes')
export class RecipesController {
    constructor(private readonly recipesService: RecipesService) { }

    @Get()
    findAll(@Query() query: any): Promise<Recipe[]> {
        return this.recipesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Recipe> {
        return this.recipesService.findOne(+id);
    }

    // TODO: Add AuthGuard once we confirm how auth is handled (likely via gateway or guard)
    // For now leaving open or assuming global guard handles it if configured
    @Post()
    create(@Body() createRecipeDto: any, @Request() req) {
        let user = { id: '1', name: 'BlueCrate User' }; // Default fallback

        // Extract user from token if available
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
                const token = authHeader.split(' ')[1];
                const payloadBase64 = token.split('.')[1];
                const cleanBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
                const decodedJson = Buffer.from(cleanBase64, 'base64').toString();
                const payload = JSON.parse(decodedJson);

                if (payload.sub || payload.id) {
                    user = {
                        id: payload.sub || payload.id,
                        name: payload.name || 'BlueCrate User'
                    };
                    console.log('Decoded User:', user);
                }
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }

        return this.recipesService.create(createRecipeDto, user);
    }

    @Post('seed')
    async seed() {
        await this.recipesService.seed();
        return { message: 'Seeding triggered' };
    }

    @Get('admin/pending')
    async getPending(): Promise<Recipe[]> {
        return this.recipesService.getPending();
    }

    @Get('admin/all')
    async getAllAdmin(): Promise<Recipe[]> {
        return this.recipesService.getAllAdmin();
    }

    @Patch('admin/:id/approve')
    async approve(@Param('id') id: string): Promise<Recipe> {
        return this.recipesService.approve(+id);
    }

    @Patch('admin/:id/reject')
    async reject(@Param('id') id: string): Promise<Recipe> {
        return this.recipesService.reject(+id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.recipesService.remove(+id);
    }

    @Patch('admin/reject-by-author/:authorId')
    async rejectByAuthor(@Param('authorId') authorId: string): Promise<void> {
        return this.recipesService.rejectByAuthor(authorId);
    }
}
