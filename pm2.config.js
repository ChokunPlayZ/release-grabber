module.exports = {
    apps: [
      {
        name: 'Release Grabber',
        script: 'index.js',
        autorestart: true,
        exp_backoff_restart_delay: 1000
      }
    ]
  };