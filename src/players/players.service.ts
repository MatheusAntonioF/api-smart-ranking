import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const playerExists = await this.players.find(
      (player) => player.email === email,
    );

    if (playerExists) {
      await this.update(playerExists, createPlayerDTO);
    } else {
      await this.create(createPlayerDTO);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const foundPlayer = await this.players.find(
      (player) => player.email === email,
    );

    if (!foundPlayer) {
      throw new NotFoundException(`Player with email ${email} does not found`);
    }

    return foundPlayer;
  }

  private create(createPlayerDTO: CreatePlayerDTO): void {
    const { name, email, phone_number } = createPlayerDTO;

    const player: Player = {
      _id: uuidv4(),
      name,
      email,
      phone_number,
      ranking: 'A',
      position_ranking: 1,
      url_photo_player: 'www.google.com/foto123.jpg',
    };

    this.logger.log(player);

    this.players.push(player);
  }

  private update(foundPlayer: Player, createPlayerDTO: CreatePlayerDTO): void {
    const { name } = createPlayerDTO;

    this.players = this.players.map((player) =>
      player.email === foundPlayer.email ? { ...foundPlayer, name } : player,
    );
  }

  async deletePlayer(email: string): Promise<void> {
    const foundPlayer = await this.players.find(
      (player) => player.email === email,
    );

    this.players = this.players.filter(
      (player) => player.email !== foundPlayer.email,
    );
  }
}
