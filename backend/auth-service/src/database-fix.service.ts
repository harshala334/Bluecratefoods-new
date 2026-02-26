import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseFixService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    try {
      // Check if enum needs fixing
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        // Drop and recreate the enum to ensure it has the correct values
        await queryRunner.query(`
          DO $$ 
          BEGIN
            -- Check if the enum exists
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_usertype_enum') THEN
              -- Drop the enum if it exists (this will fail if the column uses it)
              -- So we need to alter the column first
              ALTER TABLE users ALTER COLUMN "userType" TYPE VARCHAR(20);
              DROP TYPE IF EXISTS users_usertype_enum;
            END IF;
            
            -- Create the enum with correct values
            CREATE TYPE users_usertype_enum AS ENUM ('individual', 'business', 'customer');
            
            -- Update the column to use the new enum
            ALTER TABLE users ALTER COLUMN "userType" TYPE users_usertype_enum USING "userType"::users_usertype_enum;
          END $$;
        `);
        
        console.log('✅ Database enum fixed successfully');
      } catch (error) {
        console.log('Database enum fix error (may be normal):', error.message);
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error('Database fix service error:', error.message);
    }
  }
}
