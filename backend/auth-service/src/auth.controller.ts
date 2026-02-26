import { Controller, Get, Post, Body, Patch, Param, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('health')
  health() {
    return { status: 'ok', service: 'auth-service' };
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    return this.authService.getProfile(authHeader);
  }

  @Patch('profile')
  async updateProfile(@Body() body: { userId: string; name?: string; bio?: string; profileImage?: string; backgroundImage?: string }) {
    return this.authService.updateProfile(body.userId, body);
  }

  @Patch('apply-creator')
  async applyCreator(@Body() body: { userId: string; reason?: string; socialLinks?: string[] }) {
    return this.authService.applyCreator(body.userId, body.reason, body.socialLinks);
  }

  @Get('admin/pending-creators')
  async getPendingCreators() {
    return this.authService.getPendingCreators();
  }

  @Patch('admin/approve-creator/:id')
  async approveCreator(@Param('id') userId: string) {
    return this.authService.approveCreator(userId);
  }

  @Patch('admin/reject-creator/:id')
  async rejectCreator(@Param('id') userId: string) {
    return this.authService.rejectCreator(userId);
  }

  @Get('admin/verified-creators')
  async getVerifiedCreators() {
    return this.authService.getVerifiedCreators();
  }

  @Patch('admin/revoke-creator/:id')
  async revokeCreator(@Param('id') userId: string) {
    return this.authService.revokeCreator(userId);
  }

  @Post('send-otp')
  async sendOtp(@Body() body: { phone: string }) {
    return this.authService.sendOtp(body.phone);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { phone: string; code: string }) {
    return this.authService.verifyOtp(body.phone, body.code);
  }

  @Post('google-login')
  async googleLogin(@Body() body: { token: string }) {
    return this.authService.googleLogin(body.token);
  }
}
