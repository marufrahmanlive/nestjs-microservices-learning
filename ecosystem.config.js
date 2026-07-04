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
 *   pm2 start ecosystem.config.js   → start the app
 *   pm2 status                       → check running apps
 *   pm2 logs nestjs-app               → view logs
 *   pm2 restart nestjs-app            → restart the app
 *   pm2 stop nestjs-app               → stop the app
 *   pm2 save                         → save process list for auto-restart on reboot
 *   pm2 startup                      → configure PM2 to start on system boot
 */
module.exports = {
  apps: [
    {
      name: 'nestjs-app', // Name shown in `pm2 status`
      script: './dist/main.js', // The compiled JavaScript entry point
      instances: 1,
      exec_mode: 'fork',
      // instances: 'max', // Number of instances (1 = single instance)
      // exec_mode: 'cluster', // 'fork' = simple single process (good for beginners)
      env: {
        NODE_ENV: 'production', // Environment variable
        PORT: 3000, // Port to listen on
      },
      // Log file locations (so we can debug issues)
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      // Time format in logs
      time: true,

      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
