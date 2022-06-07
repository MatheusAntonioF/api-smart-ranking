import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playersService.createPlayer(createPlayerDTO);
  }

  @Get()
  async getPlayers(): Promise<Player[]> {
    return this.playersService.getAllPlayers();
  }
}
