import { Controller, Get } from '@nestjs/common';

/**
 * 💚 HealthController — Health Check Endpoint
 *
 * WHY do we need a health endpoint?
 * When you deploy your app to production, you need a way to check:
 * "Is my app still alive?"
 *
 * This is used by:
 * - Load balancers (to know which servers are healthy)
 * - Monitoring tools (UptimeRobot, Datadog, etc.)
 * - Docker/Kubernetes health checks
 * - You, when debugging: "Is the server even running?"
 *
 * It returns a simple JSON:
 * {
 *   "status": "ok",
 *   "timestamp": "2024-01-01T00:00:00.000Z",
 *   "uptime": 12345
 * }
 */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(), // seconds since the app started
      message: 'Books API is running! 🚀',
    };
  }
}
