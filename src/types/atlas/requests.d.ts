export type RequestAction = 'approved' | 'rejected'
export type RequestType =
    | 'attribute'
    | 'bm_attribute'
    | 'create_typedef'
    | 'create_glossary'
    | 'create_category'
    | 'create_term'
    | 'term_link'
    | 'attach_classification'

export type RequestStatus = 'approved' | 'rejected' | 'active'

export interface IActionDetails {
    message: string
    timestamp: Date
    userId: string
}

export interface IAssignedApprovers {
    type: 'user' | 'group'
    userId: string
}

export interface IRequestActionBody {
    action: RequestAction
    message?: string
}

export interface RequestAttributes {
    id: string
    version: string
    isSctive: boolean
    createdAt: string
    updatedAt: string
    createdBy: Record<string, any>
    created_by_user: Record<string, any>
    updated_by_user: string
    tenantId: string
    sourceType: 'static' | 'atlas'
    sourceGuid: string
    sourceQualifiedName: string
    sourceAttribute: string
    sourceEntity: assetInterface
    destinationGuid: string
    destinationQualifiedName: string
    destinationAttribute: string
    destinationValue: string
    destinationEntity: assetInterface
    entityType: string
    requestType: RequestType
    confidenceScore: number
    botRunId: string
    approvedBy: IActionDetails[]
    rejectedBy: IActionDetails[]
    status: RequestStatus
    message: string
    requestsBatch: string
    approvalType: string
    assignedApprovers: IAssignedApprovers[]
    payload: any
    accessStartDate: Date
    accessEndDate: Date
}
