import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { CreateMatchDTO } from './dtos/create-match.dto';
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

  @Post('/:challenge_id/match')
  async match(
    @Param('challenge_id') challenge_id: string,
    @Body(ValidationPipe) match: CreateMatchDTO,
  ) {
    return this.challengesService.createMatch(challenge_id, match);
  }
}
