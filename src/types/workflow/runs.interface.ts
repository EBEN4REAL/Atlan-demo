import { Workflow, Node } from './workflow.interface'

export interface ArchivedRuns {
    "uid": String,
    "name": String,
    "started_at": String,
    "finished_at": String,
    "namespace": String,
    "labels": Object,
    "message": null | string,
    "progress": String,
    "resourcesDuration": String,
    "phase": String,
    "workflow": Workflow
}

export interface ArchivedRunsResponse {
    total_record: number,
    filter_record: number,
    records: ArchivedRuns[] | null
}

export interface LiveRun {
    "metadata": {
        "name": string,
        "generateName": string,
        "namespace": string,
        "uid": string,
        "generation": Number,
        "creationTimestamp": string,
        "labels": {
            [key: string]: string
        },
        "managedFields": Array<any>,
    },
    "spec": {
        "arguments": {},
        "workflowTemplateRef": {
            "name": string
        }
    },
    "status": {
        "phase": string,
        "startedAt": string,
        "finishedAt": null | string,
        "estimatedDuration": number,
        "progress": string,
        "nodes": { [key: string]: Node },
    }
}

export interface LiveRunsResponse {
    metadata?: object,
    items: LiveRun[] | null
}