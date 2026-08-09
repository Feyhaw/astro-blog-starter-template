import { getCollection } from 'astro:content';
import { normalizeQuery, detectSearchIntent,} from './search';

export type ArchiveType =
	| 'project'
	| 'art'
	| 'recent'
	| 'page';

export type ArchiveRole =
	| 'profile'
	| 'cv'
	| 'timeline'
	| 'bibliography'
	| 'project'
	| 'artwork'
	| 'log';

export type ArchiveEntry = {
	id: string;
	type: ArchiveType;
	role?: ArchiveRole;

	title: string;
	description: string;
	url: string;
	theme: string;
	topics: string[];
	keywords: string[];

	abstract?: string;
	excerpt?: string;
};

export async function getArchiveEntries(): Promise<ArchiveEntry[]> {
	const projects = await getCollection('projects');
	const arts = await getCollection('art');
	const recent = await getCollection('recent');
	const manualEntries: ArchiveEntry[] = [
	{
		id: 'about',
		type: 'page',
		role: 'profile',
		title: 'About Fey',
		description:
			'An introduction to Feihao Zhang (Fey), her background, research interests, and the purpose of Capsule Fey.',
		url: '/about',
		theme: 'Identity and Practice',
		topics: ['Biography', 'Research', 'Background'],
		keywords: [
			'Fey',
			'Feihao',
			'Feihao Zhang',
			'About',
			'Who is Fey',
		],
	},

	{
		id: 'cv',
		type: 'page',
		role: 'cv',
		title: 'CV',
		description:
			'Academic background, education, work experience, research experience, projects, and professional history of Feihao Zhang.',
		url: '/cv',
		theme: 'Academic Profile',
		topics: ['Education', 'Research', 'Experience'],
		keywords: [
			'CV',
			'Curriculum Vitae',
			'Feihao Zhang',
			'Education',
			'work',
			'career',
			'experience',
			'Academic background',
		],
	},
];

	return [
	...manualEntries,

	...projects.map((item) => ({
		id: item.id,
		type: 'project' as const,
		role: 'project' as const,
		title: item.data.title,
		description: item.data.description,
		url: `/projects#${item.id}`,
		theme: item.data.theme ?? '',
		topics: item.data.topics ?? [],
		keywords: item.data.keywords ?? [],

		abstract: item.data.abstract ?? '',
		
		excerpt: item.body
			?.replace(/[#>*_`]/g, '')
			.replace(/\s+/g, ' ')
			.trim()
			.slice(0, 1200) ?? '',
	})),

	...arts.map((item) => ({
		id: item.id,
		type: 'art' as const,
		role: 'artwork'as const,
		title: item.data.title,
		description: item.data.description,
		url: `/arts#${item.id}`,
		theme: item.data.theme ?? '',
		topics: item.data.topics ?? [],
		keywords: item.data.keywords ?? [],

		excerpt: item.body
			?.replace(/[#>*_`]/g, '')
			.replace(/\s+/g, ' ')
			.trim()
			.slice(0, 1200) ?? '',
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

		excerpt: item.body
			?.replace(/[#>*_`]/g, '')
			.replace(/\s+/g, ' ')
			.trim()
			.slice(0, 1200) ?? '',
	})),
	];
}

function normalize(text: string) {
	return text.toLowerCase().trim();
}

function scoreEntry(question: string, entry: ArchiveEntry) {
	// Full original question:
	// used for special intent detection such as "Who is Fey?"
	const q = normalize(question);

	// Search-oriented version:
	// removes Fey / Feihao / Zhang / grammar words
	const queryWords = normalizeQuery(question);
	const searchQuery = queryWords.join(' ');
	const searchIntent = detectSearchIntent(question);

	let score = 0;

	const title = normalize(entry.title);
	const theme = normalize(entry.theme);
	const topics = entry.topics.map(normalize);
	const keywords = entry.keywords.map(normalize);
	const description = normalize(entry.description);

	/*
	 * Identity intent
	 *
	 * Full question is intentionally used here,
	 * because "Fey" matters when the user is actually asking who Fey is.
	 */
	const identityPatterns = [
		'who is fey',
		"who's fey",
		'who is feihao',
		'who is feihao zhang',
		'about fey',
		'about feihao',
		'about feihao zhang',
	];

	const isIdentityQuery = identityPatterns.some((pattern) =>
		q.includes(pattern)
	);

	if (isIdentityQuery && entry.type === 'page') {
		score += 18;
	}

	/*
	 * From this point onward, use searchQuery rather than q.
	 *
	 * Example:
	 *
	 * "Why does Fey study polar architecture?"
	 *
	 * becomes:
	 *
	 * "study polar architecture"
	 */

	if (
		searchIntent === 'timeline' &&
		entry.role === 'timeline'
	) {
		score += 20;
	}

	if (
		searchIntent === 'career' &&
		entry.role === 'cv'
	) {
		score += 20;
	}
	if (
		searchIntent === 'bibliography' &&
		entry.role === 'bibliography'
	) {
		score += 20;
	}

	if (
		searchIntent === 'identity' &&
		entry.role === 'profile'
	) {
		score += 20;
	}

	// 1. Direct title match: strongest
	if (title && searchQuery.includes(title)) {
		score += 20;
	}

	// 2. Local keyword match
	for (const keyword of keywords) {
		if (keyword && searchQuery.includes(keyword)) {
			score += 14;
		}
	}

	// 3. Topic match
	for (const topic of topics) {
		if (topic && searchQuery.includes(topic)) {
			score += 9;
		}
	}

	// 4. Theme match
	if (theme && searchQuery.includes(theme)) {
		score += 6;
	}

	// 5. Description weak match
	for (const word of queryWords) {
		if (
			word.length > 4 &&
			description.includes(word)
		) {
			score += 1;
		}
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