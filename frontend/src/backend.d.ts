import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ProjectSubmission {
    id: bigint;
    files: Array<ExternalBlob>;
    status: ProjectStatus;
    deliveryDescription?: string;
    clientName: string;
    messages: Array<Message>;
    projectDescription: string;
    submittedBy: Principal;
    deliveryLink?: string;
    email: string;
    statusComment?: string;
    timestamp: bigint;
    companyName: string;
    budget: ProjectBudgetRange;
    timeline: string;
}
export interface Message {
    text: string;
    sender: string;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
    company: string;
}
export enum ProjectBudgetRange {
    range50_100kNOK = "range50_100kNOK",
    range10_50kNOK = "range10_50kNOK",
    range1_10kNOK = "range1_10kNOK",
    range100kPlusNOK = "range100kPlusNOK"
}
export enum ProjectStatus {
    new_ = "new",
    completed = "completed",
    followup = "followup",
    reviewed = "reviewed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDeliveryLink(projectId: bigint, link: string, description: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createUserProfile(profile: UserProfile): Promise<void>;
    getAllMessages(): Promise<Array<[bigint, Array<Message>]>>;
    getAllSubmissions(): Promise<Array<ProjectSubmission>>;
    getAllUserMessages(): Promise<Array<[bigint, Array<Message>]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProjectFiles(projectId: bigint): Promise<Array<ExternalBlob>>;
    getProjectMessages(projectId: bigint): Promise<Array<Message>>;
    getSubmission(projectId: bigint): Promise<ProjectSubmission>;
    getSubmissionsByClient(clientName: string): Promise<Array<ProjectSubmission>>;
    getSubmissionsByStatus(status: ProjectStatus): Promise<Array<ProjectSubmission>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjects(): Promise<Array<ProjectSubmission>>;
    isCallerAdmin(): Promise<boolean>;
    markAsCompleted(projectId: bigint, comment: string | null): Promise<void>;
    markAsFollowup(projectId: bigint, comment: string | null): Promise<void>;
    markAsInProgress(projectId: bigint, comment: string | null): Promise<void>;
    markAsReviewed(projectId: bigint, comment: string | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(projectId: bigint, sender: string, text: string): Promise<void>;
    submitAuthenticatedProject(clientName: string, companyName: string, email: string, projectDescription: string, timeline: string, budget: ProjectBudgetRange, files: Array<ExternalBlob>): Promise<{
        projectId: bigint;
        timestamp: bigint;
    }>;
    submitProject(clientName: string, companyName: string, email: string, projectDescription: string, timeline: string, budget: ProjectBudgetRange): Promise<{
        projectId: bigint;
        timestamp: bigint;
    }>;
    updateUserProfile(profile: UserProfile): Promise<void>;
}
