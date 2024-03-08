import { IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto {
  @Length(1, 250)
  @IsOptional()
  name?: string;

  @Length(0, 1500)
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  image?: string;
}
