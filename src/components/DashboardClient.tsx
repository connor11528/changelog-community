"use client"

import { useState } from 'react';
import Link from "next/link";
import { Button, Card, Space, Typography } from "antd";
import {EyeOutlined, GithubOutlined, PlusOutlined, WarningOutlined} from "@ant-design/icons";
import { getProjectUrl } from "@/lib/utils";
import { GitHubLinkDialog } from '@/components/GitHubLinkDialog';
import { EntryGenerationDialog } from "@/components/EntryGenerationDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import {Project} from "@/types/types";
import Icon from "antd/es/icon";

const { Title } = Typography;

interface DashboardClientProps {
    projects: Project[]
}

export function DashboardClient({ projects: initialProjects }: DashboardClientProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [entryProject, setEntryProject] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const handleRepositoryUpdate = (projectId: string, updatedRepo: { owner: string, name: string }) => {
        setProjects(currentProjects =>
            currentProjects.map(project =>
                project.id === projectId
                    ? {
                        ...project,
                        githubRepoOwner: updatedRepo.owner,
                        githubRepoName: updatedRepo.name
                    }
                    : project
            )
        );
        setSelectedProject(null);
    };

    return (
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2}>Your Changelogs</Title>
            </div>
            {!projects ? (<LoadingSpinner />) : projects.map((project) => (
                <Card
                    key={project.id}
                    style={{
                        borderRadius: 8,
                        padding: 0
                    }}
                >
                    <Card.Meta
                        title={project.subdomain + '.changelog.community'}
                        style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}
                    />
                    {project.githubRepoOwner && project.githubRepoName ? (
                        <div className="p-4 px-6 flex gap-3">
                            <Link target='_blank'
                                  href={'https://github.com/' + project.githubRepoOwner + '/' + project.githubRepoName}>
                                {'https://github.com/' + project.githubRepoOwner + '/' + project.githubRepoName}
                            </Link>
                        </div>
                        ) : (
                        <div className="p-4 px-6 flex gap-3 italic text-yellow-500">
                            <WarningOutlined /> Please link a public GitHub repo in order to generate new changelog entries
                        </div>
                    )}
                    <div style={{ padding: '16px 24px', display: 'flex', gap: 12 }}>
                        <Button
                            icon={<EyeOutlined />}
                            href={getProjectUrl(project.subdomain)}
                        >
                            View Changelog
                        </Button>
                        <Button
                            icon={<GithubOutlined />}
                            onClick={() => setSelectedProject(project.id)}
                        >
                            {project.githubRepoName ? 'Change Repository' : 'Link GitHub'}
                        </Button>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => setEntryProject(project)}
                            disabled={!project.githubRepoName}
                        >
                            Generate Entry
                        </Button>
                    </div>
                </Card>
            ))}

            {/*TODO: create a new project flow.. */}

            {/*MODALS*/}
            {entryProject && (
                <EntryGenerationDialog
                    project={entryProject}
                    isOpen={!!entryProject}
                    onClose={() => setEntryProject(null)}
                />
            )}
            <GitHubLinkDialog
                projectId={selectedProject!}
                isOpen={!!selectedProject}
                onCloseAction={() => setSelectedProject(null)}
                onSuccessAction={handleRepositoryUpdate}
            />
        </Space>
    );
}
