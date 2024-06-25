export class UserDto {
  name: string;
  email: string;
}

export class UserEntity {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserResponseDto extends UserDto {
  id: number;
}
