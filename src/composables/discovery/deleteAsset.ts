import { watch, ref } from 'vue'
import { Entity } from '~/services/meta/entity/index'
import { message } from 'ant-design-vue'

const deleteAsset = (guid: string) => {
    const error = ref<any>()

    const { data, error: deleteError, isLoading } = Entity.DeleteEntity(guid)

    watch(deleteError, (newError) => {
        error.value = newError
    })
    return { data, deleteError, isLoading }
}

export default deleteAsset
