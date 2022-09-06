import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('')
  async index(): Promise<Category[]> {
    return this.categoriesService.listCategories();
  }

  @Get(':category_id')
  async show(@Param('category_id') id: string): Promise<Category> {
    return this.categoriesService.getById(id);
  }

  @Post('')
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDTO);
  }
}
