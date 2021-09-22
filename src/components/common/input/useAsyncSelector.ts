
import { ref } from 'vue'
import { useAPIPromise } from '~/api/useAPI';

export default function useAsyncSelector(reqConfig, resConfig) {
    const asyncData = ref()

    const loadingData = ref(false)

    const setData = (res) => {
        const { rootPath, labelPath, valuePath } = resConfig;

        const rootPathParts = rootPath.split('.').slice(1)

        let root = res

        rootPathParts.forEach(p => {
            root = root[p]
        });


        const data = root.map(o => {
            let label = o;
            const labelPathParts = labelPath.split('.').slice(1)
            labelPathParts.forEach(p => {
                label = label[p]
            })

            let value = o;
            const valuePathParts = valuePath.split('.').slice(1)
            valuePathParts.forEach(p => {
                value = value[p]
            })

            return {
                value,
                label
            }
        })

        asyncData.value = data;

    }
    const loadData = async () => {
        const { url, method, params, body } = reqConfig
        loadingData.value = true
        const response = await useAPIPromise(url, method, { params, body })
        setData(response);
        loadingData.value = false
    }
    return {
        loadData,
        asyncData,
        loadingData,
    }
};


