module.exports = {
  apps: [
    {
      name: 'backend-api',
      script: './backend/src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        MONGO_URI: 'mongodb://localhost:27017/tasks_prod',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/backend-error.log',
      out_file: 'logs/backend-out.log',
      merge_logs: true,
      time: true,
    }
  ],
};
