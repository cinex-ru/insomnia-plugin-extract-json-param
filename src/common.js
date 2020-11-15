const common = {
    async filterJsonParametersNames(request, jsonParametersNames) {
        let reqParamsNames = request.parameters.map(param => {
            const result = regexpForJsonParamsNames.exec(param.name);
            if (result && result.groups) {
                return result.groups['param']
            }
            return '';
        }).filter(name => name.length > 0);

        return jsonParametersNames.split('&').filter(name => reqParamsNames.indexOf(name) >= 0).join('&');
    },

    TEMPLATE_NAME: 'jsonParam',
    JSON_PARAMS_PREFIX: 'jsonParamsNames'
}

const regexpForJsonParamsNames = new RegExp(`{%\\s*${common.TEMPLATE_NAME}\\s*'(?<param>[^']+)`);

module.exports = common;