/**
 * ⚙️ PM2 Ecosystem Configuration
 *
 * WHY PM2?
 * PM2 is a PROCESS MANAGER for Node.js applications.
 * It keeps your app running 24/7, even if it crashes.
 *
 * What PM2 does for us:
 * 1. AUTO-RESTART — if the app crashes, PM2 restarts it
 * 2. LOG MANAGEMENT — captures stdout/stderr into log files
 * 3. CLUSTER MODE — can run multiple instances (but we keep it simple with 1)
 * 4. STARTUP SCRIPT — automatically starts app when server reboots
 * 5. MONITORING — `pm2 status` shows CPU, memory, uptime
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env production   → start with env_production
 *   pm2 status                                        → check running apps
 *   pm2 logs nestjs-app                               → view logs
 *   pm2 restart nestjs-app                            → restart the app
 *   pm2 stop nestjs-app                               → stop the app
 *   pm2 save                                          → save process list for auto-restart on reboot
 *   pm2 startup                                       → configure PM2 to start on system boot
 *
 * IMPORTANT: pm2 --env production reads the env_production block below.
 * It does NOT read .env files — those are handled by NestJS ConfigModule.
 */
module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      script: './dist/main.js',
      // instances: 1,
      // exec_mode: 'fork',
      instances: 2, //needed for zero downtime
      exec_mode: 'cluster', //needed for zero downtime

      env_file: '.env.production',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,

      autorestart: true,
      watch: false,
      max_memory_restart: '500M',

      wait_ready: false,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
  ],
};
