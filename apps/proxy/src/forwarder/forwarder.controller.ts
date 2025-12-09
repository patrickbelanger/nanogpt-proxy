import { Controller, All, Req, Res, HttpException, HttpStatus, Logger } from '@nestjs/common';
import express from 'express';
import { ForwarderService } from './forwarder.service';

@Controller('/v1')
export class ForwarderController {
  constructor(private readonly forwarder: ForwarderService) {}
  private readonly logger = new Logger(ForwarderController.name);

  @All('*')
  async proxy(@Req() req: express.Request, @Res() res: express.Response) {
    try {
      await this.forwarder.handleRequest(req, res);
    } catch (err: unknown) {
      this.logger.error('Forwarder error:', err);

      if (err instanceof HttpException) {
        throw err;
      }

      const message = err instanceof Error ? err.message : 'Forwarding failed';

      throw new HttpException({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
