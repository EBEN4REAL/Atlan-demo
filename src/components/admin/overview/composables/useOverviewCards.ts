import { ref, computed } from 'vue'
import { pluralizeString, capitalizeFirstLetter } from '~/utils/string'
import { useUsers } from '~/composables/user/useUsers'
import useGroups from '~/composables/group/useGroups'
import useAPIKeysList from '~/components/governance/apikeys/composables/useAPIKeysList'
import { useTenantStore } from '~/store/tenant'

export default function useOverviewCards() {
    const overviewCards = []
    /** Users */
    const { totalUserCount, isLoading: isUserCountLoading } = useUsers({
        limit: 1,
        offset: 0,
    })
    const userCard = {
        id: 'user',
        icon: 'User',
        displayName: 'Users',
        value: totalUserCount.value,
        valueText: `${pluralizeString(
            'user',
            totalUserCount.value,
            false
        )} added`,
        emptyText: 'No users added',
        link: '/admin/users',
        isUserCountLoading,
    }
    overviewCards.push(userCard)

    /** Groups */
    const { totalGroupsCount } = useGroups({
        limit: 1,
        offset: 0,
    })
    const groupCard = {
        id: 'group',
        icon: 'GroupStatic',
        displayName: 'Groups',
        value: totalGroupsCount.value,
        valueText: `${pluralizeString(
            'group',
            totalGroupsCount.value,
            false
        )} added`,
        link: '/admin/groups',
        emptyText: 'No groups added',
    }
    overviewCards.push(groupCard)

    /** SSO */
    const tenantStore = useTenantStore()
    const identityProviders = computed(() => tenantStore.identityProviders)
    const ssoCard = {
        id: 'sso',
        icon: 'SSO',
        displayName: 'SSO',
        value: !identityProviders.value.length
            ? ''
            : capitalizeFirstLetter(identityProviders.value?.[0].alias),
        valueText: 'SAML provider',
        link: '/admin/sso',
        emptyText: 'No providers connected',
    }
    overviewCards.push(ssoCard)

    /** SMTP Card */
    // will always be enabled
    const smtpCard = {
        id: 'smtp',
        icon: 'SMTP',
        displayName: 'SMTP',
        valueText: 'Configuration enabled',
        emptyText: 'Configuration enabled',
        value: true,
        link: '/admin/smtp',
        excludeValueInCopy: true,
    }
    overviewCards.push(smtpCard)

    /** API Keys */
    const { totalAPIKeysCount, isLoading: isAPIKeyCountLoading } =
        useAPIKeysList(
            ref({
                limit: 1,
                offset: 0,
            })
        )
    const apiKeyCard = {
        id: 'apiKey',
        icon: 'APIKey',
        displayName: 'API Keys',
        value: totalAPIKeysCount.value,
        valueText: `${pluralizeString(
            'key',
            totalAPIKeysCount.value,
            false
        )} generated`,
        emptyText: 'No keys generated',
        link: '/governance/apikeys',
        isAPIKeyCountLoading,
    }
    overviewCards.push(apiKeyCard)

    return { overviewCards }
}
