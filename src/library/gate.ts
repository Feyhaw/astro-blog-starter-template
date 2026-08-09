import type { ArchiveEntry } from './documents';

export type GateResult = {
	allowed: boolean;
	reason: 'archive-match' | 'archive-context' | 'out-of-scope';
	confidence: number;
};

export function evaluateGate(
	question: string,
	matches: (ArchiveEntry & { score: number })[],
	context?: string
): GateResult {
	const q = question.trim().toLowerCase();

	if (!q) {
		return {
			allowed: false,
			reason: 'out-of-scope',
			confidence: 0,
		};
	}

	// Strong direct archive match
	const strongestScore = matches[0]?.score ?? 0;

	if (strongestScore >= 12) {
		return {
			allowed: true,
			reason: 'archive-match',
			confidence: 1,
		};
	}

	// Several weaker relationships together
	const combinedScore = matches
		.slice(0, 3)
		.reduce((sum, entry) => sum + entry.score, 0);

	if (combinedScore >= 14) {
		return {
			allowed: true,
			reason: 'archive-match',
			confidence: 0.75,
		};
	}

	// Questions asked from a specific archive page can get
	// a slightly softer threshold.
	if (context && context !== 'Capsule Fey' && strongestScore >= 6) {
		return {
			allowed: true,
			reason: 'archive-context',
			confidence: 0.6,
		};
	}

	return {
		allowed: false,
		reason: 'out-of-scope',
		confidence: 0,
	};
}