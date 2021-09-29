
import { ref, computed, watch } from 'vue'
import { useAPIPromise } from '~/api/useAPI';
import { createDebounce } from "~/composables/utils/debounce";

export default function useAsyncSelector(
    reqConfig: { url?: any; method?: any; params?: any; addRefValues: Array; body: Object },
    resConfig: { rootPath: any; labelPath: any; valuePath: any; },
    valueObject: { [x: string]: string; }) {
    const asyncData = ref()

    const loadingData = ref(false)

    const setData = (res: any) => {
        const { rootPath, labelPath, valuePath } = resConfig;

        const rootPathParts = rootPath.split('.').slice(1)

        let root = res

        rootPathParts.forEach((p: string | number) => {
            root = root[p]
        });


        const data = root.map((o: any) => {
            let label = o;
            const labelPathParts = labelPath.split('.').slice(1)
            labelPathParts.forEach((p: string | number) => {
                label = label[p]
            })

            let value = o;
            const valuePathParts = valuePath.split('.').slice(1)
            valuePathParts.forEach((p: string | number) => {
                value = value[p]
            })

            return {
                value,
                label
            }
        })

        asyncData.value = data;

    }
    const getParsedBody = (keys) => {
        console.log('keys', keys)
        const { body } = reqConfig

        const addRefValues = { ...body }
        keys.forEach(k => {
            addRefValues[k] = valueObject[k]
        })
        console.log('getParsedBody', addRefValues)
        return addRefValues
    }

    const loadDataError = ref(false);
    const loadData = async () => {
        const { url, method, params, addRefValues } = reqConfig
        loadingData.value = true
        loadDataError.value = false
        try {
            const response = await useAPIPromise(url, method, { params, body: getParsedBody(addRefValues) })
            setData(response);
        } catch (e) {
            loadDataError.value = true;
        }
        loadingData.value = false
    }

    const letAsyncSelectDisabled = computed(() => {
        const { addRefValues } = reqConfig;
        getParsedBody(addRefValues)
        const valueMissing = addRefValues.some((e: string) => (valueObject[e] == null) || (valueObject[e] === ""))
        if (valueMissing) return valueMissing
        return false
    })

    // when mutating (rather than replacing) an Object or an Array, 
    // the old value will be the same as new value because they reference the same Object / Array.
    // Vue doesn't keep a copy of the pre-mutate value.
    // i.e cannot use valueObject directly in watcher, need recheck

    const values = computed(() => {
        if (!reqConfig) return []
        const { addRefValues } = reqConfig;
        const temp = []
        addRefValues.forEach(element => {
            temp.push(valueObject[element])
        });
        console.log('temp', temp)
        return temp
    })
    const debouncer = createDebounce()
    // ? watch for dynamic ref changing event and re-run load options
    watch(values, (o, n) => {
        console.log({ o, n })
        if (JSON.stringify(o) !== JSON.stringify(n))
            if (!letAsyncSelectDisabled.value)
                debouncer(() => loadData(), 500)

    }, { deep: true })

    return {
        loadData,
        asyncData,
        loadingData,
        letAsyncSelectDisabled
    }
};


