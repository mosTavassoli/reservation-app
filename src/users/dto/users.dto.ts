export class UserDto {
  name: string;
  email: string;
}

export class UserEntity {
  id: number;
  name: string;
  email: string;
}

export class userResponseDto extends UserDto {
  id: number;
}
