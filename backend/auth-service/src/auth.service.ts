import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignupDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { FirebaseService } from './firebase.service';
import { SmsService } from './sms.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private firebaseService: FirebaseService,
    private smsService: SmsService,
  ) { }

  async onModuleInit() {
    await this.seedAdmin();
    await this.seedVendor();
  }

  async seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn('⚠️ Skipping Admin Seeding: ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables');
      return;
    }

    let admin = await this.userRepository.findOne({ where: { email: adminEmail } });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (!admin) {
      admin = this.userRepository.create({
        name: 'admin',
        email: adminEmail,
        password: hashedPassword,
        userType: 'admin',
        isVerifiedCreator: true,
        creatorStatus: 'verified',
      });
      await this.userRepository.save(admin);
      console.log('Admin user created successfully');
    } else {
      admin.password = hashedPassword;
      admin.userType = 'admin';
      admin.isVerifiedCreator = true;
      admin.creatorStatus = 'verified';
      await this.userRepository.save(admin);
      console.log('Admin user credentials reset/updated successfully');
    }
  }
  
  async seedVendor() {
    const vendorEmail = 'vendor@bluecrate.com';
    const vendorPassword = process.env.VENDOR_PASSWORD || 'vendorpass123';
    
    let vendor = await this.userRepository.findOne({ where: { email: vendorEmail } });
    const hashedPassword = await bcrypt.hash(vendorPassword, 10);
    
    if (!vendor) {
      vendor = this.userRepository.create({
        name: 'Packaging Vendor',
        email: vendorEmail,
        password: hashedPassword,
        userType: 'vendor',
        vendorCategory: 'packaging'
      });
      await this.userRepository.save(vendor);
      console.log('Vendor user created successfully');
    } else {
      vendor.password = hashedPassword;
      vendor.userType = 'vendor';
      vendor.vendorCategory = 'packaging';
      await this.userRepository.save(vendor);
      console.log('Vendor user updated successfully');
    }
  }

  async signup(signupDto: SignupDto) {
    const { name, email, password, userType } = signupDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      userType,
    });
    await this.userRepository.save(user);
    const token = this.generateToken(user);
    return {
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        bio: user.bio,
        profileImage: user.profileImage,
        backgroundImage: user.backgroundImage,
        isVerifiedCreator: user.isVerifiedCreator,
        creatorStatus: user.creatorStatus,
        vendorCategory: user.vendorCategory,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.generateToken(user);
    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        bio: user.bio,
        profileImage: user.profileImage,
        backgroundImage: user.backgroundImage,
        isVerifiedCreator: user.isVerifiedCreator,
        creatorStatus: user.creatorStatus,
        vendorCategory: user.vendorCategory,
      },
    };
  }

  async updateProfile(userId: string, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (updateData.name) user.name = updateData.name;
    if (updateData.bio) user.bio = updateData.bio;
    if (updateData.profileImage) user.profileImage = updateData.profileImage;
    if (updateData.backgroundImage) user.backgroundImage = updateData.backgroundImage;
    await this.userRepository.save(user);
    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        bio: user.bio,
        profileImage: user.profileImage,
        backgroundImage: user.backgroundImage,
        isVerifiedCreator: user.isVerifiedCreator,
        creatorStatus: user.creatorStatus,
        vendorCategory: user.vendorCategory,
      },
    };
  }

  async getProfile(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
      const userId = decoded.sub;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new UnauthorizedException('User not found');
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        bio: user.bio,
        profileImage: user.profileImage,
        backgroundImage: user.backgroundImage,
        isVerifiedCreator: user.isVerifiedCreator,
        creatorStatus: user.creatorStatus,
        vendorCategory: user.vendorCategory,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async applyCreator(userId: string, reason?: string, socialLinks?: string[]) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    user.creatorStatus = 'pending';
    if (reason) user.creatorApplicationReason = reason;
    if (socialLinks) user.creatorSocialLinks = socialLinks;
    await this.userRepository.save(user);
    return { success: true, message: 'Application submitted' };
  }

  async getPendingCreators() {
    return this.userRepository.find({ where: { creatorStatus: 'pending' } });
  }

  async approveCreator(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    user.creatorStatus = 'verified';
    user.isVerifiedCreator = true;
    await this.userRepository.save(user);
    return { success: true, message: 'User verified as creator' };
  }

  async rejectCreator(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    user.creatorStatus = 'rejected';
    user.isVerifiedCreator = false;
    await this.userRepository.save(user);
    return { success: true, message: 'Application rejected' };
  }

  async getVerifiedCreators() {
    return this.userRepository.find({
      where: { creatorStatus: 'verified' },
      order: { id: 'DESC' }
    });
  }

  async revokeCreator(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    user.creatorStatus = 'none';
    user.isVerifiedCreator = false;
    await this.userRepository.save(user);
    return { success: true, message: 'Creator status revoked' };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      vendorCategory: user.vendorCategory,
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'default-secret-key', {
      expiresIn: '7d',
    });
  }

  async sendOtp(phone: string) {
    const success = await this.smsService.sendOtp(phone);
    if (success) {
      return { success: true, message: 'OTP sent successfully' };
    } else {
      throw new UnauthorizedException('Failed to send OTP. Please try again later.');
    }
  }

  async verifyOtp(phone: string, code: string) {
    const verified = await this.smsService.verifyOtp(phone, code);
    
    if (!verified) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    try {
      const email = `${phone}@otp.com`;
      let user = await this.userRepository.findOne({ where: { email } });
      
      if (!user) {
        user = this.userRepository.create({
          name: `User ${phone.slice(-4)}`,
          email: email,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          userType: 'customer',
        });
        await this.userRepository.save(user);
      }

      const token = this.generateToken(user);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          isVerifiedCreator: user.isVerifiedCreator,
          creatorStatus: user.creatorStatus,
          vendorCategory: user.vendorCategory,
        },
      };
    } catch (error) {
      console.error('OTP User Login failed:', error);
      throw new UnauthorizedException('Internal error during OTP login');
    }
  }

  async googleLogin(googleIdToken: string) {
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(googleIdToken);
      const email = decodedToken.email;
      const name = decodedToken.name || 'Google User';
      let user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        user = this.userRepository.create({
          name,
          email,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          userType: 'customer',
          profileImage: decodedToken.picture,
        });
        await this.userRepository.save(user);
      }
      const token = this.generateToken(user);
      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          isVerifiedCreator: user.isVerifiedCreator,
          creatorStatus: user.creatorStatus,
          vendorCategory: user.vendorCategory,
        },
      };
    } catch (error) {
      console.error('Firebase Google Login failed:', error);
      throw new UnauthorizedException('Invalid Google ID Token');
    }
  }
}
