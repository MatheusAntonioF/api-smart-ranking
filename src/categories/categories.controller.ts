import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
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

  @Put(':category_id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('category_id') category_id: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<void> {
    await this.categoriesService.updateCategory(category_id, updateCategoryDTO);
  }

  @Post(':category_id/players/:player_id')
  async addPlayerToCategory(@Param() params: string[]): Promise<void> {
    return this.categoriesService.addPlayerToCategory(params);
  }
}
