import { IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @Length(0, 1500)
  description: string;

  @IsUrl()
  image: string;
}
