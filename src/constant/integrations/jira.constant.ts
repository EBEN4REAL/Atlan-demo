export const CREATE_TICKET_FORM_RULES = {
    project: [
        {
            required: true,
            message: 'Project is required',
            trigger: ['submit', 'change'],
        },
    ],
    issuetype: [
        {
            required: true,
            message: 'Issue type is required',
            trigger: ['submit', 'change'],
        },
    ],
    summary: [
        {
            required: true,
            message: 'Summary is required',
            trigger: ['submit', 'change'],
        },
    ]

}