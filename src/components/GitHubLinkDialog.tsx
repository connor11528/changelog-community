"use client"

import { useState } from 'react'

interface GitHubLinkDialogProps {
    projectId: string
    isOpen: boolean
    onClose: () => void
}

export function GitHubLinkDialog({ projectId, isOpen, onClose }: GitHubLinkDialogProps) {
    const [repoUrl, setRepoUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            // TODO: handle private repositories using github oauth
            // Extract owner and repo from GitHub URL
            const urlParts = repoUrl.replace(/\.git$/, '').split('/')
            const repoName = urlParts.pop()
            const owner = urlParts.pop()

            if (!owner || !repoName) {
                throw new Error('Invalid GitHub URL')
            }

            const response = await fetch('/api/projects/link-github', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId,
                    owner,
                    repoName,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to link repository')
            }

            onClose()
            window.location.reload()
        } catch (err) {
            console.error(err)
            setError('Failed to link repository')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Link GitHub Repository</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Repository URL
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="https://github.com/owner/repo"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Enter the full URL of your GitHub repository
                        </p>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Linking...' : 'Link Repository'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}