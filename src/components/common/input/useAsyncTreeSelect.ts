

import { ref, computed, watch } from 'vue'
import { useAPIPromise } from '~/services/api/useAPI';
import { getStringFromPath } from './asyncSelect.utils'


export default function useAsyncTreeSelect(rootData, reqConfig, resConfig) {

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
        let parsedUrl = url;
        if (parsedUrl.includes('{{domain}}'))
            parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
        if (parsedUrl.includes('{{parent}}'))
            parsedUrl = parsedUrl.replace('{{parent}}', n.value)

        try {
            const response = await useAPIPromise(parsedUrl, method, { params, body })
            // eslint-disable-next-line no-param-reassign
            n.dataRef.children = [...getData(response)].map(r => ({ pid: n.value, value: r.value, title: r.label, children: undefined, isLeaf: true, key: r.value }));
        } catch (e) {
            const { errorMessage, errorLabelPath } = resConfig
            errorM.value = errorMessage || errorLabelPath && getStringFromPath(e, errorLabelPath) || 'Some error occured'
            console.log(e)

        }
    }

    const data = ref([]);


    const init = () => {
        data.value = rootData.value.map(r => ({ value: r.value, title: r.label, children: [], key: r.value }))
    }





    return {
        treeData: data,
        init,
        onLoadData,
        errorM
    }
};


