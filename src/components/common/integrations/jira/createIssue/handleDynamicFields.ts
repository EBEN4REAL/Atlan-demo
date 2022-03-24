import { computed, Ref, ref } from "vue"

// ? utility fn
const getModelValue = (values) => {
    if (Array.isArray(values)) {
        return values.map((value) => {
            if (typeof value === 'object') {
                return value.value || value.id
            }
            return value
        })
    }
    if (typeof values === 'object') {
        return values.value || values.id
    }
    return values
}

export const staticDynamicFields = (config: Ref, form: Ref) => {

    const staticFields: Ref<
        {
            label: string
            key: string
            data: any
            selectedValue: any
        } | {}
    > = ref({})

    const staticFieldsKeyValues = computed(() => {
        const result = {}
        if (Object.keys(staticFields.value)?.length) {
            Object.values(staticFields.value).forEach((field) => {
                if (field.selectedValue) result[field.key] = field.selectedValue
            })
        }
        return result
    })

    // ? grab field config of static dynamic fields
    const initStaticFields = () => {
        const finalFields: any = {}
        if (!config.value) staticFields.value = {}

        const fields = config.value?.issuetypes?.find(
            (_type) => _type.id === form.value.issuetype
        )?.fields

        const includedTypes = ['priority', 'description']

        if (fields && typeof fields === 'object') {
            Object.entries(fields).forEach(([_, data]: any) => {
                if (includedTypes.includes(data.key)) {
                    finalFields[data.key] = {
                        label: data.name,
                        key: data.key,
                        data,
                        selectedValue: data.hasDefaultValue
                            ? data.defaultValue
                            : null,
                    }
                    // ? if field has allowedValues, creation options for a-select with them
                    let options
                    const allowedValues = data?.allowedValues
                    if (allowedValues) {
                        options = allowedValues.map((v) => ({
                            label: v.value ?? v.name,
                            value: v.value ?? v.id,
                            meta: v,
                        }))
                    }
                    if (options) finalFields[data.key].options = options
                    // also add default value to form model, strip other details
                    if (data.hasDefaultValue)
                        form.value[data.key] = getModelValue(data.defaultValue)
                }
            })
        }
        staticFields.value = finalFields
    }

    return {
        initStaticFields, staticFields, staticFieldsKeyValues
    }
}

export const requiredDynamicFields = (config: Ref, form: Ref) => {

    const requiredFields: Ref<
        {
            label: string
            key: string
            unsupported: string
            data: any
            selectedValue: any
            hideError: boolean
        }[]
    > = ref([])

    // ? grab field config of required only dynamic fields
    const initRequiredFields = () => {
        const finalFields: any = []
        if (!config.value) requiredFields.value = []

        const fields = config.value?.issuetypes?.find(
            (_type) => _type.id === form.value.issuetype
        )?.fields

        // ? any types  that we dont want can be blacklisted here
        const blackListTypes = [] // lets not add any now and render all as text // issueLink
        const supportedTypes = [
            'number',
            'string',
            'array',
            'priority',
            'option',
        ] // lets not add any now and render all as text // issueLink

        if (fields && typeof fields === 'object') {
            Object.entries(fields).forEach(([_, data]: any) => {
                if (data.required) {
                    // ! hiding fields that has defaultValue set but no defaultValue options provided
                    if (data.hasDefaultValue && !data.defaultValue) return
                    const isURL =
                        data.schema?.custom &&
                        data.schema?.custom.split(':').slice(-1)[0] === 'url'

                    const typeName = data.schema.type
                    // if (!supportedTypes.includes(typeName)) return
                    finalFields.push({
                        label: data.name,
                        key: data.key,
                        data,
                        hideError: !isURL,
                        unsupported: !supportedTypes.includes(typeName),
                        selectedValue: data.hasDefaultValue
                            ? data.defaultValue
                            : null,
                    })
                    // also add default value to form model, strip other details
                    if (data.hasDefaultValue)
                        form.value[data.key] = getModelValue(data.defaultValue)
                }
            })
        }
        // remove fields that are added static
        const ignoreFieldsKey = [
            'description',
            'priority',
            'issuetype',
            'labels',
            'project',
            'summary',
        ]

        requiredFields.value = finalFields.filter(
            (f) => !ignoreFieldsKey.includes(f.key)
        )
    }


    return {
        initRequiredFields, requiredFields
    }
}
