import { UserEntity } from '@nanogpt-monorepo/core/dist/entities/user-entity';

export type UsersDto = Omit<UserEntity, 'password'>;
