export function useCredential() {
    const buildCredentialBody = (formState, propertyId, configName) => {
        const extra = {}
        Object.keys(formState).forEach((key) => {
            if (key.includes(`${propertyId}.extra.`)) {
                extra[key.replace(`${propertyId}.extra.`, '')] = formState[key]
            }
        })
        const authType = formState[`${propertyId}.auth-type`]
        return {
            host: formState[`${propertyId}.host`],
            port: parseInt(formState[`${propertyId}.port`]),
            authType,
            username: formState[`${propertyId}.${authType}.username`],
            password: formState[`${propertyId}.${authType}.password`],
            extra,
            connectorConfigName: configName,
        }
    }

    return { buildCredentialBody }
}
