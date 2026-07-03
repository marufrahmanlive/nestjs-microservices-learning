import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * 💚 HealthModule
 *
 * A tiny module that only has one controller.
 * No database, no service — just a simple health check.
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
