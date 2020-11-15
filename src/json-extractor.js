const common = require('./common');

const extractParams = (rootParamName, data, result = {}) => {
    if (!(data instanceof Object)) {
        result[rootParamName] = data;
    } else if (data instanceof Array) {
        data.map((val, i) => extractParams(`${rootParamName}[${i}]`, val, result));
    } else {
        Object.keys(data).map(key => extractParams(`${rootParamName}[${key}]`, data[key], result));
    }

    return result;
}

module.exports = async context => {
    const { workspaceId, requestId } = context.request.getEnvironment().getMeta();
    const reqParamsNames = (await context.request.getParameters()).map(param => param.name);
    const jsonParamsNamesId = `${common.JSON_PARAMS_PREFIX}_${workspaceId}_${requestId}`;
    const jsonParamsNames = ((await context.store.getItem(jsonParamsNamesId)) || '').split('&')
        .filter(name => reqParamsNames.indexOf(name) >= 0);

    await context.store.setItem(jsonParamsNamesId, jsonParamsNames);

    for (jsonParamName of jsonParamsNames) {
        const params = extractParams(jsonParamName, JSON.parse(await context.request.getParameter(jsonParamName)));
        await context.request.removeParameter(jsonParamName);
        await Promise.all(Object.keys(params).map(key => context.request.setParameter(key, params[key])));
    }
}


