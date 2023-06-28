import { Module } from '@nestjs/common';
import { UserModule } from '../user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
