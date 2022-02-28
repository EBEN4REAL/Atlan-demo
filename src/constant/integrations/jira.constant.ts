export const CREATE_TICKET_FORM_RULES = {
    projectId: [
        {
            required: true,
            message: 'Project is required',
            trigger: ['submit', 'change'],
        },
    ],
    issueType: [
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
    ],
    description: [
        {
            required: true,
            message: 'Description is required',
            trigger: ['submit', 'change'],
        },
    ],
}