import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ArticleService } from "./artical.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateArticleDto } from "./dto/create-article.dto";

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateArticleDto, @Req() req) {
    const fakeAdminId ="d789410a-8139-4ae7-be48-a02d2bc8836f"
    return this.articleService.create(dto, fakeAdminId);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }
}