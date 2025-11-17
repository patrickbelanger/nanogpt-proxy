import { Module } from '@nestjs/common';
import { ForwarderController } from './forwarder.controller';
import { ForwarderService } from './forwarder.service';

import { EnvironmentModule } from '../environment/environment.module';
import { CryptoModule } from '../crypto/crypto.module';
import { RedisModule } from '../redis/redis.module';
import { UserRepository } from '../user/user.repository';

@Module({
    imports: [EnvironmentModule, CryptoModule, RedisModule],
    controllers: [ForwarderController],
    providers: [ForwarderService, UserRepository],
})
export class ForwarderModule { }
