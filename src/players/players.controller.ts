import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(): Promise<Player[] | Player> {
    return this.playersService.getAllPlayers();
  }

  @Get('/:_id')
  async getPlayerById(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<Player> {
    return this.playersService.getPlayerById(_id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return this.playersService.createPlayer(createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
    @Body() updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<void> {
    await this.playersService.updatePlayer(_id, updatePlayerDTO);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', PlayersValidationParamsPipe) _id: string,
  ): Promise<void> {
    this.playersService.deletePlayer(_id);
  }
}
