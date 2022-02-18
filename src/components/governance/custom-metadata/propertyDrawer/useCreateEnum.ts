import { ref, watch } from "vue"
import { Form, message } from 'ant-design-vue'
import enumDef from '@/governance/enums/enum.interface'
import { useAddEnums } from '@/governance/enums/composables/useModifyEnums'

const { newEnum, addEnum, reset } = useAddEnums()
export const { error, isReady, state, isLoading } = addEnum

export const formRef = ref<typeof Form>()

const initializeForm: () => enumDef = () => ({
    elementDefs: [],
    category: 'ENUM',
    description: '',
    name: '',
})

export const form = ref(initializeForm())

export const executeCreateEnum = async () => {
    await formRef.value?.validate()
    try {
        const tempForm: any = { ...form.value }
        tempForm.elementDefs = tempForm.elementDefs.map((x, index) => ({
            value: x,
            ordinal: index,
        }))
        newEnum.value = tempForm
        await addEnum.execute()
    } catch { reset() }
}



