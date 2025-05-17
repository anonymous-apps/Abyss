// vitest.setup.js
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1); // Exit with a failure code
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    process.exit(1); // Exit with a failure code
});
