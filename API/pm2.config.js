module.exports = {
  apps: [{
    name: 'mokirebootapi',
    script: './dist/index.js',
    max_restarts: 3,
    min_uptime: '10s',
    max_memory_restart: '200M',
  }]
}
