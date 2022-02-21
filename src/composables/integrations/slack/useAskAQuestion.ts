import { ref } from "vue"

export const resourceId = ref('')

export const onSlackModalSuccess = (response) => {
    console.log('onSlackModalSuccess')

    const { linkGuid } = response

    if (linkGuid)
        resourceId.value = linkGuid
}