import { IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(2, 30)
  @IsOptional()
  username?: string;

  @Length(2, 200)
  @IsOptional()
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}
