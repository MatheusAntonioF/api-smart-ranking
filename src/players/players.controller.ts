import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  @Post()
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    const { name } = createPlayerDTO;

    return { name };
  }
}
