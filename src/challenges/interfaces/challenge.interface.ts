import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatusEnum } from '../enum/challenge-status.enum';

export interface Challenge extends Document {
  date: Date;
  challenger: Player;
  players: Array<Player>;
  dateTimeChallenge: Date;
  status: ChallengeStatusEnum;
  category: string;
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
