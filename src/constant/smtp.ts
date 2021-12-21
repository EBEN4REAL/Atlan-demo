export const smtp_form = [
    {
        id: 'host',
        type: 'text',
        label: 'Host',
        required: true,
    },
    {
        id: 'port',
        type: 'integer',
        label: 'Port',
        placeholder: 'Defaults to 25',
    },
    {
        id: 'fromDisplayName',
        type: 'text',
        label: 'From Display Name',
    },
    {
        id: 'from',
        label: 'From Email',
        type: 'text',
        required: true,
    },
    {
        id: 'replyToDisplayName',
        type: 'text',
        label: 'Reply To Display Name',
    },
    {
        id: 'replyTo',
        label: 'Reply To',
        type: 'text',
    },
    {
        id: 'ssl',
        type: 'switch',
        label: 'Enable SSL',
    },
    {
        id: 'starttls',
        type: 'switch',
        label: 'Enable Start TLS',
    },
    {
        id: 'auth',
        type: 'switch',
        label: 'Enable Authentication',
    }
]

export const rules = {
    host: [
        {
            required: true,
            message: 'Host is required',
            trigger: 'blur',
        },
    ],
    from: [
        {
            required: true,
            message: 'From email address is required.',
            trigger: 'blur',
        },
        {
            type: 'email',
            message: 'Please enter a valid email address',
            trigger: 'blur',
        },
    ],
    replyTo: [
        {
            type: 'email',
            message: 'Please enter a valid email address',
            trigger: 'blur',
        },
    ],
}

export const default_model = {
    "auth": true,
    "from": "",
    "fromDisplayName": "",
    "host": "",
    "password": "",
    "port": 35,
    "replyTo": "",
    "replyToDisplayName": "",
    "ssl": false,
    "starttls": false,
    "user": ""
}