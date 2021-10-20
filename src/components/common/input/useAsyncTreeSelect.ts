

import { computed, ref } from 'vue'
import { useAPIPromise } from '~/services/api/useAPI';
import { getStringFromPath, genParams, keyIDs } from './asyncSelect.utils'


export default function useAsyncTreeSelect(rootData, reqConfig, resConfig, valueObject: { [x: string]: string; }) {

    const getData = (res: any) => {
        const { rootPath, labelPath, valuePath } = resConfig;

        const rootPathParts = rootPath.split('.').slice(1)

        let root = res

        rootPathParts.forEach((p: string) => {
            if (p)
                root = root[p]
        });


        const data = root.map((o: any) => {
            const label = getStringFromPath(o, labelPath);
            const value = getStringFromPath(o, valuePath);
            return {
                value,
                label
            }
        })

        return data;

    }

    const errorM = ref('')
    const onLoadData = async (n: {
        [key: string]: any
        dataRef
    }) => {
        console.log('onLoadData', n);
        const { url, method, params, body } = reqConfig
        errorM.value = ''
        let parsedUrl: string = url;
        if (parsedUrl.includes('{{domain}}'))
            parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
        if (parsedUrl.includes('{{parent}}'))
            parsedUrl = parsedUrl.replace('{{parent}}', n.value)

        try {
            const response = await useAPIPromise(parsedUrl, method, { params: genParams(valueObject.value, params), body })
            // eslint-disable-next-line no-param-reassign // ? parent child can have same key value, eg, PUBLIC, FOODBEVERAGES, need key & value to be unique, so added "val"
            n.dataRef.children = [...getData(response)].map(r => ({ pid: n.value, title: r.label, isLeaf: true, key: `${n.value}-${r.value}`, value: `${n.value}-${r.value}`, val: r.value }));
        } catch (e) {
            const { errorMessage, errorLabelPath } = resConfig
            errorM.value = errorMessage || errorLabelPath && getStringFromPath(e, errorLabelPath) || 'Some error occured'
            console.log(e)

        }
    }

    // Currently not needing use case for disabling based on child api
    const disabled = computed(() => {
        const { params } = reqConfig
        const dependentKeys: string[] = []
        Object.values(params).forEach(v => {
            if (typeof v === 'string')
                dependentKeys.push(...keyIDs(v))
        })
        return dependentKeys;
    })

    const data = ref([]);
    const init = () => {
        // ? parent child can have same key value, eg, PUBLIC, FOODBEVERAGES, need key & value to be unique, so added "val"
        data.value = rootData.value.map(r => ({ value: r.value, val: r.value, title: r.label, children: [], key: r.value }))
    }

    return {
        disabled,
        treeData: data,
        init,
        onLoadData,
        errorM
    }
};


