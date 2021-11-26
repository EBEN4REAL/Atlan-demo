export interface Node {
    "children": string[],
    "displayName": string,
    "estimatedDuration": number,
    "finishedAt": string,
    "id": string,
    "name": string,
    "outboundNodes": string[],
    "phase": string,
    "progress": string,
    "resourcesDuration": {
        "cpu": number,
        "memory": number
    },
    "startedAt": string,
    "templateName": string
    "templateScope": string,
    "type": string
}

export interface Workflow {
    "apiVersion": string,
    "kind": string,
    "metadata": Object,
    "managedFields": Array<Object>,
    "name": string,
    "uid": Srting,

    "spec": {
        "arguments": Object,
        "workflowTemplateRef": {
            "name": string
        }
    },
    "status": {
        "conditions": [
            {
                "status": "False",
                "type": "PodRunning"
            },
            {
                "status": "True",
                "type": "Completed"
            }
        ],
        "estimatedDuration": 20,
        "finishedAt": "2021-11-21T13:30:00Z",
        "nodes": { [key: string]: Node },
        "phase": string,
        "progress": string,
        "resourcesDuration": {
            "cpu": number,
            "memory": number
        },
        "startedAt": string,
        "templates": [
            {
                "dag": {
                    "tasks": [
                        {
                            "arguments": {
                                "parameters": [
                                    {
                                        "name": string,
                                        "value": string
                                    }
                                ]
                            },
                            "name": string,
                            "templateRef": {}
                        }
                    ]
                },
                "inputs": {},
                "metadata": {},
                "name": string,
                "outputs": {}
            }
        ],
        "ttlStrategy": {
            "secondsAfterCompletion": number,
            "secondsAfterFailure": number,
            "secondsAfterSuccess": number
        },
        "workflowTemplateRef": {
            "name": string
        }
    }
}