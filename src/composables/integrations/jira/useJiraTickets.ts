import { computed, ref, Ref, watch } from 'vue'
import { Integrations } from '~/services/service/integrations/index'
import { Issue, IssueTypes } from '~/types/integrations/jira.types'

const { jiraSearch, jiraListIssueTypes } = Integrations


export const listLinkedIssues = (assetID: Ref<string>) => {

    const options = {
        asyncOptions: { immediate: true }
    }

    const body = computed(() => ({
        // ? jql query that matches property "atlan" 's guid with current provided guid
        "jql": `
            (issue.property[atlan].guid = ${assetID.value}) 
            ORDER BY created DESC
            `
    }))

    const issues = ref<Issue[]>([])

    const { data, isLoading, error, mutate } = jiraSearch<{ issues: Issue[] }>(body, options)


    watch([data, error], () => {
        if (data.value) {
            const { issues: _issues } = data.value
            issues.value = _issues
        }
    })

    return { issues, isLoading, error, mutate }

}

export const listIssueTypes = () => {

    const options = {
        asyncOptions: { immediate: true }
    }

    const { data, isLoading, error, mutate } = jiraListIssueTypes<IssueTypes[]>(options)

    return { data, isLoading, error, mutate }
}