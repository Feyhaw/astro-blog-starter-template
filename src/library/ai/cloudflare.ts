export type CloudflareAI = {
	run: (
		model: string,
		input: {
			messages: {
				role: 'system' | 'user' | 'assistant';
				content: string;
			}[];
			max_tokens?: number;
			temperature?: number;
		}
	) => Promise<{
		response?: string;
	}>;
};

type GenerateWithCloudflareOptions = {
	ai: CloudflareAI;
	question: string;
	context: string;
};

export async function generateWithCloudflare({
	ai,
	question,
	context,
}: GenerateWithCloudflareOptions) {
	const messages = [
		{
			role: 'system' as const,
			content: `
			You are the Librarian of Capsule Fey.

			You are not a general-purpose chatbot.

			Answer only from the archive materials provided to you.

			Your task is to synthesize relationships, ideas, and themes within Capsule Fey.

			Important rules:

			1. Begin by answering the user's question directly.
			2. Do not simply list archive entries one by one.
			3. Use archive entries as evidence for a broader synthesis.
			4. Distinguish clearly between:
			   - what the archive explicitly states,
			   - what the archive strongly suggests,
			   - and what remains uncertain.
			5. Do not invent historical facts, intentions, motivations, or causal relationships.
			6. If the archive materials only weakly support a relationship, say so.
			7. Prefer cautious phrases such as:
			   "the archive suggests",
			   "this may indicate",
		   "the material does not explicitly establish".
			8. Keep the answer concise and structured in 2–4 short paragraphs.
			9. Do not mention that you are an AI model.

			When appropriate, begin with:
			"Within Capsule Fey..."
			`.trim(),
		},
		
	{
		role: 'user' as const,
			content: `
			QUESTION:
			${question}

			ARCHIVE MATERIAL:
			${context}

			TASK:
			Answer the question by synthesizing the supplied archive material.
			Do not summarize each source separately unless necessary.
			Focus on the relationship the question asks about.
			`.trim(),
	},
	];

	const result = await ai.run(
		'@cf/meta/llama-3.1-8b-instruct-fast',
		{
			messages,
			max_tokens: 300,
			temperature: 0.3,
		}
	);

	return result.response?.trim() || '';
}