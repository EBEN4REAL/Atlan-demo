import { Ref, watch, ref } from 'vue'
import { ClassificationInterface } from '~/types/classifications/classification.interface'
import { useAudit } from '~/composables/classification/useAudit'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useLinkedByUser } from '~/composables/classification/useLinkedByUser'
import { and } from '@vueuse/core'

dayjs.extend(relativeTime)

export function useLinkedBy(
    classification: Ref<ClassificationInterface>,
    isPropagated: Ref<Boolean>,
    fetchUserDetails = true
) {
    const linkedByUserName = ref('')
    const linkedAt = ref(dayjs().toNow())
    const {
        list: auditList,
        isLoading: isAuditLoading,
        error: auditError,
    } = useAudit(classification)
    const isUserLoading = ref(false)
    const linkedUser = ref({})

    watch(isAuditLoading, () => {
        if (!isAuditLoading.value && auditList.value.length > 0) {
            linkedByUserName.value = auditList.value[0].user
            const created = dayjs(auditList.value[0].created)
            linkedAt.value = dayjs().to(created)
        }
    })

    watch(linkedByUserName, () => {
        if (
            linkedByUserName.value.length === 0 ||
            isPropagated.value ||
            !fetchUserDetails
        ) {
            return
        }

        const { user, isLoading: isUserLoadingInner } =
            useLinkedByUser(linkedByUserName)
        isUserLoading.value = isUserLoadingInner.value

        watch(isUserLoadingInner, () => {
            isUserLoading.value = isUserLoadingInner.value
            linkedUser.value = { ...user.value }
        })
    })

    return {
        linkedBy: linkedUser,
        linkedAt,
        isLoading: and(isUserLoading, isAuditLoading),
        linkedByUserName,
    }
}
