import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserDto, UserEntity, UserResponseDto } from '../dto/users.dto';
import { PrismaService } from 'database/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  private readonly logger = new Logger(UsersService.name);

  async createUser(user: UserDto): Promise<UserResponseDto> {
    try {
      this.logger.debug(`user : ${JSON.stringify(user)}`);

      await this.validateUniqueUser(user);
      const createdUser: UserEntity = await this.prismaCreateUser(user);

      this.logger.debug(
        `User created successfully: ${JSON.stringify(createdUser)}`,
      );

      return {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw new BadRequestException('Failed to create user. Please try again.');
    }
  }

  private async validateUniqueUser(user: UserDto): Promise<void> {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });

    if (userExists) {
      this.logger.warn(`User with email ${user.email} already exists.`);
      throw new BadRequestException('A user with this email already exists.');
    }
  }

  private prismaCreateUser(user: UserDto): Promise<UserEntity> {
    return this.prismaService.user.create({
      data: user,
    }) as Promise<UserEntity>;
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users: UserEntity[] = await this.prismaService.user.findMany();
    this.logger.debug(`Users: ${JSON.stringify(users)}`);
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }
}
