export const integrations = {
    slack: {
        component: 'slack',
        name: 'Slack',
        id: 'slack',
        description: 'Share asset profile, terms, queries with your team 🚀',
        channel_description:
            'Users will able to share assets, terms and queries only to these channels',
        workflow_description:
            'Users will able to see all Workflows related alerts in this channel',
        query_output_description:
            'Users will able share query output and link only to these channels.',
    },
    jira: {
        component: 'Jira',
        name: 'Jira',
        id: 'jira',
        description:
            'Create and Link jira issues to assets and easily access them from asset profile ',
        project_description:
            'Select default project for linking new issues to Atlan assets',
    },
}

export const user_integration_list = {
    slack: {
        name: 'Slack',
        id: 'slack',
        description: 'See rich previews for slack links in resources',
        category: 'Communication',
    },
    jira: {
        name: 'Jira',
        id: 'jira',
        description: 'Create & Link issues to assets from asset sidebar',
        category: 'Collaboration',
    },
}
