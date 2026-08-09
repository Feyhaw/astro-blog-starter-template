export const prerender = false;

import { evaluateGate } from '../../library/gate';
import { routeQuestion } from '../../library/router';
import { generateAnswer } from '../../library/ai/generate';
import { isLibrarianOnDuty } from '../../library/schedule';

import {
	getArchiveEntries,
	searchEntries,
	findRelatedEntries,
} from '../../library/documents';

function sourceList(sources: { title: string; url: string }[]) {
	return `
<hr>

<div class="materials-consulted">
	<h4>Materials consulted</h4>
	<ul>
		${sources
			.map(
				(source) =>
					`<li>✓ <a href="${source.url}">${source.title}</a></li>`
			)
			.join('')}
	</ul>
</div>
`;
}

export async function POST({ request, locals }: any) {
	const { question, context } = await request.json();

	const entries = await getArchiveEntries();
	const matches = searchEntries(question, entries);

	const gate = evaluateGate(question, matches, context);
	const route = routeQuestion(question, matches, gate);

	const topMatches = matches.slice(0, 3);

	const related = topMatches[0]
		? findRelatedEntries(topMatches[0], entries)
		: [];

	/*
	 * Gate rejection
	 */
	if (!gate.allowed) {
		const answer = `
<p>
This question seems to extend beyond the current collection.
</p>

<p>
I can only speak from materials currently held within Capsule Fey.
</p>

<p>
You may also begin with:
</p>

<ul class="librarian-links">
	<li><a href="/about">About Fey</a></li>
	<li><a href="/cv">CV</a></li>
	<li><a href="/projects">Research and Projects</a></li>
	<li><a href="/arts">Art Creations</a></li>
	<li><a href="/recent">Archive Log</a></li>
</ul>
`;

		return new Response(
			JSON.stringify({
				answer,
				sources: [],
				gate,
				route,
			}),
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

/*
 * Archive matches found
 */

if (route.route === 'CLARIFY') {
	const answer = `
<p>
I found several possible directions within Capsule Fey, but your question is still a little broad.
</p>

<p>
You may wish to narrow it down by naming a specific project, theme, topic, or relationship.
</p>
`;

	return new Response(
		JSON.stringify({
			answer,
			sources: topMatches,
			gate,
			route,
		}),
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
}

if (route.route === 'SYNTHESIZE') {
	const synthesisSources = [
		...topMatches,
		...related,
	].slice(0, 5);

	if (!isLibrarianOnDuty()) {
		const answer = `
<p>
The archive remains open, but the Librarian is currently off duty.
</p>

<p>
Research consultation is available between 10 a.m. and 10 p.m. UK time.
In the meantime, feel free to explore the materials in the archive.
</p>
`;

		return new Response(
			JSON.stringify({
				answer:
					answer +
					sourceList(synthesisSources),
				sources: synthesisSources,
				gate,
				route,
			}),
			{
				headers: {
					'Content-Type':
						'application/json',
				},
			}
		);
	}

	const ai = locals.runtime?.env?.AI;

	if (!ai) {
		throw new Error(
			'Cloudflare AI binding is not available.'
		);
	}

	let aiAnswer = '';

	try {
		aiAnswer = await generateAnswer({
			ai,
			question,
			sources: synthesisSources,
		});
	} catch (error) {
		console.error(
			'Workers AI failed:',
			error
		);

		aiAnswer =
			'I found relevant materials in Capsule Fey, but the synthesis service is temporarily unavailable.';
	}

	const answer = `
<p>${aiAnswer}</p>
`;

	return new Response(
		JSON.stringify({
			answer:
				answer +
				sourceList(synthesisSources),
			sources: synthesisSources,
			gate,
			route,
		}),
		{
			headers: {
				'Content-Type':
					'application/json',
			},
		}
	);
}

if (topMatches.length > 0) {
		const answer = `
<p>
I found ${
			topMatches.length === 1
				? 'one entry'
				: 'several entries'
		} in the archive that may help you begin.
</p>

<ul class="librarian-links">
	${topMatches
		.map(
			(entry) =>
				`<li><a href="${entry.url}">${entry.title}</a></li>`
		)
		.join('')}
</ul>

${
	related.length > 0
		? `
<p>
Related materials:
</p>

<ul class="librarian-links">
	${related
		.map(
			(entry) =>
				`<li><a href="${entry.url}">${entry.title}</a></li>`
		)
		.join('')}
</ul>
`
		: ''
}
`;

		const allSources = [...topMatches, ...related];

		return new Response(
			JSON.stringify({
				answer: answer + sourceList(allSources),
				sources: allSources,

				// Temporary debugging information
				gate,
				route,
			}),
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}

	/*
	 * Fallback
	 */
	const fallbackSources = [
		{
			title: context || 'Capsule Fey Archive',
			url: '/',
		},
		{
			title: 'Research and Projects',
			url: '/projects',
		},
		{
			title: 'Art Creations',
			url: '/arts',
		},
		{
			title: 'About Fey',
			url: '/about',
		},
	];

	const fallbackAnswer = `
<p>
I found some connection to the archive, but not enough material to give you a useful answer yet.
</p>

<p>
You may wish to approach the subject through one of the following sections:
</p>

<ul class="librarian-links">
	<li><a href="/about">About Fey</a></li>
	<li><a href="/cv">CV</a></li>
	<li><a href="/projects">Research and Projects</a></li>
	<li><a href="/arts">Art Creations</a></li>
	<li><a href="/recent">Archive Log</a></li>
</ul>
`;

	return new Response(
		JSON.stringify({
			answer:
				fallbackAnswer +
				sourceList(fallbackSources),

			sources: fallbackSources,

			// Temporary debugging information
			gate,
			route,
		}),
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
}