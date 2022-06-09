import { Document } from 'mongoose';

export interface Player extends Document {
  readonly phone_number: string;
  readonly email: string;
  name: string;
  ranking: string;
  position_ranking: number;
  url_photo_player: string;
}
