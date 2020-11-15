const common = require('./common');
const templateDisplayName = (args) => {
    return `JSON \u21d2 ${args[0].value}`;
}

module.exports = {
    displayName: 'JSON param',
    liveDisplayName: templateDisplayName,
    name: common.TEMPLATE_NAME,
    description: 'Param with json payload',
    args: [{
        displayName: 'Parameter name',
        defaultValue: '',
        type: 'string'
    }, ],
    async run(context, paramName='') {
        const { workspaceId, requestId } = context.meta;
        const jsonParamsNamesId = `${common.JSON_PARAMS_PREFIX}_${workspaceId}_${requestId}`;

        const jsonParamsNames = ((await context.store.getItem(jsonParamsNamesId)) || '').split('&');
        if (jsonParamsNames.indexOf(paramName) < 0) {
            jsonParamsNames.push(paramName);
        }

        await context.store.setItem(jsonParamsNamesId, jsonParamsNames.join('&'));

        return paramName;
    },
};
