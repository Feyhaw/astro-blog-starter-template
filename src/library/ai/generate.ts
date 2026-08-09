import {
	generateWithCloudflare,
	type CloudflareAI,
} from './cloudflare';

type Source = {
	title: string;
	description?: string;
	url: string;

	theme?: string;
	topics?: string[];
	keywords?: string[];
	excerpt?: string;
};

type GenerateAnswerOptions = {
	ai: CloudflareAI;
	question: string;
	sources: Source[];
};

function buildArchiveContext(sources: Source[]) {
	return sources
		.map((source, index) => {
			const parts = [
				`[${index + 1}] ${source.title}`,
				source.description
					? `Description: ${source.description}`
					: '',
				source.theme
					? `Theme: ${source.theme}`
					: '',
				source.topics?.length
					? `Topics: ${source.topics.join(', ')}`
					: '',
				source.keywords?.length
					? `Keywords: ${source.keywords.join(', ')}`
					: '',
				source.excerpt
					? `Archive excerpt: ${source.excerpt}`
	: '',
				`URL: ${source.url}`,
			];

			return parts.filter(Boolean).join('\n');
		})
		.join('\n\n');
}

export async function generateAnswer({
	ai,
	question,
	sources,
}: GenerateAnswerOptions) {
	const context = buildArchiveContext(sources);

	return generateWithCloudflare({
		ai,
		question,
		context,
	});
}