const duplicatePrisma = require('./duplicate-prisma.cjs');

module.exports = async context => {
    await duplicatePrisma(context);
};
