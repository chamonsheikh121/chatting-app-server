import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }
  async findAll() {
    return await this.prisma.client.user.findMany();
  }
  async findOne(id: string) {
    return await this.prisma.client.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
