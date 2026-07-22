const { spawn } = require('child_process');

const frontendPort = process.env.PORT || 3000;

// Start backend
const backend = spawn('node', ['dist/index.js'], {
  cwd: '/app/backend',
  env: { ...process.env, PORT: 3001, NODE_ENV: 'production' },
  stdio: 'inherit'
});

// Cleanup handler
process.on('SIGINT', () => backend.kill());
process.on('SIGTERM', () => backend.kill());
process.on('exit', () => backend.kill());

// Start frontend
const frontend = spawn('npm', ['start', '--', '-H', '0.0.0.0', '-p', frontendPort], {
  cwd: '/app/frontend',
  stdio: 'inherit'
});

frontend.on('exit', (code) => {
  backend.kill();
  process.exit(code);
});
