const common = require('./common');
const filterJsonParametersNames = common.filterJsonParametersNames;

module.exports = {
    label: 'Clean unused data (json-extractor)',
    icon: 'fa-trash',
    action: async (context, models) => {
        const workspaceId = models.workspace._id;
        const keyPrefix = `${common.JSON_PARAMS_PREFIX}_${workspaceId}_`;
        const storeItems = await context.store.all();

        let itemsRemoved = 0;
        for (const item of storeItems) {
            const key = item.key;
            if (key.startsWith(keyPrefix)) {
                const keySuffix = key.slice(keyPrefix.length);
                const request = models.requests.find(req => req._id === keySuffix);
                if (request) {
                    context.store.setItem(key, await filterJsonParametersNames(request, item.value));
                } else {
                    context.store.removeItem(key);
                    itemsRemoved++;
                }
            }
        }

        context.app.alert('Store cleaned', `${itemsRemoved} unused items removed`);
    },
  };