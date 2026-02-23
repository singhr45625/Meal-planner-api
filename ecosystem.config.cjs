module.exports = {
    apps: [{
        name: 'express-app',
        script: '/home/ubuntu/Meal-planner-api/server.js',  // Changed from server.js to app.js
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};