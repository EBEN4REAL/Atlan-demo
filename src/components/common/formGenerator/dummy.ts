export const dummy2 = [
    {
        id: 'url',
        type: 'template',
        isVisible: false,
        template: 'xx-jdbc:redshift://{{host}}:asdasd{{port}}/{{database}}-xx'
    },
    {
        type: 'boolean',
        id: 'boolean',
        label: 'boolean',
        isVisible: true,
        default: true,
    },
    {
        id: 'test 1',
        type: 'text',
        label: 'test 1',

        isVisible: true,
        conditional: {
            refID: 'boolean',
            refValue: true,
        }
    },
    {
        id: 'test 2',
        type: 'text',
        label: 'test 2',
        isVisible: true,
        conditional: {
            refID: 'boolean',
            refValue: false,
        }
    },
    {
        id: 'credentialGuid',
        type: 'enum',
        label: 'Async Select',
        isVisible: true,
        isAsync: true,
        apiConfig: {
            url: 'http://localhost:3333/api/auth/atlas/tenants/default/search/basic',
            params: {},
            requestBody: {},
        },
        responseConfig: {
            labelPath: '.attributes.displayName',
            valuePath: '.guid'
        }

    },
    {
        type: 'group',
        groupTitle: "Test Group",
        isVisible: true,
        children: [{
            id: "host",
            label: "Host",
            type: "text",
            helpText: "Redshift Cluster Host",
            prefix: "https://",
            placeholder: "",
            isVisible: true,
            default: "",
            rules: [
                {
                    type: "required",
                    enabled: true,
                    errorMessage: "Host name is mandatory"
                }
            ]
        },
        {
            id: "port",
            label: "Port",
            type: "number",
            helpText: "Port",
            placeholder: "Port",
            isVisible: true,
            prefill: true,
            default: "5439",
            rules: [
                {
                    type: "required",
                    enabled: true,
                    errorMessage: "Port is requried"
                }
            ]
        },
        {
            id: "database",
            label: "Database",
            type: "text",
            helpText: "Database to crawl",
            placeholder: "dev",
            isVisible: true,
            default: "dev",
            rules: [
                {
                    type: "required",
                    enabled: true,
                    errorMessage: "Database is mandatory"
                }
            ]
        }]
    },
    {
        id: "auth",
        label: "Authentication Mode",
        type: "toggle",
        default: "basic",
        isVisible: true,
        rules: [],
        options: [
            {
                id: "basic",
                label: "Basic"
            },
            {
                id: "keypair",
                label: "Keypair Authentication"
            }
        ]
    },
    {
        id: "login",
        label: "Username basic",
        type: "text",
        isVisible: true,
        default: "",
        conditional: {
            refID: "auth",
            refValue: "basic"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        id: "password",
        label: "Password basic",
        type: "password",
        isVisible: true,
        default: "",
        conditional: {
            refID: "auth",
            refValue: "basic"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        id: "login",
        label: "Username keypair",
        type: "text",
        isVisible: true,
        default: "",
        isMandatory: true,
        conditional: {
            refID: "auth",
            refValue: "keypair"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        id: "password",
        label: "Private key",
        type: "password",
        isVisible: true,
        conditional: {
            refID: "auth",
            refValue: "keypair"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        id: "keyfile_password",
        label: "Private key password(If set)",
        type: "password",
        isVisible: true,
        conditional: {
            refID: "auth",
            refValue: "keypair"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        type: "object",
        id: "extra",
        children: [
            {
                type: "group",
                groupTitle: "Advanced",
                children: [

                    {
                        "id": "ssl",
                        "label": "SSL",
                        "type": "boolean",
                        isVisible: true,
                        default: true,
                        rule: [
                            {
                                type: "required",
                                enabled: true,
                                errorMessage: ""
                            }
                        ]

                    },
                ]
            }
        ]
    },
    {
        "id": "connType",
        "label": "Connection Type",
        "type": "text",
        "helpText": "Connection Type",
        "placeholder": "redshift",
        "isVisible": false,
        "default": "redshift",
        rules: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
];


export const dummy3 = [
    {
        id: "host",
        label: "Host",
        type: "text",
        helpText: "Redshift Cluster Host",
        prefix: "",
        placeholder: "",
        isVisible: true,
        default: "",
        rules: [
            {
                type: "required",
                enabled: true,
                errorMessage: "Host name is mandatory"
            }
        ]
    },
    {
        id: "port",
        label: "Port",
        type: "number",
        helpText: "Port",
        placeholder: "Port",
        isVisible: true,
        prefill: true,
        default: "5439",
        rules: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        id: "database",
        label: "Database",
        type: "text",
        helpText: "Database to crawl",
        placeholder: "dev",
        isVisible: true,
        default: "dev",
        prefill: true,
        rules: [
            {
                type: "required",
                enabled: true,
                errorMessage: "Database is mandatory"
            }
        ]
    },
    {
        id: "auth",
        label: "Authentication Mode",
        type: "toggle",
        rules: [],
        options: [
            {
                id: "basic",
                label: "Basic"
            },
            {
                id: "keypair",
                label: "Keypair Authentication"
            }
        ]
    },
    {
        id: "login",
        label: "Username",
        type: "text",
        isVisible: true,
        default: "",
        conditional: {
            refID: "auth",
            refValue: "basic"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        id: "password",
        label: "Password",
        type: "password",
        isVisible: true,
        default: "",
        conditional: {
            refID: "auth",
            refValue: "basic"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        id: "login",
        label: "Username",
        type: "text",
        isVisible: true,
        default: "",
        isMandatory: true,
        conditional: {
            refID: "auth",
            refValue: "keypair"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        id: "password",
        label: "Private key",
        type: "password",
        isVisible: true,
        conditional: {
            refID: "auth",
            refValue: "keypair"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        id: "keyfile_password",
        label: "Private key password(If set)",
        type: "password",
        isVisible: true,
        conditional: {
            refID: "auth",
            refValue: "keypair"
        },
        rule: [
            {
                type: "required",
                enabled: true,
                errorMessage: ""
            }
        ]
    },
    {
        type: "group",
        groupTitle: "Advanced",
        children: [
            {
                type: "object",
                id: "extra",
                children: [
                    {
                        id: "role",
                        label: "Default Role",
                        type: "select",
                        helpText:
                            "ACCOUNTADMIN or similar privileged role is required to fetch query history from snowflake to drive adoption and lineage. For more details check docs.atlan.com.",
                        allowCustom: true,
                        options: [
                            {
                                id: "ACCOUNTADMIN",
                                label: "ACCOUNTADMIN"
                            }
                        ],
                        isVisible: true,
                        default: "ACCOUNTADMIN"
                    },
                    {
                        id: "warehouse",
                        label: "Default Warehouse",
                        type: "text",
                        isVisible: true,
                        helpText:
                            "If none is provided, the default warehouse attached to the credential will be used.",
                        placeholder: "COMPUTE_WH",
                        default: ""
                    },
                    {
                        id: "queryTimeout",
                        label: "Query Timeout",
                        helpText: "Zero (0) indicates to wait indefinitely",
                        type: "number",
                        isVisible: false,
                        default: 0,
                        rule: [
                            {
                                type: "required",
                                enabled: false,
                                errorMessage: ""
                            }
                        ]
                    }
                ]
            }
        ]
    }
];