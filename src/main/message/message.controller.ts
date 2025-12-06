/* eslint-disable @typescript-eslint/no-unsafe-return */
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.createDirectMessage(createMessageDto);
  }

  // @Get()
  // findAll() {
  //   return this.messageService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.messageService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
  //   return this.messageService.update(+id, updateMessageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.messageService.remove(+id);
  // }
}
