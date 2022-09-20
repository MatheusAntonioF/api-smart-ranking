import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { CreateMatchDTO } from './dtos/create-match.dto';
import { ChallengeStatusEnum } from './enum/challenge-status.enum';
import { Challenge, Match } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,

    private readonly categoriesService: CategoriesService,
    private readonly playersService: PlayersService,
  ) {}

  async create(createChallenge: CreateChallengeDTO): Promise<Challenge> {
    const players = await this.playersService.getAllPlayers();

    createChallenge.players.forEach((playerDTO) => {
      const filteredPlayers = players.filter(
        (player) => player._id == playerDTO._id,
      );

      if (filteredPlayers.length === 0) {
        throw new BadRequestException('Jogador invalido');
      }
    });

    const playersIsInTheMatch = createChallenge.players.filter(
      (player) => player._id === createChallenge.challenger._id,
    );

    if (playersIsInTheMatch.length === 0) {
      throw new BadRequestException(
        'O desafiante deve ser um dos jogadores da partida',
      );
    }

    const categoryFromChallenger =
      await this.categoriesService.getCategoryFromPlayer(
        createChallenge.challenger._id,
      );

    if (!categoryFromChallenger) {
      throw new BadRequestException(
        'O desafiante não está cadastrado em uma categoria',
      );
    }

    const createdChallenge = await this.challengeModel.create(createChallenge);

    createdChallenge.category = categoryFromChallenger._id;

    createdChallenge.dateTimeChallenge = new Date();

    createdChallenge.status = ChallengeStatusEnum.PENDENTE;

    return createdChallenge.save();
  }

  async getChallengesByPlayerId(player_id: string): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .where('players')
      .in([player_id])
      .populate('players')
      .populate('challenger')
      .populate('match')
      .exec();
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengeModel
      .find()
      .populate('players')
      .populate('challenger')
      .populate('match')
      .exec();
  }

  async createMatch(
    challenge_id: string,
    match: CreateMatchDTO,
  ): Promise<void> {
    const foundChallenge = await this.challengeModel.findById(challenge_id);

    const createdMatch = await this.matchModel.create(match);

    createdMatch.category = foundChallenge.category;

    createdMatch.players = foundChallenge.players;

    const result = await createdMatch.save();

    foundChallenge.status = ChallengeStatusEnum.REALIZADO;

    foundChallenge.match = result._id;

    await this.challengeModel
      .findOneAndUpdate({ _id: challenge_id }, foundChallenge)
      .exec();
  }
}
