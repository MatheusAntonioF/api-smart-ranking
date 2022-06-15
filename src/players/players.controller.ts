import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playersService.createPlayer(createPlayerDTO);
  }

  @Get()
  async getPlayers(
    @Query('email', PlayersValidationParamsPipe) email: string,
  ): Promise<Player[] | Player> {
    if (email) {
      return this.playersService.getPlayerByEmail(email);
    } else {
      return this.playersService.getAllPlayers();
    }
  }

  @Delete()
  async deletePlayer(
    @Query('email', PlayersValidationParamsPipe) email: string,
  ): Promise<void> {
    this.playersService.deletePlayer(email);
  }
}
