import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto, UserResponseDto } from '../dto/users.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AjvValidationPipe } from 'ajv-validation.pipe';
import { UserDtoSchema } from '../schema/user-dto.schema';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('')
  @ApiOperation({ summary: 'Create User', operationId: 'createUser' })
  @ApiCreatedResponse({
    description: 'user created successfully.',
    type: UserResponseDto,
  })
  @ApiBody({ type: UserDto, required: true })
  @ApiBadRequestResponse({ description: 'user can not be created.' })
  async createUser(
    @Body(new AjvValidationPipe(UserDtoSchema)) createUserDto: UserDto,
  ): Promise<UserResponseDto> {
    return (await this.userService.createUser(
      createUserDto,
    )) as UserResponseDto;
  }

  @Get('')
  @ApiOperation({
    summary: 'Get all users',
    operationId: 'getAllUsers',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiOkResponse({
    description: 'Return the list of users.',
    type: [UserDto],
  })
  async getAllTables(): Promise<UserDto[]> {
    return await this.userService.getAllUsers();
  }
}
