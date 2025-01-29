import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { FollowModule } from './follow/follow.module';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot(),
     AuthModule,
      UsersModule,
      PostsModule,
      FollowModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
