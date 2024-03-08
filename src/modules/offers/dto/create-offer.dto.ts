import { IsBoolean, IsNumber, IsUrl } from 'class-validator';

export class CreateOfferDto {
  @IsUrl()
  item: string;

  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
