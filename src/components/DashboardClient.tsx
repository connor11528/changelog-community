"use client"

import { useState } from 'react';
import Link from "next/link";
import { Button, Card, Space, Typography } from "antd";
import { EyeOutlined, GithubOutlined, PlusOutlined } from "@ant-design/icons";
import { getProjectUrl } from "@/lib/utils";
import { GitHubLinkDialog } from '@/components/GitHubLinkDialog';
import { EntryGenerationDialog } from "@/components/EntryGenerationDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import {Project} from "@/types/types";

const { Title } = Typography;

interface DashboardClientProps {
    projects: Project[];
}

export function DashboardClient({ projects }: DashboardClientProps) {
    const [entryProject, setEntryProject] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    return (
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2}>Your Projects</Title>
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
                    <div style={{padding: '16px 24px', display: 'flex', gap: 12}}>
                        <Link target='_blank' href={'https://github.com/' + project.githubRepoOwner + '/' + project.githubRepoName}>
                            { 'https://github.com/' + project.githubRepoOwner + '/' + project.githubRepoName }
                        </Link>
                    </div>
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
                onClose={() => setSelectedProject(null)}
            />
        </Space>
    );
}
