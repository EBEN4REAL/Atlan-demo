import { watch, ref } from 'vue';

import { whoAmI } from './api/whoami';
import { evaluate, EvaluatesBody } from './api/evaluate';
import { useAccessStore } from './accessStore/index';

interface EvaluateAssetInterface { 
    entityGuid: string; 
    typeName: string
}

const useCheckAccess = () => {
    const accessStore = useAccessStore();

    const refreshWorkspacePermissions = () => {
        const { data, error, isReady }  = whoAmI();
        watch(data, (accessData) => {
            if(accessData.userId) {
                accessStore.setPermissions(accessData.permissions)
                accessStore.setRoles(accessData.roles)
            }
        })

        return isReady
    }
    const evaluatePermissions = (assets: EvaluateAssetInterface | EvaluateAssetInterface[], actions: string | string[] ) => {
        let body: EvaluatesBody = {
            entities: []
        }

        if(Array.isArray(assets)) {
            assets.forEach((asset) => {
                if(Array.isArray(actions)) {
                    actions.forEach((action) => {
                        body.entities.push({
                            ...asset,
                            action
                        })
                    })
                } else {
                    body.entities.push({
                        ...asset,
                        action: actions
                    })
                }
            })
        } else {
            if(Array.isArray(actions)) {
                actions.forEach((action) => {
                    body.entities.push({
                        ...assets,
                        action
                    })
                })
            } else {
                body.entities.push({
                    ...assets,
                    action: actions
                })
            }
        }

        //{
        //     'guid1': {
        //         'entity_read': true,
        //         'entity_delete': true,
        //         'entity_update': true,
        //     },
        //     'guid2': {
        //         'entity_read': true,
        //         'entity_delete': true,
        //         'entity_update': true,
        //     },
        // }
        const response = ref<{
            [guid: string]: {
                [action: string]: boolean
            };
        }>({})

        const { data, error, isReady } = evaluate(body);

        watch(data, (evaluateData) => {
            const uniqueGuid = new Set<string>()

            evaluateData.forEach((data) => uniqueGuid.add(data.entityGuid))

            uniqueGuid.forEach((guid) => {
                if(!response.value[guid]) response.value[guid] = {}

                evaluateData.forEach((resp) => {
                    if(resp.entityGuid === guid) {
                        response.value[guid][resp.action] = resp.allowed
                    }
                })
            })
        })

        return response;
    }

    return {
        refreshWorkspacePermissions,
        evaluatePermissions
    }
}

export default useCheckAccess;