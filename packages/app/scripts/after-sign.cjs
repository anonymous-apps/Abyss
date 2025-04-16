const notarize = require('./notarize.cjs');

module.exports = async context => {
    await notarize.default(context);
};
