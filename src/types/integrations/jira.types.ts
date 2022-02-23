export interface IssueType {
    "avatarId": number,
    "description": string,
    "hierarchyLevel": number,
    "iconUrl": string,
    "id": string,
    "name": string,
    "self": string,
    "subtask": boolean
}

export interface Project {
    "avatarUrls": object,
    "entityId": string,
    "expand": string,
    "id": string,
    "isPrivate": boolean,
    "issueTypes": IssueType[],
    "key": string,
    "name": string,
    "projectTypeKey": string,
    "properties": object,
    "self": string,
    "simplified": boolean,
    "style": string,
    "uuid": string
}

export interface JiraListProjectsResponse {
    "startAt": number,
    "total": number,
    "isLast": boolean,
    "values": Project[]
}