import { Controller, All, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import express from 'express';
import { ForwarderService } from './forwarder.service';

@Controller('/v1')
export class ForwarderController {
  constructor(private readonly forwarder: ForwarderService) {}

  @All('*')
  async proxy(@Req() req: express.Request, @Res() res: express.Response) {
    try {
      await this.forwarder.handleRequest(req, res);
    } catch (err) {
      console.error('Forwarder error:', err);
      throw new HttpException(
        { error: err?.message ?? 'Forwarding failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
