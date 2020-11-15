module.exports.templateTags = [require('./src/json-param-tag')];
module.exports.requestHooks = [require('./src/json-extractor')];
module.exports.workspaceActions = [require('./src/housekeeping')];