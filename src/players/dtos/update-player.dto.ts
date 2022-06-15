import { IsNotEmpty } from 'class-validator';

export class UpdatePlayerDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly phone_number: string;
}
