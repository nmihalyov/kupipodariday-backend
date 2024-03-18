import { IsInt, IsNumber, IsPositive, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  raised: number;

  @Length(1, 1024)
  description: string;

  @IsInt()
  copied: number;
}
