import { ref, watch, computed } from 'vue'



export default function useFormGenerator(dummy2, formRef) {
    const preProcessedSchema = ref([])
    const otherTypes = ['object', 'array']

    //* expands fields of type group <> flattens it
    const expandAllGroups = (config) => {
        let fields = []
        config.forEach((f) => {
            if (f.type === 'group') {
                fields = [...fields, ...f.children]
            } else {
                fields.push(f)
            }
        })
        return fields
    }

    const getValueFromSchemaData = (id) =>
        expandAllGroups(preProcessedSchema.value).find(
            (s) => s.id === id
        ).value

    // improve this to go deeper than 1 level
    //* expands fields of type object, array <> flattens it
    const getChildren = (schema) => {
        let children = []
        const parent = schema.id
        const parentType = schema.type

        schema.children.forEach((s) => {
            // only 1 level nested check
            if (s.type === 'group') {
                children = [
                    ...children,
                    {
                        ...s,
                        isVisible: true,
                        children: [
                            ...s.children.map((a) => ({
                                ...a,
                                parent,
                                parentType,
                                ...(a.default != null
                                    ? { value: a.default }
                                    : {}),
                            })),
                        ],
                    },
                ]
            } else {
                children.push(
                    s.map({
                        ...s,
                        ...(s.default != null
                            ? { value: s.default }
                            : {}),
                    })
                )
            }
        })
        return children
    }

    dummy2.forEach((f) => {
        if (!otherTypes.includes(f.type)) {
            preProcessedSchema.value.push({
                ...f,
                ...(f.default != null ? { value: f.default } : {}),
            })
        } else {
            preProcessedSchema.value.push(...getChildren(f))
        }
    })

    const generateSring = (s) => {
        if (!preProcessedSchema.value.length) return s
        const templatePartsf = s.split('{{')
        let finalString = ''
        // ? ->
        templatePartsf.forEach((p, i) => {
            if (i === 0) {
                finalString += p
            } else {
                const pp = p.split('}}')
                finalString += getValueFromSchemaData(pp[0]) + pp[1]
            }
        })
        return finalString
    }

    // const fc = ref();
    const finalConfigObject = computed(() => {
        const temp = {}
        expandAllGroups(preProcessedSchema.value).forEach((s) => {
            // ? handle for: if a group is present at root level
            if (s.type === 'group') {
                s.children.forEach((gc) => {
                    if (gc.type === 'template') {
                        temp[gc.id] = generateSring(gc.template)
                    } else temp[gc.id] = gc.value
                })
                // ? handle for: if parent key exist (i.e value needs to go inside parent)
            } else if (s.parent) {
                if (s.parentType === 'object') {
                    temp[s.parent] = { ...(temp[s.parent] || {}) }
                    if (s.type === 'template') {
                        temp[s.parent][s.id] = generateSring(s.template)
                    } else {
                        temp[s.parent][s.id] = s.value
                    }
                }
                // * handle for array
            } else if (s.type === 'template') {
                temp[s.id] = generateSring(s.template)
            } else temp[s.id] = s.value
        })
        return temp
    })


    // rules
    //* get rule object based on antDesign rules guide
    const getRule = (raw) => {
        const r = {};
        // eslint-disable-next-line no-prototype-builtins
        if (raw.hasOwnProperty('enabled') && !raw.enabled) return false;
        r.message = raw.errorMessage || '';
        r.trigger = 'change';
        if (raw.type === 'required') {
            r.required = true;
        } else if (raw.type === 'range') {
            r.min = raw.min
            r.max = raw.max
        } else if (type === 'pattern') {
            r.pattern = raw.regex
        }
        return r;
    }

    const getRules = (formModel) => {
        const rulesObj = {};
        expandAllGroups(formModel).forEach(f => {
            if (f?.rules?.length) {
                rulesObj[f.id] = []
                f.rules.forEach(r => {
                    const rule = getRule(r)
                    if (rule) {
                        if (f.type === 'number')
                            rule.type = 'integer'
                        rulesObj[f.id].push(rule)
                    }
                })
            }
        })
        console.log(rulesObj)
        return rulesObj;
    }

    // fix for groups
    const handleConditional = () => {
        preProcessedSchema.value.forEach((f, x) => {
            if (f.conditional) {
                const curVal = getValueFromSchemaData(
                    f.conditional.refID
                )
                const reqVal = f.conditional.refValue
                preProcessedSchema.value[x].isVisible =
                    curVal === reqVal
            }
        })
    }

    const getGridClass = (type) => {
        const fullCol = ['group', 'toggle', 'boolean']
        if (fullCol.includes(type)) return 'col-span-full'
        return ''
    }

    const validate = () => {
        formRef.value
            .validate()
            .then(() => {
                console.log('values')
            })
            .catch((error) => {
                console.log('error', error)
            })
    }

    watch(
        preProcessedSchema.value,
        () => {
            handleConditional()
        },
        { immediate: true, deep: true }
    )


    return {
        validate,
        getRules,
        getGridClass,
        handleConditional,
        preProcessedSchema,
        finalConfigObject,
    }
}

