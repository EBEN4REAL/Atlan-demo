import usePermissions from '~/composables/auth/usePermissions'
import useTenant from '~/composables/tenant/useTenant'

/**
 * It fetches the tenant and permissions configs and returns the responses
 * @returns An array of responses.
 */

const fetchConfigs = async () => {
    const { mutate } = useTenant(false)
    const { mutate: mutatePermissions } = usePermissions(false)
    try {
        const allConfigPromisses = [mutate(), mutatePermissions()]
        const responsesArray = await Promise.all(allConfigPromisses)
        return responsesArray
    } catch (error) {
        console.error(error)
        throw (error)
    }

}

export default fetchConfigs