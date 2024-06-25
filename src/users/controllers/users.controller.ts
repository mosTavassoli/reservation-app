import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDto, UserResponseDto } from '../dto/users.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
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
}
