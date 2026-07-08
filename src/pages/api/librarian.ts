export const prerender = false;

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
			.map((source) => `<li>✓ <a href="${source.url}">${source.title}</a></li>`)
			.join('')}
	</ul>
</div>
`;
}

export async function POST({ request }: any) {
	const { question, context } = await request.json();

	const entries = await getArchiveEntries();
	const matches = searchEntries(question, entries);
	const topMatches = matches.slice(0, 3);
	const related = topMatches[0] ? findRelatedEntries(topMatches[0], entries) : [];

	if (topMatches.length > 0) {
		const answer = `
<p>
I found ${topMatches.length === 1 ? 'one entry' : 'several entries'} in the archive that may help you begin.
</p>

<ul class="librarian-links">
	${topMatches
		.map((entry) => `<li><a href="${entry.url}">${entry.title}</a></li>`)
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
		.map((entry) => `<li><a href="${entry.url}">${entry.title}</a></li>`)
		.join('')}
</ul>
`
		: ''
}
`;

		return new Response(
			JSON.stringify({
				answer: answer + sourceList([...topMatches, ...related]),
				sources: [...topMatches, ...related],
			}),
			{
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	const fallbackSources = [
		{ title: context || 'Capsule Fey Archive', url: '/' },
		{ title: 'Research and Projects', url: '/projects' },
		{ title: 'Art Creations', url: '/arts' },
	];

	const fallbackAnswer = `
<p>
This question seems to extend beyond the current collection.
</p>

<p>
I may need to consult Fey for further information. Meanwhile, you are warmly invited to continue the conversation with her in person.
</p>

<p>
You may also begin with:
</p>

<ul class="librarian-links">
	<li><a href="/projects">Research and Projects</a></li>
	<li><a href="/arts">Art Creations</a></li>
	<li><a href="/recent">Recent Writings</a></li>
	<li><a href="/about">About Fey</a></li>
</ul>
`;

	return new Response(
		JSON.stringify({
			answer: fallbackAnswer + sourceList(fallbackSources),
			sources: fallbackSources,
		}),
		{
			headers: { 'Content-Type': 'application/json' },
		}
	);
}