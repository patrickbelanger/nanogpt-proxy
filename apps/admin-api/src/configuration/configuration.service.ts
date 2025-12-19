import { Injectable, Logger } from '@nestjs/common';
import { ConfigurationRepository } from './configuration.repository';
import { ConfigurationTypes } from './configuration.types';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(private readonly configuration: ConfigurationRepository) {}

  async getConfig() {
    return this.configuration.getConfig();
  }

  async updateConfig(partial: Partial<ConfigurationTypes>) {
    this.logger.log(`Updating application configuration: ${JSON.stringify(partial)}`);
    return this.configuration.saveConfig(partial);
  }
}
