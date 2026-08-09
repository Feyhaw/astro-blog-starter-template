
const archiveStopWords = new Set([
	'fey',
	'feihao',
	'zhang',
	'capsule',

    // Query grammar
	'the',
	'a',
	'an',
	'is',
	'are',
	'was',
	'were',
	'does',
	'do',
	'did',
	'why',
	'how',
	'what',
	'when',
	'where',
	'who',
	'about',
]);

export type SearchIntent =
	| 'identity'
	| 'timeline'
	| 'career'
	| 'bibliography'
	| 'general';

export function detectSearchIntent(question: string): SearchIntent {
	const q = question.toLowerCase();

	const timelinePatterns = [
		'when',
		'what year',
		'which year',
		'first',
		'timeline',
		'chronology',
	];

	if (timelinePatterns.some((pattern) => q.includes(pattern))) {
		return 'timeline';
	}

	const careerPatterns = [
		'cv',
		'education',
		'degree',
		'university',
		'career',
		'work experience',
		'academic background',
	];

	if (careerPatterns.some((pattern) => q.includes(pattern))) {
		return 'career';
	}

	const bibliographyPatterns = [
		'bibliography',
		'reference',
		'references',
		'source',
		'sources',
		'literature',
	];

	if (bibliographyPatterns.some((pattern) => q.includes(pattern))) {
		return 'bibliography';
	}

	const identityPatterns = [
		'who is fey',
		"who's fey",
		'who is feihao',
		'about fey',
		'about feihao',
	];

	if (identityPatterns.some((pattern) => q.includes(pattern))) {
		return 'identity';
	}

	return 'general';
}

export function normalizeQuery(question: string) {
	return question
		.toLowerCase()
		.split(/\s+/)
		.map((word) =>
			word.replace(/[^\p{L}\p{N}-]/gu, '')
		)
		.filter(Boolean)
		.filter((word) => !archiveStopWords.has(word));
}