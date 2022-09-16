import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async listCategories(): Promise<Category[]> {
    const foundCategories = await this.categoryModel
      .find()
      .populate('players')
      .exec();

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

  async getCategoryFromPlayer(player_id: string): Promise<Category> {
    const foundCategory = await this.categoryModel
      .findOne()
      .where('players')
      .in([player_id])
      .exec();

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

  async updateCategory(
    category_id: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<void> {
    const foundCategory = await this.categoryModel
      .findOne({ id: category_id })
      .exec();

    if (!foundCategory) throw new NotFoundException('Category does not exist');

    await foundCategory.update(updateCategoryDTO).exec();
  }

  async addPlayerToCategory(params: string[]): Promise<void> {
    const category_id = params['category_id'];
    const player_id = params['player_id'];

    const foundCategory = await this.categoryModel
      .findOne({ id: category_id })
      .exec();

    const foundPlayerInTheCategory = await this.categoryModel
      .find({ id: category_id })
      .where('players')
      .in(player_id)
      .exec();

    if (foundPlayerInTheCategory.length > 0)
      throw new BadRequestException('Player already exists in category');

    const foundPlayer = await this.playersService.getPlayerById(player_id);

    if (!foundPlayer) throw new NotFoundException('Player does not exist');

    if (!foundCategory) throw new NotFoundException('Category does not exist');

    foundCategory.players.push(player_id);

    await foundCategory.save();
  }
}
