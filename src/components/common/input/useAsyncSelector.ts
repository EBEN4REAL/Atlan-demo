import { ref, computed, watch, Ref } from 'vue'
import genericAPI from '~/services/api/generic'
import { ReqConfig, ResConfig } from './asyncSelect.interface'
import { getStringFromPath, genParams, keyIDs } from './asyncSelect.utils'

export default function useAsyncSelector(
    reqConfig: Ref<ReqConfig>,
    resConfig: Ref<ResConfig>,
    valueObject: Ref<{ [x: string]: string }>,
    getConfig: Ref<{ rootPath: string; requestConfig: ReqConfig }>
) {
    const asyncData = ref()

    const setData = (res: any) => {
        const { rootPath, labelPath, valuePath } = resConfig.value || {}
        const rootPathParts = rootPath.split('.').slice(1)
        let root = res
        rootPathParts.forEach((p: string) => {
            if (p) root = root[p]
        })
        const data = root
            ? root.map((o: any) => {
                // labelPath - {{.name}} - a - {{.attribute.displayName}}
                const label = getStringFromPath(o, labelPath)
                const value = getStringFromPath(o, valuePath)
                return {
                    value,
                    label,
                    data: o,
                }
            })
            : []

        asyncData.value = data
    }

    const getParsedBody = (keys) => {
        const { body } = reqConfig.value

        const b = { ...body }
        if (!keys) return b
        keys.forEach((k) => {
            b[k] = valueObject.value[k]
        })
        return b
    }

    const newConfig = ref(null)
    const newConfigLoading = ref(false)
    const newConfigError = ref(false)
    const createNewVisibility = ref(false)

    const setConfigData = (response) => {
        const rootPathParts = getConfig.value?.rootPath.split('.').slice(1)

        let data = response
        const arrayReg = /\w*\[\d*\]$/g

        rootPathParts.forEach((p: string) => {
            const isArr = arrayReg.test(p)
            if (isArr) {
                const index = parseInt(p.match(/(?:\[).+?(?=\])/)[0], 10)
                data = data[p.split('[')[0]][index]
            } else data = data[p]
        })

        if (typeof data === 'string')
            try {
                const configCopy = data
                    .replace(/\\n/g, '\\n')
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
        else newConfig.value = [...data]
    }
    const handleCreateNew = async () => {
        const { url, method, params, body } = getConfig.value.requestConfig
        newConfigLoading.value = true
        let parsedUrl = url
        if (parsedUrl.includes('{{domain}}'))
            parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
        if (document.location.hostname === 'localhost')
            parsedUrl = parsedUrl.replace('https', 'http')
        try {
            const response = await genericAPI(parsedUrl, method, {
                params: genParams(valueObject.value, params),
                body,
            })

            createNewVisibility.value = true
        } catch (e) {
            console.log(genParams(valueObject.value, params))
            newConfigError.value = true
        }
        newConfigLoading.value = false
    }

    const loadingData = ref(false)
    const loadDataError = ref(false)
    const shouldRefetch = ref(true)
    const errorM = ref('')

    const loadData = async () => {
        errorM.value = ''
        shouldRefetch.value = false
        asyncData.value = []
        loadingData.value = true
        loadDataError.value = false
        const { url, method, params, addFormValues } = reqConfig.value
        let parsedUrl = url
        if (parsedUrl.includes('{{domain}}'))
            parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
        if (document.location.hostname === 'localhost')
            parsedUrl = parsedUrl.replace('https', 'http')
        try {
            const response = await genericAPI(
                getStringFromPath(valueObject.value, parsedUrl) ?? parsedUrl,
                method,
                {
                    params: genParams(valueObject.value, params),
                    body: getParsedBody(addFormValues),
                }
            )
            setData(response)
        } catch (e) {
            const { errorMessage, errorLabelPath } = resConfig.value
            shouldRefetch.value = true
            const errMsg = e.response?.data?.errorMessage || ''
            const generalError =
                "Don't worry, something broke on our end, you can send this info to us."
            errorM.value =
                errorMessage ||
                errMsg ||
                (errorLabelPath && getStringFromPath(e, errorLabelPath)) ||
                e.response?.data?.message ||
                generalError
            loadDataError.value = true
        }
        loadingData.value = false
    }

    const letAsyncSelectDisabled = computed(() => {
        if (!reqConfig.value) return false
        // ? check for missing values in addFormValues
        const { addFormValues } = reqConfig.value
        if (addFormValues?.length && !valueObject.value) return true

        const dependentKeys: string[] = []

        // ? check for missing values in URL
        const { url } = reqConfig.value
        dependentKeys.push(...keyIDs(url))
        // ? check for missing values in params
        const { params } = reqConfig.value
        if (typeof params === 'object')
            Object.values(params as object).forEach((v) => {
                if (typeof v === 'string') dependentKeys.push(...keyIDs(v))
            })
        const valueMissing =
            addFormValues?.some(
                (e: string) =>
                    valueObject.value[e] == null || valueObject.value[e] === ''
            ) ||
            dependentKeys?.some(
                (e: string) =>
                    valueObject.value[e] == null || valueObject.value[e] === ''
            )
        return valueMissing
    })

    // when mutating (rather than replacing) an Object or an Array,
    // the old value will be the same as new value because they reference the same Object / Array.
    // Vue doesn't keep a copy of the pre-mutate value.
    // i.e cannot use valueObject.value directly in watcher, need recheck

    const values = computed(() => {
        if (!reqConfig.value || !valueObject.value) return []
        const { addFormValues } = reqConfig.value
        const temp: any[] = []
        if (addFormValues)
            addFormValues.forEach((element) => {
                if (valueObject.value[element])
                    temp.push(valueObject.value[element])
            })
        return temp
    })
    // const debouncer = createDebounce()
    // ? watch for dynamic ref changing event and re-run load options
    watch(
        values,
        (o, n) => {
            if (JSON.stringify(o) !== JSON.stringify(n))
                if (!letAsyncSelectDisabled.value) shouldRefetch.value = true
        },
        { deep: true }
    )

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
        letAsyncSelectDisabled,
        getStringFromPath,
    }
}
