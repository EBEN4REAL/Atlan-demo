/* eslint-disable no-prototype-builtins */
import { computed, ref, Ref } from 'vue'
import genericAPI from '~/services/api/generic';
import { Schema, ProcessedSchema, ProcessedRule } from './builder.interface'
import { getStringFromPath } from '@/common/input/asyncSelect.utils'


export default function useFormGenerator(formConfig: Ref<Array<Schema>>, formRef: Ref, emit, dV, gV) {
  const processedSchema: Ref<ProcessedSchema[]> = ref([])
  const privateTypes: String[] = ['object', 'array', 'group']

  // @desc gives proper type name for field rules typeName  as required by our validator, @https://github.com/yiminghe/async-validator
  const getPrivateTypeName = (t, mul) => {
    if (mul) return 'Array'
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

  const preProcessSchema = (s: Schema) => {
    const schema: Schema = { ...s }
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

    if (schema?.rules?.length) {
      schema.rules.map(r => {
        const rCopy = r;
        if (rCopy.hasOwnProperty('enabled')) {
          rCopy.enabled = true;
          if (getPrivateTypeName(schema.type, schema?.isMultivalued))
            rCopy.typeName = getPrivateTypeName(schema.type, schema?.isMultivalued);
        }
        return rCopy;
      })
    }


    if (schema.type === 'checkbox' && schema.options) {
      schema.options = schema.options.map(o => ({ value: o.id || o.value, label: o.label || o.id }))
    }

    if (schema.type === 'template')
      schema.isVisible = false
    return schema;
  }



  const expandGroups = (fModal) => {
    let fields: Schema[] = []
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
  const expandOther = (schema: Schema) => {
    let children: ProcessedSchema[] = []
    const parent = schema.id
    const parentType = schema.type

    if (schema.children)
      schema.children.forEach((s: Schema) => {
        // only 1 level nested check
        if (s.type === 'group') {
          children = [
            ...children,
            {
              ...s,
              children: [
                ...(s.children && s.children.map((a) => ({
                  ...a,
                  parent,
                  parentType,
                })) || []),
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
  const getValueFromSchemaData = (id) =>
    testModal.value[id]

  // @desc if isSavedVariables = true, i.e saving variables from async selector directly store in object 
  const setGlobal = (vO, isSavedVariables = false) => { testModal.value = { ...testModal.value, ...(isSavedVariables ? vO : { "$global": vO }) } }

  const generateTemplateValue = (s, id, isStringfied) => {
    if (!processedSchema.value.length) return s
    const finalString = getStringFromPath(testModal.value, s);
    if (finalString)
      testModal.value[id] = finalString && isStringfied ? JSON.parse(finalString as string) : finalString
    else
      testModal.value[id] = undefined
    return testModal.value[id]
  }

  // FIXME enhance,DRY
  const finalConfigObject = (modal, isInit) => {
    // ? modal won't have any type object or array, but groups
    const temp = {}

    modal.forEach((f: ProcessedSchema) => {
      if (f.exclude) return;
      if (f.type !== 'group') {
        // ? if conditional field is hidden dont add
        if (f.conditional && f.conditional.refValue !== getValueFromSchemaData(f.conditional.refID)) return;

        let val = f.type === 'template' ? generateTemplateValue(f.template, f.id, f.isStringified) : getValueFromSchemaData(f.id)
        if (f.includeAll) val = f.includeAllVal
        if (f.stringifyValue) val = JSON.stringify(val)

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
        f.children.forEach((fi: ProcessedSchema) => {
          if (fi.conditional && fi.conditional.refValue !== getValueFromSchemaData(fi.conditional.refID)) return;
          let val = fi.type === 'template' ? generateTemplateValue(fi.template, fi.id, fi.isStringified) : getValueFromSchemaData(fi.id, fi.includeAll)
          if (fi.includeAll) val = fi.includeAllVal
          if (fi.stringifyValue) val = JSON.stringify(val)

          if (typeof val === 'undefined' || val === null) return;
          // ? no groups
          if (fi.parent) {
            if (fi.parentType === 'object') {
              temp[fi.parent] = { ...(temp[fi.parent] || {}) }
              temp[fi.parent][fi.id] = val
            } else if (fi.parentType === 'array') {
              // handdle array
              temp[fi.parent] = [...(temp[fi.parent] || [])]
              temp[fi.parent].push({ key: fi.id, value: val })
            }
          } else {
            temp[fi.id] = val
          }
        })
      }
    })
    emit('change', temp, isInit)
    // eslint-disable-next-line no-console
    // console.table({ config: temp })
    return temp
  }
  const init = () => {
    testModal.value = {}
    processedSchema.value = []
    setGlobal(gV)


    formConfig.value.forEach((f) => {

      if (!privateTypes.includes(f.type)) {
        const o: ProcessedSchema = preProcessSchema(f)
        processedSchema.value.push(o)
        testModal.value[o.id] = o.value
      } else if (f.type === 'group') {
        const pf = { ...f, ...(f.children && { children: f.children.map((fs: Schema) => preProcessSchema(fs)) } || {}) }
        processedSchema.value.push(pf)
        if (f.children)
          f.children.forEach(c => {
            const t = preProcessSchema(c)
            testModal.value[t.id] = t.value
          })
      } else {
        expandOther(f).forEach(o => {
          if (o.type === 'group') {
            const po = { ...o, ...(o.children && { children: o.children.map(c => preProcessSchema(c)) } || {}) }
            processedSchema.value.push(po)
            if (po.children)
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

    testModal.value = { ...testModal.value, ...dV.value }
    finalConfigObject(processedSchema.value, true)

  }




  // rules
  //* get rule object based on antDesign rules guide


  const getRule = (raw): ProcessedRule | false => {
    const r: ProcessedRule = {};
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

  const getRules = computed(() => {
    const rulesObj = {};
    expandGroups(processedSchema.value).forEach(f => {
      if (f?.rules?.length && !f.includeAll) {
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
  })

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


  interface SubmitStatus {
    loading: boolean;
    success: boolean | null;
    error: boolean | null;
    successMessage: string;
    errorMessage: string;
  }
  const submitStatus: Ref<SubmitStatus> = ref({
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
      if (document.location.hostname === 'localhost')
        parsedUrl = parsedUrl.replace('https', 'http')
      const response = await genericAPI(
        parsedUrl,
        method,
        {
          params,
          body: finalConfigObject(processedSchema.value)
        },
      )

      submitStatus.value.success = true;
      submitStatus.value.successMessage = f.apiConfig?.successMessage || 'success'
    } catch (e) {
      submitStatus.value.error = true;
      if (e?.message)
        submitStatus.value.errorMessage = f.apiConfig?.errorMessage || e.message
    }
    submitStatus.value.loading = false;

  }

  const handleInputChange = (v) => {
    // temp fix for glossary 
    if (v) {
      emit('vchange', v)
    }
    handleConditional()
    finalConfigObject(processedSchema.value)
  }

  init()

  return {
    setGlobal,
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