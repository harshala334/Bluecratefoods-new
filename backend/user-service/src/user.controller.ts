import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'user-service' };
  }

  @Get()
  getUsers() {
    // Placeholder - replace with real logic
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    // Placeholder - replace with real logic
    return { id: parseInt(id), name: 'User ' + id, email: `user${id}@example.com` };
  }

  @Post()
  createUser(@Body() userData: any) {
    // Placeholder - replace with real logic
    return { 
      id: Date.now(), 
      ...userData, 
      createdAt: new Date().toISOString() 
    };
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() userData: any) {
    // Placeholder - replace with real logic
    return { 
      id: parseInt(id), 
      ...userData, 
      updatedAt: new Date().toISOString() 
    };
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    // Placeholder - replace with real logic
    return { message: `User with id ${id} has been deleted` };
  }
}