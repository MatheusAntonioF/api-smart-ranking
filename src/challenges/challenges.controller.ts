import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  async index(@Query('player_id') player_id: string): Promise<Challenge[]> {
    return player_id
      ? await this.challengesService.getChallengesByPlayerId(player_id)
      : await this.challengesService.getAllChallenges();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createChallenge: CreateChallengeDTO) {
    return this.challengesService.create(createChallenge);
  }
}
