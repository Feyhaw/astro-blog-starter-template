import type { GateResult } from './gate';
import type { ArchiveEntry } from './documents';

export type LibrarianRoute =
	| 'OUT_OF_SCOPE'
	| 'DIRECT'
	| 'SYNTHESIZE'
	| 'CLARIFY';

export type RouteResult = {
	route: LibrarianRoute;
	reason: string;
};

type ScoredEntry = ArchiveEntry & {
	score: number;
};

export function routeQuestion(
	question: string,
	matches: ScoredEntry[],
	gate: GateResult
): RouteResult {
	if (!gate.allowed) {
		return {
			route: 'OUT_OF_SCOPE',
			reason: 'Question did not pass the archive gate.',
		};
	}

	const q = question.trim().toLowerCase();

	const topScore = matches[0]?.score ?? 0;

	/*
	 * 1. Explicit navigation / discovery
	 */
	const directPatterns = [
		'who is',
		"who's",
		'where is',
		'where can i find',
		'show me',
		'find',
		'what projects',
		'what research',
		"fey's research",
		'about fey',
		'cv',
	];

	const isDirect = directPatterns.some((pattern) =>
		q.includes(pattern)
	);

	if (isDirect) {
		return {
			route: 'DIRECT',
			reason:
				'Question appears to request archive navigation or discovery.',
		};
	}

	/*
	 * 2. Interpretation / synthesis
	 */
	const synthesisPatterns = [
		'why',
		'how',
		'what does',
		'what do',
		'relationship',
		'relate',
		'related',
		'connection',
		'connect',
		'compare',
		'difference',
		'mean',
		'meaning',
		'explain',
	];

	const wantsSynthesis = synthesisPatterns.some((pattern) =>
		q.includes(pattern)
	);

	if (wantsSynthesis && matches.length >= 1) {
		return {
			route: 'SYNTHESIZE',
			reason:
				'Question asks for interpretation or synthesis of archive material.',
		};
	}

	/*
	 * 3. Short topic query
	 *
	 * e.g.
	 * "polar architecture"
	 * "cybernetics"
	 * "antarctica"
	 */
	const wordCount = q
		.split(/\s+/)
		.filter(Boolean)
		.length;

	const looksLikeTopic =
		wordCount <= 3 &&
		!q.includes('?');

	if (looksLikeTopic && topScore >= 7) {
		return {
			route: 'DIRECT',
			reason:
				'Short query appears to refer to a specific archive topic.',
		};
	}

	/*
	 * 4. Broad exploratory language
	 */
	const broadPatterns = [
		'tell me about',
		'tell me more about',
		'i want to know about',
		'what about',
		'can you tell me about',
	];

	const isBroad = broadPatterns.some((pattern) =>
		q.includes(pattern)
	);

	if (isBroad) {
		return {
			route: 'CLARIFY',
			reason:
				'Question is relevant to the archive but covers a broad subject.',
		};
	}

	/*
	 * 5. Strong single archive match
	 *
	 * If the query is not explicitly asking for synthesis,
	 * one very strong result can still be returned directly.
	 */
	if (topScore >= 12) {
		return {
			route: 'DIRECT',
			reason:
				'One archive entry appears strongly relevant to the query.',
		};
	}

	/*
	 * 6. Default:
	 * relevant, but intent is not clear enough.
	 */
	return {
		route: 'CLARIFY',
		reason:
			'Archive relevance exists, but the intended subject is ambiguous.',
	};
}