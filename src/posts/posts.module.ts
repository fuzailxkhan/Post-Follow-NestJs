import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from './entities/post.entity'
import { Follow } from 'src/follow/entities/follow.entity';

@Module({

  imports: [TypeOrmModule.forFeature([Post,Follow])],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
