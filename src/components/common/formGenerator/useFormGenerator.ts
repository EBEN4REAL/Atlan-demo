/* eslint-disable no-prototype-builtins */
import { ref } from 'vue'
import { useAPIPromise } from '~/services/api/useAPI';

export default function useFormGenerator(formConfig, formRef, emit, dV) {
  const processedSchema = ref([])
  const privateTypes = ['object', 'array', 'group']

  const preProcessSchema = (s: object) => {
    const schema = { ...s }
    const falseDefault = ['exclude', 'allowCustom', 'isMultivalued', 'stringified'];
    if (schema.hasOwnProperty('default'))
      schema.value = schema.default
    else schema.default = null
    if (!schema.hasOwnProperty('type'))
      schema.type = 'text'
    if (!schema.hasOwnProperty('isVisible'))
      schema.isVisible = true
    if (!schema.hasOwnProperty('rules'))
      schema.rules = []
    if (schema.type === 'submit')
      schema.exclude = true;

    falseDefault.forEach(d => {
      if (!schema.hasOwnProperty(d))
        schema[d] = false
    })

    if (schema.rules.length) {
      schema.rules.map(r => {
        const rCopy = r;
        if (rCopy.hasOwnProperty('enabled')) {
          rCopy.enabled = true;
          if (getPrivateTypeName(schema.type))
            rCopy.typeName = getPrivateTypeName(schema.type);
        }
        return rCopy;
      })
    }


    if (schema.type === 'checkbox') {
      schema.options = schema.options.map(o => ({ value: o.id || o.value, label: o.label || o.id }))
    }

    return schema;
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
    return typeMap[t] || null
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
  const getValueFromSchemaData = (id) => testModal.value[id]

  const init = () => {
    testModal.value = {}
    processedSchema.value = []


    formConfig.value.forEach((f) => {

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

    testModal.value = { ...testModal.value, ...dV }
  }




  const generateTemplateValue = (s, id, isStringfied) => {
    if (!processedSchema.value.length) return s
    const templatePartsf = s.split('{{')
    let finalString = ''
    // ? ->
    let missingValue = false;
    templatePartsf.forEach((p, i) => {
      if (i === 0) {
        finalString += p
      } else {
        const pp = p.split('}}')
        if (typeof getValueFromSchemaData(pp[0]) === 'undefined') {
          missingValue = true
        }
        finalString += getValueFromSchemaData(pp[0]) + pp[1]
      }
    })
    if (missingValue) return null;
    testModal.value[id] = isStringfied ? JSON.parse(finalString) : finalString
    return testModal.value[id]
  }

  // FIXME enhance,DRY
  const finalConfigObject = (modal) => {
    // ? modal won't have any type object or array, but groups
    const temp = {}

    modal.forEach(f => {
      if (f.exclude) return;
      if (f.type !== 'group') {
        // ? if conditional field is hidden dont add
        if (f.conditional && f.conditional.refValue !== getValueFromSchemaData(f.conditional.refID)) return;

        const val = f.type === 'template' ? generateTemplateValue(f.template, f.id, f.isStringified) : getValueFromSchemaData(f.id)
        if (typeof val === 'undefined' || val === null) return;
        // ? no groups
        if (f.parent) {
          if (f.parentType === 'object') {
            temp[f.parent] = { ...(temp[f.parent] || {}) }
            temp[f.parent][f.id] = val
          } else if (f.parentType === 'array') {
            // handdle array
            temp[f.parent] = [...(temp[f.parent] || [])]
            temp[f.parent].push({ key: f.id, value: val })
          }
        } else {
          temp[f.id] = val
        }
      } else {
        // ? groups
        f.children.forEach(f => {
          if (f.conditional && f.conditional.refValue !== getValueFromSchemaData(f.conditional.refID)) return;

          const val = f.type === 'template' ? generateTemplateValue(f.template, f.id, f.isStringified) : getValueFromSchemaData(f.id)
          if (typeof val === 'undefined' || val === null) return;
          // ? no groups
          if (f.parent) {
            if (f.parentType === 'object') {
              temp[f.parent] = { ...(temp[f.parent] || {}) }
              temp[f.parent][f.id] = val
            } else if (f.parentType === 'array') {
              // handdle array
              temp[f.parent] = [...(temp[f.parent] || [])]
              temp[f.parent].push({ key: f.id, value: val })
            }
          } else {
            temp[f.id] = val
          }
        })
      }
    })
    emit('change', temp)
    console.table(temp)
    return temp
  }


  // rules
  //* get rule object based on antDesign rules guide
  const getRule = (raw) => {
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
    } else if (raw.type === 'regexp') {
      const regex = new RegExp(raw.source, raw.flags)
      r.pattern = regex
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
    return rulesObj;
  }

  // fix for groups
  const handleConditional = () => {
    processedSchema.value.forEach((f, x) => {
      if (f.conditional) {
        const curVal = getValueFromSchemaData(
          f.conditional.refID
        )

        const reqVal = f.conditional.refValue
        if (f.type !== 'template')
          processedSchema.value[x].isVisible =
            curVal === reqVal
      }
    })
  }

  const getGridClass = (type) => {
    return 'col-span-full'
    const fullCol = ['group', 'toggle', 'boolean']
    if (fullCol.includes(type)) return 'col-span-full'
    return ''
  }

  const validate = async () => {
    try {
      await formRef.value.validate()
      return true;
    } catch (e) {
      return false
    }
  }

  const isRequiredField = (f) => f?.rules?.find(r => r.type === 'required')?.enabled ?? false


  const submitStatus = ref({
    loading: false,
    success: null,
    error: null,
    successMessage: "",
    errorMessage: ""
  })

  const handleFormSubmit = async (f) => {
    submitStatus.value = {
      loading: false,
      success: null,
      error: null,
      successMessage: "",
      errorMessage: ""
    }

    const isValid = await validate();
    if (!isValid) return;
    try {
      submitStatus.value.loading = true;
      const { url, method, params } = f.apiConfig
      let parsedUrl = url;
      if (parsedUrl.includes('{{domain}}'))
        parsedUrl = parsedUrl.replace('{{domain}}', document.location.host)
      const response = await useAPIPromise(parsedUrl, method, { params, body: finalConfigObject(processedSchema.value) })
      console.log(response)
      submitStatus.value.success = true;
      submitStatus.value.successMessage = f.apiConfig?.successMessage || 'success'
    } catch (e) {
      submitStatus.value.error = true;
      if (e?.message)
        submitStatus.value.errorMessage = f.apiConfig?.errorMessage || e.message
    }
    submitStatus.value.loading = false;

  }

  const handleInputChange = () => {
    handleConditional()
    finalConfigObject(processedSchema.value)
  }

  init()

  return {
    validate,
    init,
    getRules,
    testModal,
    handleInputChange,
    getGridClass,
    handleConditional,
    handleFormSubmit,
    processedSchema,
    submitStatus,
    isRequiredField,
    finalConfigObject,
  }
}

