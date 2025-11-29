export const sampleRecords = [
  {
    id: 'sample-1',
    projectName: 'Language Automation Fix',
    category: 'Automation',
    team: ['Ops', 'Platform'],
    startDate: '2024-02-01',
    endDate: '2024-02-20',
    status: 'Completed',
    problem: {
      what: 'Manual language validation workflow taking too much ops time.',
      why: 'High-volume tasks with frequent SLA breaches and inconsistent outcomes.',
    },
    contribution: {
      summary:
        'Designed and implemented an automated language validation pipeline with Playwright tests.',
      responsibilities: ['Requirement understanding', 'Designing solution', 'Development', 'Testing & QA'],
    },
    tech: {
      languages: ['Python'],
      frameworks: ['Playwright'],
      infrastructure: ['Internal servers'],
    },
    impact: [
      {
        metric: 'Time per task',
        before: '15 mins',
        after: '5 mins',
        improvement: '66% faster',
      },
      {
        metric: 'Error rate',
        before: '8%',
        after: '1%',
        improvement: 'Reduced by 87%',
      },
    ],
    hoursSavedPerMonth: 18,
    usersImpacted: 6,
    bugsFixed: 3,
    manualStepsEliminated: 4,
    aiValueAdd: {
      features: [],
      outcome: '',
    },
    beforeText:
      'Ops team manually validated language combinations across multiple screens; frequent rework and SLA misses.',
    afterText:
      'Automated validation suite runs on every build; ops only handle flagged edge cases.',
    evidence: [],
    feedback: [],
    finalBullet:
      'Automated the language validation workflow using Python and Playwright, saving ~18 hours/month and eliminating 4 manual steps for 6 ops users.',
    createdAt: '2024-02-21T10:00:00.000Z',
    updatedAt: '2024-02-21T10:00:00.000Z',
  },
  {
    id: 'sample-2',
    projectName: 'Doc Processing AI',
    category: 'AI',
    team: ['Ops', 'AI'],
    startDate: '2024-03-01',
    endDate: '2024-03-25',
    status: 'Completed',
    problem: {
      what: 'Manual document processing and classification for incoming client files.',
      why: 'Slow turnaround time and high cognitive load on ops.',
    },
    contribution: {
      summary: 'Built an internal AI-powered document processing and classification tool.',
      responsibilities: [
        'Requirement understanding',
        'Designing solution',
        'AI model integration',
        'Development',
        'Testing & QA',
        'Deployment',
      ],
    },
    tech: {
      languages: ['Python'],
      frameworks: ['FastAPI'],
      infrastructure: ['OpenAI API'],
    },
    impact: [
      {
        metric: 'Hours saved per month',
        before: '-',
        after: '40 hours',
        improvement: '40 hours saved/month',
      },
      {
        metric: 'Manual steps',
        before: '9 steps',
        after: '2 steps',
        improvement: 'Eliminated 7 steps',
      },
    ],
    hoursSavedPerMonth: 40,
    usersImpacted: 15,
    bugsFixed: 0,
    manualStepsEliminated: 7,
    aiValueAdd: {
      features: ['Text extraction', 'Entity matching', 'Summaries', 'NLP-based classification'],
      outcome:
        'Removed manual judgement for routine cases, improved decision speed, and ensured consistent classifications.',
    },
    beforeText:
      'Ops manually opened each document, read content, tagged metadata, and routed to the right queue.',
    afterText:
      'AI service auto-classifies documents and pre-fills metadata, with ops only confirming edge cases.',
    evidence: [],
    feedback: [],
    finalBullet:
      'Built an internal document processing AI service using Python and FastAPI, saving ~40 hours/month, eliminating 7 manual steps, and helping 15 ops users.',
    createdAt: '2024-03-26T09:30:00.000Z',
    updatedAt: '2024-03-26T09:30:00.000Z',
  },
]
