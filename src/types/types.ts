export interface Project {
    id: string;
    subdomain: string;
    githubRepoOwner?: string | null;
    githubRepoName?: string | null;
    githubToken?: string | null;
}