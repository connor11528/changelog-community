import { useState } from 'react';
import { Modal, DatePicker, Button, Checkbox, Form, Input, Space, Typography } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import Link from "next/link";
import {Project} from "@/types/types";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Title } = Typography;

interface Commit {
    sha: string;
    message: string;
    author: string;
    date: string;
    type?: string; // for conventional commits
}

interface EntryGenerationDialogProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
}

export function EntryGenerationDialog({ project, isOpen, onClose }: EntryGenerationDialogProps) {
    const [step, setStep] = useState<'dateRange' | 'commits' | 'preview'>('dateRange');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, dayjs()]);
    const [commits, setCommits] = useState<Commit[]>([]);
    const [selectedCommits, setSelectedCommits] = useState<Set<string>>(new Set());
    const [entry, setEntry] = useState<{ title: string; content: string }>();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)

    const fetchCommits = async () => {
        if (!dateRange[0]) {
            return;
        }

        const from = dateRange[0].toISOString();
        const to = (dateRange[1] || dayjs()).toISOString();

        const response = await fetch(`/api/projects/${project.id}/commits?${new URLSearchParams({
            from,
            to,
        })}`);
        const data = await response.json();
        setCommits(data);
        setSelectedCommits(new Set(data.map((c: Commit) => c.sha)));
        setStep('commits');
    };

    const generateEntry = async () => {
        setIsLoading(true)
        try {
            const selectedCommitData = commits.filter(c => selectedCommits.has(c.sha));
            const response = await fetch(`/api/projects/${project.id}/generate-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commits: selectedCommitData }),
            });
            const data = await response.json();
            setEntry(data);
            form.setFieldsValue(data);
            setStep('preview');
        } catch (e) {
            console.error('Error generating entry:', e);
        } finally {
            setIsLoading(false)
        }
    };

    const handlePublish = async (isDraft: boolean = false) => {
        try {
            setIsLoading(true)
            const values = await form.validateFields();
            const response = await fetch(`/api/projects/${project.id}/entries/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: values.title,
                    content: values.content,
                    isDraft,
                    fromCommits: commits.filter(c => selectedCommits.has(c.sha)),
                    startDate: dateRange[0]?.toISOString(),
                    endDate: dateRange[1]?.toISOString(),
                }),
            });

            if (response.ok) {
                onClose();
            }
        } catch (error) {
            console.error('Error publishing entry:', error);
        } finally {
            setIsLoading(false)
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'dateRange':
                return (
                    <Form layout="vertical">
                        <Form.Item
                            label="Select Date Range"
                            required
                        >
                            <RangePicker
                                style={{ width: '100%' }}
                                value={dateRange}
                                onChange={(dates) => {
                                    setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]);
                                }}
                                defaultValue={[null, dayjs()]}
                            />
                        </Form.Item>
                    </Form>
                );

            case 'commits':
                return (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {commits.map((commit: Commit) => (
                                <div key={commit.sha} style={{ padding: '12px', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
                                    <Checkbox
                                        checked={selectedCommits.has(commit.sha)}
                                        onChange={(e) => {
                                            const newSelected = new Set(selectedCommits);
                                            if (e.target.checked) {
                                                newSelected.add(commit.sha);
                                            } else {
                                                newSelected.delete(commit.sha);
                                            }
                                            setSelectedCommits(newSelected);
                                        }}
                                    >
                                        <Space direction="vertical" size={1}>
                                            <Typography.Text strong>
                                                <Link target="_blank" href={`https://github.com/${project.githubRepoOwner}/${project.githubRepoName}/commit/` + commit.sha}>
                                                    {commit.message}
                                                </Link>
                                            </Typography.Text>
                                            <Typography.Text type="secondary">
                                                    {commit.author} • {new Date(commit.date).toLocaleDateString()}
                                            </Typography.Text>
                                        </Space>
                                    </Checkbox>
                                </div>
                            ))}
                        </Space>
                    </div>
                );

            case 'preview':
                return (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'Please enter a title' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="content"
                            label="Content"
                            rules={[{ required: true, message: 'Please enter content' }]}
                        >
                            <TextArea rows={10} />
                        </Form.Item>
                    </Form>
                );
        }
    };

    const renderFooterButtons = () => {
        switch (step) {
            case 'dateRange':
                return [
                    <Button
                        key="continue"
                        type="primary"
                        onClick={fetchCommits}
                        disabled={!dateRange[0]}
                    >
                        Continue
                    </Button>
                ];

            case 'commits':
                return [
                    <Button key="back" onClick={() => setStep('dateRange')}>
                        Back
                    </Button>,
                    <Button
                        key="generate"
                        type="primary"
                        onClick={generateEntry}
                        disabled={selectedCommits.size === 0}
                        loading={isLoading}
                    >
                        Generate Entry
                    </Button>
                ];

            case 'preview':
                return [
                    <Button key="back" onClick={() => setStep('commits')}>
                        Back
                    </Button>,
                    <Button key="draft" onClick={() => handlePublish(true)} loading={isLoading}>
                        Save as Draft
                    </Button>,
                    <Button key="publish" type="primary" onClick={() => handlePublish(false)} loading={isLoading}>
                        Publish
                    </Button>
                ];
        }
    };

    return (
        <Modal
            title={"Generate Entry"}
            open={isOpen}
            onCancel={onClose}
            width={800}
            footer={renderFooterButtons()}
        >
            {renderStepContent()}
        </Modal>
    );
}