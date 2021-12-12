export function useWorkflowHelper() {
    const getCredentialPropertyList = (configMap) => {
        const list = []
        Object.keys(configMap.properties).forEach((key) => {
            if (configMap.properties[key].ui.widget === 'credential') {
                list.push({ ...configMap.properties[key], key })
            }
        })
        return list
    }
    const getConnectionPropertyList = (configMap) => {
        const list = []
        Object.keys(configMap.properties).forEach((key) => {
            if (configMap.properties[key].ui.widget === 'connection') {
                list.push({ ...configMap.properties[key], key })
            }
        })
        return list
    }

    const getCredentialBody = (configMap, formState, name, param) => {
        const list = getCredentialPropertyList(configMap)

        const modelList = []
        list.forEach((i, index) => {
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
        Object.keys(formState).forEach((key) => {
            if (key.includes(`${propertyId}.extra.`)) {
                extra[key.replace(`${propertyId}.extra.`, '')] = formState[key]
            }
        })
        const authType = formState[`${propertyId}.auth-type`]
        console.log(formState)
        console.log(authType)
        console.log(`${propertyId}.${authType}`)
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

    return {
        getCredentialPropertyList,
        getCredentialBody,
        getConnectionPropertyList,
        getConnectionBody,
        buildCredentialBody,
    }
}
