export function useWorkflowHelper() {
    const getCredentialPropertyList = (configMap) => {
        const list = []
        Object.keys(configMap.properties).forEach((key) => {
            if (configMap.properties[key]?.ui?.widget === 'credential') {
                list.push({ ...configMap.properties[key], key })
            }
        })
        return list
    }
    const getConnectionPropertyList = (configMap) => {
        const list = []
        Object.keys(configMap.properties).forEach((key) => {
            if (configMap.properties[key]?.ui?.widget === 'connection') {
                list.push({ ...configMap.properties[key], key })
            }
        })
        return list
    }

    const getCredentialBody = (configMap, formState, name, param) => {
        const list = getCredentialPropertyList(configMap)

        const modelList = []
        list.forEach((i, index) => {
            if (!i?.ui?.hidden) {
                const model = buildCredentialBody(
                    formState,
                    i.key,
                    i.ui.credentialType,
                    `${name}-${index}`
                )
                modelList.push({
                    parameter: `${param}`,
                    type: 'credential',
                    body: model,
                })
                formState[i.key] = `{{${param}}}`
            }
        })
        return modelList
    }

    const getConnectionBody = (configMap, formState) => {
        const list = getConnectionPropertyList(configMap)
        const modelList = []
        list.forEach((i) => {
            const model = {
                attributes: {},
                typeName: 'Connection',
            }
            Object.keys(formState).forEach((key) => {
                if (key.startsWith(`${i.key}.`)) {
                    model.attributes[key.replace(`${i.key}.`, '')] =
                        formState[key]
                }
            })

            modelList.push({
                parameter: i.key,
                type: 'connection',
                body: model,
            })
        })
        return modelList
    }

    const buildCredentialBody = (formState, propertyId, configName, name) => {
        const extra = {}
        const authType = formState[`${propertyId}.auth-type`]

        Object.keys(formState).forEach((key) => {
            if (key.includes(`${propertyId}.extra.`)) {
                extra[key.replace(`${propertyId}.extra.`, '')] = formState[key]
            }
            if (key.includes(`${propertyId}.${authType}.extra.`)) {
                extra[key.replace(`${propertyId}.${authType}.extra.`, '')] =
                    formState[key]
            }
        })

        return {
            name,
            host: formState[`${propertyId}.host`],
            port: parseInt(formState[`${propertyId}.port`]),
            authType,
            username: formState[`${propertyId}.${authType}.username`],
            password: formState[`${propertyId}.${authType}.password`],
            extra,
            connectorConfigName: configName,
        }
    }

    const getCredentialState = (propertyId, credential, formState) => {
        const { authType } = credential

        formState[`${propertyId}.host`] = credential.host
        formState[`${propertyId}.port`] = credential.port?.toString()
        formState[`${propertyId}.auth-type`] = authType
        formState[`${propertyId}.${authType}.username`] = credential.username
        formState[`${propertyId}.${authType}.password`] = credential.password
        Object.keys(credential.extra).forEach((key) => {
            formState[`${propertyId}.extra.${key}`] = credential.extra[key]
        })
    }

    return {
        getCredentialPropertyList,
        getCredentialBody,
        getConnectionPropertyList,
        getConnectionBody,
        buildCredentialBody,
        getCredentialState,
    }
}
