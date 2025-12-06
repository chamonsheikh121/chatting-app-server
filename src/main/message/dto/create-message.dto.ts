import { IsString } from 'class-validator';
import { MessageType } from 'generated/prisma/enums';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  receiverId: string;
  @IsString()
  senderId: string;
  @IsString()
  type: MessageType;
}
