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

  // Address Management
  @Get(':id/addresses')
  getUserAddresses(@Param('id') id: string) {
    // Placeholder - in real app fetch from DB
    return [
      {
        id: 'addr-1',
        label: 'Home',
        addressLine1: '123, Green Street',
        addressLine2: 'Blue Crate Apartments',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560038',
        isPrimary: true
      }
    ];
  }

  @Post(':id/addresses')
  addAddress(@Param('id') id: string, @Body() addressData: any) {
    return {
      id: 'addr-' + Date.now(),
      userId: id,
      ...addressData,
      createdAt: new Date().toISOString()
    };
  }

  @Delete(':id/addresses/:addressId')
  removeAddress(@Param('id') id: string, @Param('addressId') addressId: string) {
    return { success: true, message: 'Address removed' };
  }
}