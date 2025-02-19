import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {openai} from "@/lib/openai";
import {getCurrentUser} from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { commits } = await request.json();
        const {projectId} = await params

        // Get project and verify membership
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                members: {
                    some: {
                        userId: user.id
                    }
                }
            }
        });

        if (!project || !project.githubRepoOwner || !project.githubRepoName) {
            return new NextResponse("Project not found or GitHub not configured", { status: 404 });
        }

        // TODO: run these calls in the background...

        // Fetch detailed commit data including diffs
        const commitDetails = await Promise.all(
            commits.map(async (commit: any) => {
                const response = await fetch(
                    `https://api.github.com/repos/${project.githubRepoOwner}/${project.githubRepoName}/commits/${commit.sha}`,
                    {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json',
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch commit ${commit.sha}`);
                }

                const data = await response.json();
                return {
                    sha: commit.sha,
                    message: commit.message,
                    author: commit.author,
                    date: commit.date,
                    files: data.files?.map((file: any) => ({
                        filename: file.filename,
                        changes: file.patch || '',
                        status: file.status
                    }))
                };
            })
        );

        // Prepare the prompt for the LLM
        const prompt = `You are a technical writer creating a changelog entry. Please analyze these commits and their changes to create a clear, well-structured changelog entry.
        
Repository: ${project.githubRepoOwner}/${project.githubRepoName}

Commits and Changes:
${commitDetails.map(commit => `
Commit: ${commit.message}
Author: ${commit.author}
Date: ${commit.date}
Changes:
${commit.files?.map((file: { filename: any; changes: any; }) => `
- ${file.filename}
${file.changes ? `\`\`\`diff\n${file.changes}\n\`\`\`` : '(Binary file or no diff available)'}`).join('\n')}
`).join('\n')}

Please generate a changelog entry with the following:
1. A concise but descriptive title
2. A brief summary of the overall changes
3. Organized sections grouping related changes
4. Technical details where relevant, but keep it understandable
5. If there are breaking changes, clearly highlight them
6. Use proper markdown formatting

Format the response as JSON with 'title' and 'content' fields.`;

        // Send to OpenAI for processing
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: "You are a technical writer specializing in changelog entries. You write clear, concise, and well-structured changelogs that help developers understand changes."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        // Parse the JSON response
        const generatedEntry = JSON.parse(response.choices[0].message.content || '');

        // Add metadata about the commits
        const entry = {
            ...generatedEntry,
            rawCommits: commitDetails // Include raw commit data for reference
        };

        return NextResponse.json(entry);

    } catch (error) {
        console.error("[GENERATE_ENTRY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
