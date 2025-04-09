module.exports = {
  apps : [{
    name: 'nodepanel',
    script: './server.js',
    watch: true,
    env: {
      NODE_ENV: 'production'
    }
  }]
};
