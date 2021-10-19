import { ref, computed, watch } from 'vue'
import { useAPIPromise } from '~/services/api/useAPI';
import { ReqConfig, ResConfig } from './asyncSelect.interface';
import { getStringFromPath } from './asyncSelect.utils'

export default function useAsyncSelector(
    reqConfig: ReqConfig,
    resConfig: ResConfig,
    valueObject: { [x: string]: string; }, getConfig: { rootPath: string, requestConfig: ReqConfig }) {
    const asyncData = ref()

    const setData = (res: any) => {
        const { rootPath, labelPath, valuePath } = resConfig;
        const rootPathParts = rootPath.split('.').slice(1)
        let root = res
        rootPathParts.forEach((p: string) => {
            if (p)
                root = root[p]
        });

        const data = root.map((o: any) => {
            // labelPath - {{.name}} - a - {{.attribute.displayName}}
            const label = getStringFromPath(o, labelPath)
            const value = getStringFromPath(o, valuePath);
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

        const b = { ...body }
        if (!keys) return b
        keys.forEach(k => {
            b[k] = valueObject.value[k]
        })
        console.log('getParsedBody', b)
        return b
    }

    const newConfig = ref(null);
    const newConfigLoading = ref(false);
    const newConfigError = ref(false);
    const createNewVisibility = ref(false);

    const setConfigData = (response) => {
        const rootPathParts = getConfig?.rootPath.split('.').slice(1)

        let data = response
        const arrayReg = /\w*\[\d*\]$/g

        rootPathParts.forEach((p: string) => {
            const isArr = arrayReg.test(p)
            if (isArr) {
                const index = parseInt(p.match(/(?<=\[).+?(?=\])/)[0], 10)
                data = data[p.split('[')[0]][index]
            } else data = data[p]
        });

        if (typeof data === 'string')
            try {
                const configCopy = data.replace(/\\n/g, '\\n')
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, '\\&')
                    .replace(/\\r/g, '\\r')
                    .replace(/\\t/g, '\\t')
                    .replace(/\\b/g, '\\b')
                    .replace(/\\f/g, '\\f')
                newConfig.value = JSON.parse(configCopy)
            } catch (e) {
                console.log('setConfigData', e)
            }
        else
            newConfig.value = [...data]

    }
    const handleCreateNew = async () => {
        const { url, method, params, body } = getConfig.requestConfig
        newConfigLoading.value = true;
        let parsedUrl = url;
        if (parsedUrl.includes('{{domain}}'))
            parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
        try {
            const response = await useAPIPromise(parsedUrl, method, { params, body })
            setConfigData(response)
            createNewVisibility.value = true
        } catch (e) {
            console.log({ e })
            newConfigError.value = true;
        }
        newConfigLoading.value = false
    }

    const loadingData = ref(false)
    const loadDataError = ref(false);
    const shouldRefetch = ref(true)
    const errorM = ref('')

    const loadData = async () => {
        errorM.value = ''
        shouldRefetch.value = false;
        asyncData.value = [];
        const { url, method, params, addFormValues } = reqConfig
        loadingData.value = true
        loadDataError.value = false
        let parsedUrl = url;
        if (parsedUrl.includes('{{domain}}'))
            parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
        try {
            const response = await useAPIPromise(parsedUrl, method, { params, body: getParsedBody(addFormValues) })
            setData(response);
        } catch (e) {
            const { errorMessage, errorLabelPath } = resConfig
            shouldRefetch.value = true;
            console.log({ e: e.response })
            errorM.value = errorMessage || errorLabelPath && getStringFromPath(e, errorLabelPath) || 'Some error occured'
            loadDataError.value = true;
        }
        loadingData.value = false
    }

    const letAsyncSelectDisabled = computed(() => {
        if (!reqConfig) return false;
        const { addFormValues } = reqConfig;
        if (addFormValues?.length && !valueObject.value) return true
        const valueMissing = addFormValues?.some((e: string) => (valueObject.value[e] == null) || (valueObject.value[e] === ""))
        return valueMissing
    })

    // when mutating (rather than replacing) an Object or an Array, 
    // the old value will be the same as new value because they reference the same Object / Array.
    // Vue doesn't keep a copy of the pre-mutate value.
    // i.e cannot use valueObject.value directly in watcher, need recheck

    const values = computed(() => {
        if (!reqConfig || !valueObject.value) return []
        const { addFormValues } = reqConfig;
        const temp = []
        if (addFormValues)
            addFormValues.forEach(element => {
                if (valueObject.value[element])
                    temp.push(valueObject.value[element]);
            });
        return temp
    })
    // const debouncer = createDebounce()
    // ? watch for dynamic ref changing event and re-run load options
    watch(values, (o, n) => {
        if (JSON.stringify(o) !== JSON.stringify(n))
            if (!letAsyncSelectDisabled.value)
                shouldRefetch.value = true;

    }, { deep: true })


    return {
        loadData,
        errorM,
        loadDataError,
        newConfig,
        asyncData,
        shouldRefetch,
        loadingData,
        handleCreateNew,
        createNewVisibility,
        letAsyncSelectDisabled
    }
};


