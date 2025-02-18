import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {openai} from "@/lib/openai";

export async function PUT(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { content, tone, focus } = await request.json();

        // Create a prompt for regeneration with specific instructions
        const prompt = `Please rewrite this changelog entry with the following preferences:
        Tone: ${tone} (e.g., technical, casual, detailed)
        Focus: ${focus} (e.g., user-facing changes, technical details, security)

        Original Content:
        ${content}

        Please maintain the same basic information but adjust the style and focus as requested.
        Format the response as JSON with 'title' and 'content' fields.`;

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

        const regeneratedEntry = JSON.parse(response.choices[0].message.content || '');
        return NextResponse.json(regeneratedEntry);

    } catch (error) {
        console.error("[REGENERATE_ENTRY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}