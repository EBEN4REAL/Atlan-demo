import { computed, ref, Ref, watch } from 'vue'
import { R } from '../../../../node_modules/.vite/prosemirror-image-plugin';
import { debouncedWatch, useDebounce } from '@vueuse/core'
import { Integrations } from '~/services/service/integrations/index'
import { Issue, IssueTypes } from '~/types/integrations/jira.types'

const { jiraSearch, jiraListIssueTypes, jiraLinkIssue } = Integrations

const searchIssues = (jql, immediate = true) => {
    const options = { asyncOptions: { immediate } }
    const issues = ref<Issue[]>([])

    const pageSize = ref(10)
    const offset = ref(0)
    const totalResults = ref()

    const body = computed(() => ({
        jql: jql.value,
        maxResults: pageSize.value,
        startAt: offset.value
    }))

    const { data, isLoading, error, mutate, isReady } = jiraSearch<{ issues: Issue[], total: number }>(body, options)
    watch([data, error, isLoading], (v) => {
        issues.value = []
        if (data.value) {
            const { issues: _issues, total } = data.value || []
            issues.value = _issues
            totalResults.value = total
        }
    })

    const searchLoading = ref(false)
    debouncedWatch(body, async () => {
        searchLoading.value = true
        await mutate()
        searchLoading.value = false
    },
        { deep: true, debounce: 500 }
    )

    const pagination = computed(() => ({
        total: Math.ceil(
            totalResults.value / pageSize.value
        ),
        pageSize: pageSize.value,
        current: offset.value / pageSize.value + 1,
    }))

    return { issues, isLoading, error, mutate, isReady, searchLoading, pagination, offset }
}

export const listLinkedIssues = (assetID: Ref<string>) => {

    const jql = computed(() => `(issue.property[atlan].guid = ${assetID.value}) ORDER BY created DESC`)

    return searchIssues(jql)

}

export const listNotLinkedIssues = (assetID: Ref<string>) => {

    const searchText = ref()

    const jql = computed(() => (searchText.value ?
        `(issue.property[atlan].guid != ${assetID.value} OR issue.property[atlan].guid = null) 
                AND summary ~ \"${searchText.value}*\"
                ORDER BY created DESC
                `
        : `(issue.property[atlan].guid != ${assetID.value} OR issue.property[atlan].guid = null) 
            ORDER BY created DESC
            `))

    return { searchText, ...searchIssues(jql, false) }
}


export const listIssueTypes = () => {

    const options = { asyncOptions: { immediate: true } }
    const { data, isLoading, error, mutate } = jiraListIssueTypes<IssueTypes[]>(options)

    return { data, isLoading, error, mutate }
}

export const linkIssue = (_body, id) => {
    const options = { asyncOptions: { immediate: true } }
    const body = computed(() => (
        {
            ..._body.value
        }
    ))

    const issueID = ref(id)

    const pathVariables = computed(() => ({ id: issueID.value }))

    const { data, isLoading, error, mutate, isReady } = jiraLinkIssue(body, pathVariables, options)
    // const call = async (_id) => {
    //     issueID.value = _id
    //     await mutate()
    // }

    return { data, isLoading, error, mutate, isReady }
}