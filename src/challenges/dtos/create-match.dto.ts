import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import { Player } from 'src/players/interfaces/player.interface';
import { Result } from '../interfaces/challenge.interface';

export class CreateMatchDTO {
  @IsNotEmpty()
  def: Player;

  @IsArray()
  @ArrayMinSize(2)
  result: Array<Result>;
}
