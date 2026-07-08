import { getCollection } from 'astro:content';

export type ArchiveType = 'project' | 'art' | 'recent';

export type ArchiveEntry = {
	id: string;
	type: ArchiveType;
	title: string;
	description: string;
	url: string;
	theme: string;
	topics: string[];
	keywords: string[];
};

export async function getArchiveEntries(): Promise<ArchiveEntry[]> {
	const projects = await getCollection('projects');
	const arts = await getCollection('art');
	const recent = await getCollection('recent');

	return [
		...projects.map((item) => ({
			id: item.id,
			type: 'project' as const,
			title: item.data.title,
			description: item.data.description,
			url: `/projects#${item.id}`,
			theme: item.data.theme ?? '',
			topics: item.data.topics ?? [],
			keywords: item.data.keywords ?? [],
		})),

		...arts.map((item) => ({
			id: item.id,
			type: 'art' as const,
			title: item.data.title,
			description: item.data.description,
			url: `/arts#${item.id}`,
			theme: item.data.theme ?? '',
			topics: item.data.topics ?? [],
			keywords: item.data.keywords ?? [],
		})),

		...recent.map((item) => ({
			id: item.id,
			type: 'recent' as const,
			title: item.data.title,
			description: item.data.description,
			url: `/recent/${item.id}/`,
			theme: item.data.theme ?? '',
			topics: item.data.topics ?? [],
			keywords: item.data.keywords ?? [],
		})),
	];
}

function normalize(text: string) {
	return text.toLowerCase().trim();
}

function scoreEntry(question: string, entry: ArchiveEntry) {
	const q = normalize(question);
	let score = 0;

	const title = normalize(entry.title);
	const theme = normalize(entry.theme);
	const topics = entry.topics.map(normalize);
	const keywords = entry.keywords.map(normalize);

	// 1. Direct title match: 最强
	if (title && q.includes(title)) score += 20;

	// 2. Local keyword match: 具体条目命中
	for (const keyword of keywords) {
		if (keyword && q.includes(keyword)) score += 14;
	}

	// 3. Topic match: 制度性/理论性问题
	for (const topic of topics) {
		if (topic && q.includes(topic)) score += 9;
	}

	// 4. Theme match: 大领域
	if (theme && q.includes(theme)) score += 6;

	// 5. Description weak match: 辅助，不主导
	const description = normalize(entry.description);
	for (const word of q.split(/\s+/)) {
		if (word.length > 4 && description.includes(word)) score += 1;
	}

	return score;
}

export function searchEntries(question: string, entries: ArchiveEntry[]) {
	return entries
		.map((entry) => ({
			...entry,
			score: scoreEntry(question, entry),
		}))
		.filter((entry) => entry.score > 0)
		.sort((a, b) => b.score - a.score);
}

export function findRelatedEntries(entry: ArchiveEntry, entries: ArchiveEntry[]) {
	return entries
		.filter((other) => other.id !== entry.id || other.type !== entry.type)
		.map((other) => {
			let score = 0;

			// Same theme: weak relation
			if (entry.theme && other.theme === entry.theme) score += 2;

			// Same topics: stronger relation
			for (const topic of entry.topics) {
				if (other.topics.includes(topic)) score += 5;
			}

			// Same keywords: strongest relation
			for (const keyword of entry.keywords) {
				if (other.keywords.includes(keyword)) score += 8;
			}

			return { ...other, score };
		})
		.filter((entry) => entry.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, 4);
}