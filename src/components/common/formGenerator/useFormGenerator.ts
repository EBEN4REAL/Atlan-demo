/* eslint-disable no-prototype-builtins */
import { ref, Ref, watch, computed, reactive } from 'vue'
import { useAPIPromise } from '~/api/useAPI';

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
    console.log('FinalConfigGenerated: ')
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

  const x = [
    {
      "label": "Account Identifier",
      "type": "text",
      "id": "account",
      "placeholder": "xxx.<region>",
      "isVisible": true,
      "isMandatory": true,
      "helpText": "Follow this [snowflake doc](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html) to get your account identifier",
      "rules": [
        {
          "type": "required",
          "enabled": true,
          "errorMessage": "Account identifier is mandatory"
        },
        {
          "type": "regexp",
          "source": "(^|\\s)([\\w-]+(\\.[\\w-]+)+\\.?(:\\d+)?(\\/\\S*)?)",
          "flags": "gm",
          "enabled": true,
          "errorMessage": "Account Identifier is not valid"
        }
      ]
    },
    {
      "label": "Snowflake JDBC template",
      "type": "template",
      "id": "url",
      "isStringified": false,
      "template": "jdbc:snowflake://{{account}}.snowflakecomputing.com?loginTimeout=5&networkTimeout=5&application=atlan",
      "isVisible": false
    },
    {
      "id": "authType",
      "label": "Authentication Mode",
      "type": "toggle",
      "default": "basic",
      "isVisible": true,
      "rules": [],
      "options": [
        {
          "id": "basic",
          "label": "Basic"
        },
        {
          "id": "keypair",
          "label": "Keypair Authentication"
        }
      ]
    },
    {
      "id": "username",
      "label": "Username",
      "type": "text",
      "isVisible": true,
      "isMandatory": true,
      "conditional": {
        "refID": "authType",
        "refValue": "basic"
      },
      "rule": [
        {
          "type": "required",
          "enabled": true,
          "errorMessage": "Username is mandatory"
        }
      ]
    },
    {
      "id": "password",
      "label": "Password basic",
      "type": "password",
      "isMandatory": true,
      "isVisible": true,
      "conditional": {
        "refID": "authType",
        "refValue": "basic"
      },
      "rule": [
        {
          "type": "required",
          "enabled": true,
          "errorMessage": "Password is mandatory"
        }
      ]
    },
    {
      "id": "username",
      "label": "Username",
      "type": "text",
      "isVisible": true,
      "isMandatory": true,
      "conditional": {
        "refID": "authType",
        "refValue": "keypair"
      },
      "rule": [
        {
          "type": "required",
          "enabled": true,
          "errorMessage": "Username is mandatory"
        }
      ]
    },
    {
      "id": "private_key_file",
      "label": "Private Key",
      "type": "password",
      "isMandatory": true,
      "isVisible": true,
      "conditional": {
        "refID": "authType",
        "refValue": "keypair"
      },
      "rule": [
        {
          "type": "required",
          "enabled": true,
          "errorMessage": "Private key is mandatory"
        }
      ]
    },
    {
      "id": "private_key_file_pwd",
      "label": "Private key password (If set)",
      "type": "password",
      "isVisible": true,
      "isMandatory": false,
      "conditional": {
        "refID": "authType",
        "refValue": "keypair"
      }
    },
    {
      "id": "driverProperties",
      "label": "Driver Properties",
      "conditional": {
        "refID": "authType",
        "refValue": "basic"
      },
      "type": "template",
      "isStringified": true,
      "isVisible": false,

      "template": "{\"username\": \"{{username}}\", \"passsword\": \"{{password}}\"}"
    },
    {
      "id": "driverProperties",
      "label": "Driver Properties",
      "conditional": {
        "refID": "authType",
        "refValue": "keypair"
      },
      "isStringified": true,
      "type": "template",
      "isVisible": false,
      "template": "{\"username\": \"{{username}}\", \"private_key_file\": \"{{private_key_file}}\", \"private_key_file_pwd\": \"{{private_key_file_pwd}}\"}"
    },
    {
      "type": "object",
      "id": "extra",
      "visible": true,
      "children": [
        {
          "type": "group",
          "groupTitle": "Advanced",
          "isVisible": true,
          "children": [
            {
              "id": "role",
              "label": "Role",
              "type": "enum",
              "helpText": "Snowflake role to use as default",
              "placeholder": "ACCOUNTADMIN",
              "default": "ACCOUNTADMIN",
              "isVisible": true,
              "allowCustom": true,
              "options": [
                { "id": "ACCOUNTADMIN", "value": "ACCOUNTADMIN" },
                { "id": "ACCOUNTADMIN", "value": "SYSADMIN" }
              ]
            },
            {
              "id": "warehouse",
              "type": "asyncSelect",
              "label": "Warehouse",
              "isVisible": true,
              "placeholder": "COMPUTE_WH",
              "default": "COMPUTE_WH",
              "requestConfig": {
                "url": "https://{{domain}}/api/sql/query/test",
                "method": "POST",
                "params": {},
                "addFormValues": ["url", "driverProperties", "authType"],
                "body": {
                  "className": "net.snowflake.client.jdbc.SnowflakeDriver",
                  "connector": "snowflake",
                  "query": "show warehouses"
                }
              },
              "responseConfig": {
                "rootPath": ".results",
                "labelPath": ".attributes.displayName",
                "valuePath": ".guid"
              }
            },
            {
              "id": "query_timeout",
              "label": "Query Timeout (in seconds)",
              "type": "number",
              "helpText": "Default query timeout for the credential. Zero (0) indicates to wait indefinitely",
              "placeholder": "COMPUTE_WH",
              "default": 0,
              "isVisible": true
            }
          ]
        }
      ]
    }
  ]

  return {
    validate,
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

