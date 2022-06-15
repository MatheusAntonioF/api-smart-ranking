import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const playerExists = await this.playerModel.findOne({ email }).exec();

    if (playerExists) {
      await this.update(createPlayerDTO);
    } else {
      await this.create(createPlayerDTO);
    }
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

  private async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDTO);

    return createdPlayer.save();
  }

  private async update(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDTO.email },
        { $set: createPlayerDTO },
      )
      .exec();
  }

  async deletePlayer(email: string): Promise<any> {
    return this.playerModel.remove({ email }).exec();
  }
}
