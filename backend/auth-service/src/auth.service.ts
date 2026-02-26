import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SignupDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private firebaseService: FirebaseService,
  ) { }

  async onModuleInit() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const adminEmail = 'admin@gmail.com';
    let admin = await this.userRepository.findOne({ where: { email: adminEmail } });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
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
    } else if (admin.userType !== 'admin') {
      admin.userType = 'admin';
      admin.isVerifiedCreator = true;
      admin.creatorStatus = 'verified';
      await this.userRepository.save(admin);
      console.log('Admin user role updated to admin');
    } else {
      console.log('Admin user already exists with correct role');
    }
  }

  async signup(signupDto: SignupDto) {
    const { name, email, password, userType } = signupDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      userType,
    });

    await this.userRepository.save(user);

    // Generate JWT token
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
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email (don't strictly require userType in where clause)
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
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
      },
    };
  }

  async updateProfile(userId: string, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Update allowed fields
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
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

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
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'default-secret-key', {
      expiresIn: '7d',
    });
  }

  async sendOtp(phone: string) {
    // With real services, sending OTP is handled by the frontend calling Firebase.
    // This backend method might still be useful for logging or tracking.
    console.log(`Real OTP flow: Frontend handles sending OTP to ${phone}`);
    return { success: true, message: 'OTP flow initiated' };
  }

  async verifyOtp(phone: string, idToken: string) {
    try {
      // Real Firebase verification
      const phoneFromToken = await this.firebaseService.verifyPhoneNumber(idToken);

      // Ensure phone from token matches what was sent (optional security check)
      // Note: Firebase phone numbers are formatted with +, e.g. +91...

      // Find or create user
      let user = await this.userRepository.findOne({ where: { email: `${phoneFromToken}@otp.com` } });
      if (!user) {
        user = this.userRepository.create({
          name: `User ${phoneFromToken.slice(-4)}`,
          email: `${phoneFromToken}@otp.com`,
          password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
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
        },
      };
    } catch (error) {
      console.error('Firebase OTP Verification failed:', error);
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }

  async googleLogin(googleIdToken: string) {
    try {
      // Real Firebase verification
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
        },
      };
    } catch (error) {
      console.error('Firebase Google Login failed:', error);
      throw new UnauthorizedException('Invalid Google ID Token');
    }
  }
}
