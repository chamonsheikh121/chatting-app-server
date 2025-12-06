/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaService } from '@/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';
import { CreateMessageDto } from '../message/dto/create-message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private onlineUsers = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly messageService: MessageService,
  ) {}

  handleConnection(socket: Socket) {
    const token = socket.handshake.auth?.token;
    if (!token) {
      socket.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify(token as string, {
        secret: process.env.ACCESS_TOKEN_SECRET!,
      });

      const { userId: senderId } = payload;
      this.onlineUsers.set(senderId as string, socket.id);
      this.prisma.client.user.update({
        where: { id: senderId },
        data: { status: 'ONLINE' },
      });

      socket.data.senderId = senderId;
      socket.join(`user: ${senderId}`);
      console.log(payload);
    } catch (error) {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const senderId = socket.data.senderId;
    if (senderId) {
      this.onlineUsers.delete(senderId as string);
      this.prisma.client.user.update({
        where: {
          id: senderId,
        },
        data: {
          status: 'OFFLINE',
        },
      });

      this.server
        .to(`user:${senderId}`)
        .emit('update:presence', { senderId, status: 'offline' });
    }
  }

  @SubscribeMessage('message:direct')
  async handleDirectMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const { receiverId, content } = payload;
    const senderId = socket.data.senderId;

    console.log(senderId);

    const messageData: CreateMessageDto = {
      content,
      receiverId,
      senderId,
      type: 'TEXT',
    };

    const message = await this.messageService.createDirectMessage(messageData);
    const receiverSocketId = this.onlineUsers.get(receiverId as string);
    if (receiverSocketId) {
      this.server.to(receiverId as string).emit('message:direct', { message });
    }
    socket.emit('message:ack', { message });
  }
}
