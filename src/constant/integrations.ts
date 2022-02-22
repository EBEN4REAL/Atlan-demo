export const integrations = {
    slack: {
        component: 'slack',
        name: 'Slack',
        id: 'slack',
        description: "Share asset profile, terms, queries with your team 🚀",
        channel_description: "Users will able to share assets, terms and queries only to these channels",
    },
    jira: {
        component: 'Jira',
        name: 'Jira',
        id: 'jira',
        description: "jira integration description",
        placeholder_description: "placeholder_descriptions",

    }
}

export const user_integration_list = {
    slack: {
        name: 'Slack',
        id: 'slack',
        description: 'See rich previews for slack links in resources',
        category: 'Communication'
    },
    jira: {
        name: 'Jira',
        id: 'jira',
        description: 'See rich previews for jira tickets',
        category: 'Collaboration'
    }
}