
export type Milestone = {
  id: string;
  label: string;
  articleTitle?: string;
  target: string | null;
  finished: string | null;
  completed: boolean;
};

export type Chapter = {
  id: string;
  title: string;
  sections: Milestone[];
};

export const thesisProgress = {
  chapters: [
    {
      id: "chapter-1",
      title: "Chapter 1",
      sections: [
        {
          id: "ch1-1",
          label: "Introduction",
          articleTitle: "Inside an Automatic Machine: Programming of architecture",
          target: "03/2026",
          finished: "02/2026",
          completed: true,
        },
        {
          id: "ch1-2",
          label: "Primary Case Study",
          articleTitle: "Building a Cybernetic Landscape: From the Distant Early Warning Stations to the Manhattan dome",
          target: "12/2025",
          finished: "12/2025",
          completed: true,
        },
        {
          id: "ch1-3",
          label: "Secondary Case Study",
          articleTitle: "Layering confinement: Polar architectures among the 1950s infrastructural programs",
          target: "03/2025",
          finished: "01/2025",
          completed: true,
        },
        {
          id: "ch1-4",
          label: "Conclusion",
          articleTitle: "Towards a New Polar Architecture: The instrument and institution of cybernetic control",
          target: "06/2026",
          finished: "07/2026",
          completed: true,
        },
      ],
    },

    {
      id: "chapter-2",
      title: "Chapter 2",
      sections: [
        {
          id: "ch2-1",
          label: "Introduction",
          articleTitle: "More than house-keeping: Architecture, natural state, and alternative worlds",
          target: "12/2026",
          finished: null,
          completed: false,
        },
        {
          id: "ch2-2",
          label: "Primary Case Study",
          articleTitle: "Metabolizing in the Ice: From Syowa Station to Metabolist capsules",
          target: "11/2026",
          finished: "11/2026",
          completed: true,
        },
        {
          id: "ch2-3",
          label: "Secondary Case Study",
          articleTitle: "Encapsulating the natural state: World engineering at Biosphere 2 Laboratory",
          target: "06/2026",
          finished: "07/2026",
          completed: true,
        },
        {
          id: "ch2-4",
          label: "Conclusion",
          articleTitle: "Home is where it makes sense: Polar architecture as portotype for living machines",
          target: "12/2026",
          finished: null,
          completed: false,
        },
      ],
    },

    {
      id: "chapter-3",
      title: "Chapter 3",
      sections: [
        {
          id: "ch3-1",
          label: "Introduction",
          articleTitle: "Un-Manitested Destiny: Polar architecture in the course of national expansion",
          target: "12/2027",
          finished: null,
          completed: false,
        },
        {
          id: "ch3-2",
          label: "Primary Case Study",
          articleTitle: "Changcheng Extending South: Qingling Station and China’s Antarctic Scheme",
          target: "04/2027",
          finished: null,
          completed: false,
        },
        {
          id: "ch3-3",
          label: "Secondary Case Study",
          articleTitle: "The Tomorrow that never happened: Polar Architecture En Route to the Futures",
          target: "07/2027",
          finished: null,
          completed: false,
        },
        {
          id: "ch3-4",
          label: "Conclusion",
          articleTitle: "The Last Frontier: Polar architecture and the future of human habitation",
          target: "12/2027",
          finished: null,
          completed: false,
        },
      ],
    },
  ] satisfies Chapter[],

  thesisFraming: [
    {
      id: "thesis-introduction",
      label: "Thesis Introduction",
      target: "02/2028",
      finished: null,
      completed: false,
    },
    {
      id: "thesis-conclusion",
      label: "Thesis Conclusion",
      target: "02/2028",
      finished: null,
      completed: false,
    },
  ] satisfies Milestone[],

  finalStages: [
    {
      id: "initial-revision",
      label: "Initial Revision",
      target: "09/2028",
      finished: null,
      completed: false,
    },
    {
      id: "viva",
      label: "Viva",
      target: "09/2028",
      finished: null,
      completed: false,
    },
    {
      id: "final-revision",
      label: "Final Revision",
      target: "12/2028",
      finished: null,
      completed: false,
    },
  ] satisfies Milestone[],

  literature: [
  { category: "Project", reviewed: 113, identified: 122 },
  { category: "Concept", reviewed: 39, identified: 48 },
  { category: "Background", reviewed: 186, identified: 209 },
  { category: "Etymology", reviewed: 3, identified: 4 },
  { category: "Methodology", reviewed: 3, identified: 3 },
],

  
experts: [
  {
    name: "Peter Šenk",
    discipline: "Architecture historian",
    status: "Follow-up",
    notes: "Capsule architecture; Metabolism; Archigram",
  },
  {
    name: "Bilo Stigen",
    discipline: "Practising architect",
    status: "Follow-up",
    notes: "Greenland architecture; Arctic architecture",
  },
  {
    name: "Manuel Guedes",
    discipline: "Civil engineer / Professor",
    status: "Follow-up",
    notes: "Antarctic architecture; Energy transition; Thermal envelope",
  },
  {
    name: "Hugh Broughton",
    discipline: "Practising architect",
    status: "Contacted",
    notes: "Antarctic architecture; Interior design; Confinement",
  },
  {
    name: "Peter Hemmerson",
    discipline: "Architectural historian",
    status: "Contacted",
    notes: "Arctic city planning",
  },
  {
    name: "David Greene",
    discipline: "Professor",
    status: "Planned",
    notes: "Archigram",
  },
  {
    name: "Daniel Barber",
    discipline: "Architecture historian",
    status: "Contacted",
    notes: "Environmental control",
  },
  {
    name: "Japan National Institute of Polar Research",
    discipline: "Government institution",
    status: "Contacted",
    notes: "Living experience",
  },
  {
    name: "Polar Research Institute of China",
    discipline: "Government institution",
    status: "Contacted",
    notes: "Architectural design; Living experience; Policy-making",
  },
  {
    name: "British Antarctic Survey",
    discipline: "Government institution",
    status: "Follow-up",
    notes: "Architectural design; Living experience",
  },
  ] satisfies {
  name: string;
  discipline: string;
  status: "Planned" | "Contacted" | "Consulted" | "Follow-up";
  notes?: string;
  }[],

};
