import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(['individual', 'business', 'customer', 'admin'])
  userType: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(['individual', 'business', 'customer', 'admin'])
  userType?: string;
}
