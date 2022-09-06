import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async listCategories(): Promise<Category[]> {
    const foundCategories = await this.categoryModel.find().exec();

    return foundCategories;
  }

  async getById(category_id: string): Promise<Category> {
    const foundCategory = await this.categoryModel
      .findOne({
        _id: category_id,
      })
      .exec();

    if (!foundCategory) throw new NotFoundException('Category does not exist');

    return foundCategory;
  }

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const { category } = createCategoryDTO;

    const foundCategory = await this.categoryModel.findOne({ category }).exec();

    if (foundCategory)
      throw new BadRequestException('Category already existent');

    const categoryCreated = new this.categoryModel(createCategoryDTO);

    return categoryCreated.save();
  }
}
