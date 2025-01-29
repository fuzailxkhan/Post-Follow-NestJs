import { Controller, Post, Get,Query, Body, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
    console.log("User From Request:" , req.user)
    return this.postsService.createPost(createPostDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getUserPosts(@Req() req) {
    return this.postsService.getUserPosts(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('newsfeed')
  getNewsfeed(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postsService.getNewsfeed(req.user, Number(page), Number(limit));
  }
}
