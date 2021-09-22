/* eslint-disable no-prototype-builtins */
import { ref, Ref, watch, computed } from 'vue'



export default function useFormGenerator(formConfig, formRef) {
    const processedSchema = ref([])
    const privateTypes = ['object', 'array', 'group']

    const preProcessSchema = (s: object) => {
        const schema = { ...s }
        const falseDefault = ['exclude', 'allowCustom', 'isMultivalued', 'stringified'];
        if (schema.hasOwnProperty('default'))
            schema.value = schema.default
        else schema.default = null
        if (!schema.hasOwnProperty('type'))
            schema.exclude = 'text'
        if (!schema.hasOwnProperty('isVisible'))
            schema.isVisible = true
        if (!schema.hasOwnProperty('rules'))
            schema.rules = []

        falseDefault.forEach(d => {
            if (!s.hasOwnProperty(d))
                schema[d] = false
        })

        if (schema.rules.length) {
            schema.rules.map(r => {
                const rCopy = r;
                if (!rCopy.hasOwnProperty('enaled')) {
                    rCopy.enabled = true;
                    rCopy.typeName = getPrivateTypeName(schema.type);
                }
                return rCopy;
            })
        }

        return schema;
    }

    const expandGroups = (fModal) => {
        let fields = []
        fModal.forEach((f) => {
            if (f.type === 'group') {
                fields = [...fields, ...f.children]
            } else {
                fields.push(f)
            }
        })
        return fields
    }


    const getPrivateTypeName = (t) => {
        const typeMap = {
            number: 'integer',
            text: 'string',
            textArea: 'string',
            pattern: 'regexp',
            password: 'string',
            dateTime: 'date',
        }
        return typeMap[t] || t
    }

    const getValueFromSchemaData = (id) =>
        expandGroups(processedSchema.value).find(
            (s) => s.id === id
        ).value

    // improve this to go deeper than 1 level
    //* expands fields of type object schema, array <> flattens it
    const expandOther = (schema) => {
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
                        children: [
                            ...s.children.map((a) => ({
                                ...a,
                                parent,
                                parentType,
                            })),
                        ],
                    },
                ]
            } else {
                children.push(
                    {
                        ...s, parent, parentType,
                    }
                )
            }
        })
        return children
    }


    const testModal = ref({});

    formConfig.forEach((f) => {

        if (!privateTypes.includes(f.type)) {
            const o = preProcessSchema(f)
            processedSchema.value.push(o)
            testModal.value[o.id] = o.value
        } else if (f.type === 'group') {
            const pf = { ...f, children: f.children.map(f => preProcessSchema(f)) }
            processedSchema.value.push(pf)
            f.children.forEach(c => {
                const t = preProcessSchema(c)
                testModal.value[t.id] = t.value
            })
        } else {
            expandOther(f).forEach(o => {
                if (o.type === 'group') {
                    const po = { ...o, children: o.children.map(c => preProcessSchema(c)) }
                    processedSchema.value.push(po)
                    po.children.forEach(c => {
                        testModal.value[c.id] = c.value
                    })
                } else {
                    const x = preProcessSchema(o)
                    processedSchema.value.push(x)
                    testModal.value[x.id] = x.value
                }
            })
        }
    })




    const generateSring = (s) => {
        if (!processedSchema.value.length) return s
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

    // FIXME turn this into fn, use testModal, check exclude, add path, 
    const finalConfigObject = computed(() => {
        const temp = {}
        expandGroups(processedSchema.value).forEach((s) => {
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
        console.log({ raw })
        const r = {};
        // eslint-disable-next-line no-prototype-builtins
        if (!raw.enabled) return false;
        r.message = raw.errorMessage || '';
        r.trigger = 'change';
        if (raw.type === 'required') {
            r.required = true;
        } else if (raw.type === 'range') {
            r.min = raw.min
            r.max = raw.max
        } else if (type === 'regexp') {
            r.pattern = raw.regex
        }
        r.type = raw.typeName
        return r;
    }

    const getRules = (formModel) => {
        const rulesObj = {};
        expandGroups(formModel).forEach(f => {
            if (f.rules.length) {
                rulesObj[f.id] = []
                f.rules.forEach(r => {
                    const rule = getRule(r)
                    if (rule) {
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
        processedSchema.value.forEach((f, x) => {
            if (f.conditional) {
                // const curVal = getValueFromSchemaData(
                //     f.conditional.refID
                // )

                const curVal = testModal.value[f.conditional.refID]

                const reqVal = f.conditional.refValue
                processedSchema.value[x].isVisible =
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

    const isRequiredField = (f) => f?.rules?.find(r => r.type === 'required')?.enabled ?? false

    watch(
        testModal.value,
        () => {
            handleConditional()
        },
        { immediate: true, deep: true }
    )


    return {
        validate,
        getRules,
        testModal,
        getGridClass,
        handleConditional,
        processedSchema,
        isRequiredField,
        finalConfigObject,
    }
}

