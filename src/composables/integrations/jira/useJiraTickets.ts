import { computed, ref, Ref, watch } from 'vue'
import { debouncedWatch, useDebounceFn } from '@vueuse/core'
import { Integrations } from '~/services/service/integrations/index'
import { Issue, IssueTypes } from '~/types/integrations/jira.types'

const { jiraSearch, jiraCreateIssue, jiraListIssueTypes, jiraLinkIssue, jiraUnlinkIssue } = Integrations

const searchIssues = (jql, { immediate = true, page_size = 10 }) => {
    const options = {
        asyncOptions: {
            immediate,
            onError: (e) => {
                throw e
            },
        }
    }
    const issues = ref<Issue[]>([])

    const pageSize = ref(page_size)
    const offset = ref(0)
    const totalResults = ref()
    const loadingMore = ref(false)

    const body = computed(() => ({
        jql: jql.value,
        maxResults: pageSize.value,
        startAt: offset.value
    }))

    const { data, isLoading, error, mutate, isReady } = jiraSearch<{ issues: Issue[], total: number }>(body, options)
    watch([isReady, error], (v) => {
        const { issues: _issues, total } = data.value || {}
        if (_issues) {
            if (loadingMore.value)
                issues.value = [...issues.value, ..._issues]
            else issues.value = _issues
            totalResults.value = total
        }

    })

    const pagination = computed(() => ({
        total: Math.ceil(
            totalResults.value / pageSize.value
        ),
        pageSize: pageSize.value,
        current: offset.value / pageSize.value + 1,
    }))

    const loadMore = () => {
        loadingMore.value = true
        offset.value += pageSize.value
        mutate()
    }

    const reset = async () => {
        loadingMore.value = false
        // issues.value = []
        offset.value = 0
        await mutate()
    }

    return { issues, isLoading, error, mutate, isReady, pagination, offset, totalResults, loadMore, reset }
}

export const issuesCount = (onlyLinked = true, immediate = true) => {
    const body = ref({
        "jql": onlyLinked ? "issue.property[atlan].guid != null" : "issue.property[atlan].guid = null OR issue.property[atlan].guid != null",
        "maxResults": 1,
        "startAt": 0
    })

    const options = {
        asyncOptions: {
            immediate,
            onError: (e) => {
                throw e
            },
        }
    }

    const { data, isLoading, error, mutate, isReady } = jiraSearch<{ issues: Issue[], total: number }>(body, options)

    const count = ref()

    watch(data, (v) => {
        if (v)
            count.value = v?.total
    })

    return { count, isLoading, error, mutate, isReady }
}

export const createIssue = (body) => {
    const options = {
        asyncOptions: {
            immediate: false,
            onError: (e) => {
                throw e
            },
        }
    }
    const { data, isLoading, error, mutate, isReady } = jiraCreateIssue(body, options)

    return { data, isLoading, error, mutate, isReady }
}

export const listLinkedIssues = (assetID: Ref<string>) => {
    const jql = computed(() => `(issue.property[atlan].guid = ${assetID.value}) ORDER BY created DESC`)

    return searchIssues(jql, { immediate: false, page_size: 100 })

}

export const listNotLinkedIssues = (assetID: Ref<string>) => {
    const searchText = ref()
    const jql = computed(() => (searchText.value ?
        `(issue.property[atlan].guid != ${assetID.value} OR issue.property[atlan].guid = null) 
                AND (summary ~ \"${searchText.value}*\" OR description ~ \"${searchText.value}*\") AND project in projectsWhereUserHasPermission("Edit Issues")
                ORDER BY created DESC
                `
        : `(issue.property[atlan].guid != ${assetID.value} OR issue.property[atlan].guid = null) AND project in projectsWhereUserHasPermission("Edit Issues")
            ORDER BY created DESC
            `))


    const search = searchIssues(jql, { immediate: false })
    const { mutate, reset } = search

    const searchLoading = ref(false)
    const handleSearch = async () => {
        searchLoading.value = true
        await reset()
        searchLoading.value = false
    }
    const clearSearch = () => {
        searchText.value = ''
        handleSearch()
    }

    return { searchText, searchLoading, clearSearch, handleSearch, ...search }
}


export const listIssueTypes = () => {
    const options = { asyncOptions: { immediate: true } }
    const { data, isLoading, error, mutate } = jiraListIssueTypes<IssueTypes[]>(options)

    return { data, isLoading, error, mutate }
}

export const linkIssue = (_body, id) => {
    const options = {
        asyncOptions: {
            immediate: false,
            onError: (e) => {
                throw e
            },
        }
    }
    const body = computed(() => (
        {
            ..._body.value
        }
    ))

    const issueID = ref(id)

    const pathVariables = computed(() => ({ id: issueID.value }))

    const { data, isLoading, error, mutate, isReady } = jiraLinkIssue(body, pathVariables, options)


    return { data, isLoading, error, mutate, isReady }
}

export const unlinkIssue = (_body, id) => {
    const options = {
        asyncOptions: {
            immediate: true,
            onError: (e) => {
                throw e
            },
        }
    }
    const body = computed(() => (
        {
            ..._body.value
        }
    ))
    const issueID = ref(id)
    const pathVariables = computed(() => ({ id: issueID.value }))
    const { data, isLoading, error, mutate, isReady } = jiraUnlinkIssue(body, pathVariables, options)

    return { data, isLoading, error, mutate, isReady }
}