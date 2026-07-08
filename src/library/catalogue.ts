export const catalogue = [
	{
		keywords: ['antarctica', 'antarctic', 'polar', 'arctic', 'south pole', 'north pole'],
		answer: `
            <p>
            Polar and Antarctic environments appear throughout Fey's research as places where architecture, survival, 
            politics, and imagination meet.
            </p>

            <p>
            A good starting point would be the research archive on polar architecture.
            </p>

            <ul class="librarian-links">
	            <li><a href="/projects#polar">Sheltering Alternative Futures</a></li>
                <li><a href="/projects#dew">Building a Cybernetic Landscape</a></li>
                <li><a href="/projects#contain">Layering Confinement</a></li>
                <li><a href="/projects#unlivable">Living the Unlivable</a></li>
	            <li><a href="/projects">Research and Projects</a></li>
            </ul>

            <p>
            Several artworks were themed around polar exploration and architectures.
            </p>

             <ul class="librarian-links">
	            <li><a href="/arts#alien">Moonwalk</a></li>
                <li><a href="/arts#ice">Push Forward</a></li>
            </ul>
        `,
		sources: [
			{ title: 'Sheltering Alternative Futures', url: '/projects#polar' },
            { title: 'Building a Cybernetic Landscape', url: '/projects#dew' },
            { title: 'Layering Confinement ', url: '/projects#contain' },
            { title: 'Living the Unlivable ', url: '/projects#unlivable' },
			{ title: 'Research and Projects', url: '/projects' },
            { title: 'Art Creations', url: '/arts' },
		],
	},

	{
		keywords: ['mianyang', 'china', 'sichuan', 'city map', 'archive'],
		answer: `
            <p>
            Mianyang appears in Fey's archive through a project on historical maps, rivers, and urban memory. 
            In addition to the research archive, the project also includes a physical installation and a series of publications.
            </p>

            <p>
            This project reconstructs the city as both a physical settlement and a historical record shaped by landscape, 
            defence, and political change. In addition to the research archive, Mianyang is the place where Fey was born 
            and raised, and the project is also a personal exploration of memory, identity, and belonging.
            </p>

            <ul class="librarian-links">
	            <li><a href="/projects#mianyang">Uncovering the Hidden City</a></li>
            </ul>

            <p>
            Several artworks were created in Mianyang, though the city is not reflected in the drawings.
            </p>

            <ul class="librarian-links">
	            <li><a href="/arts#villa">Villa From My Dream</a></li>
            </ul>

        `,
		sources: [
			{ title: 'Uncovering the Hidden City', url: '/projects#mianyang' },
            { title: 'Research and Projects', url: '/projects' },
            { title: 'Art Creations', url: '/arts' },
            
		],
	},

    {
		keywords: ['capsule', 'pod', 'station'],
		answer: `
            <p>
            Capsules appear in Fey's archive through a project on alternative living spaces and architectural experimentation.
            </p>

            <p>
            This project explores the concept of the capsule as both a physical structure and a metaphor for isolation, 
            containment, and human habitation.
            </p>

            <ul class="librarian-links">
	            <li><a href="/projects#biosphere">Encapsulating the natural state</a></li>
            </ul>
        `,
		sources: [
			{ title: 'Encapsulating the natural state', url: '/projects#biosphere' },
            { title: 'Research and Projects', url: '/projects' },
		],
	},

	{
		keywords: ['art', 'drawing', 'illustration', 'portrait', 'gallery'],
		answer: `
            <p>
            Fey's art archive collects drawings, portraits, illustrations, and visual experiments.
            </p>

            <p>
            Unlike the research archive, the art section is arranged more like a small exhibition than a timeline.
            </p>

            <ul class="librarian-links">
	            <li><a href="/arts">Art Creations</a></li>
            </ul>
        `,
		sources: [
            { title: 'Art Creations', url: '/arts' }
        ],
	},

	{
		keywords: ['about', 'fey', 'who are you', 'cv', 'profile'],
		answer: `
            <p>
            Capsule Fey is a living archive of Fey's research, art, writing, and personal reflections.
            </p>

            <p>
            If you would like to understand the person behind the archive, the About and CV pages are good places to begin.
            </p>

            <ul class="librarian-links">
	            <li><a href="/about">About Fey</a></li>
	            <li><a href="/cv">CV</a></li>
            </ul>
        `,
		sources: [
			{ title: 'About Fey', url: '/about' },
			{ title: 'CV', url: '/cv' },
		],
	},
];

export function searchCatalogue(question: string) {
	const lower = question.toLowerCase();

	return catalogue.find((entry) =>
		entry.keywords.some((keyword) => lower.includes(keyword))
	);
}