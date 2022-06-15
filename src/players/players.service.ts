import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const playerExists = await this.playerModel.findOne({ email }).exec();

    if (playerExists)
      throw new BadRequestException(`This email already being used`);

    const createdPlayer = new this.playerModel(createPlayerDTO);

    return createdPlayer.save();
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const foundPlayer = await this.playerModel.findOne({ email }).exec();

    if (!foundPlayer) {
      throw new NotFoundException(`Player with email ${email} does not found`);
    }

    return foundPlayer;
  }

  async getPlayerById(_id: string): Promise<Player> {
    const foundPlayer = await this.playerModel.findById(_id);

    if (!foundPlayer) throw new BadRequestException(`User does not exists`);

    return foundPlayer;
  }

  async updatePlayer(
    _id: string,
    updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<void> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();

    if (!playerExists) throw new NotFoundException('Player does not found');

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDTO })
      .exec();
  }

  async deletePlayer(_id: string): Promise<any> {
    const playerExists = await this.playerModel.findOne({ _id }).exec();

    if (!playerExists) throw new NotFoundException('Player does not found');

    return this.playerModel.deleteOne({ _id }).exec(); // remove is deprecated, instead use deleteOne for example
  }
}
