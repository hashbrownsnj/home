// ─────────────────────────────────────────────────────────────────
// Single source of truth for the /apply experience.
// Adding a new way to get involved should mostly mean adding one
// entry to APPLICATION_PATHS (and, if it needs its own questions,
// one array of fields) — not touching the form components.
// ─────────────────────────────────────────────────────────────────

export const DEPARTMENTS = [
  {
    id: 'outreach',
    name: 'Outreach',
    tagline: 'Grow Hash Browns beyond its walls',
    description:
      'Outreach is the face of Hash Browns to the outside world — the department that turns strangers into members and members into ambassadors.',
    responsibilities: [
      'Social media',
      'Partnerships',
      'Recruiting',
      'Influencer outreach',
      'Sponsor outreach',
      'Marketing',
      'Community awareness',
      'Connecting with other organizations and communities',
    ],
  },
  {
    id: 'operations',
    name: 'Operations',
    tagline: 'Keep the org running like it should',
    description:
      'Operations is the backbone that keeps everything else possible — the systems, the logistics, the follow-through that turns ideas into things that actually happen.',
    responsibilities: [
      'Internal organization',
      'Managing systems',
      'Managing forms',
      'Volunteer coordination',
      'Event logistics',
      'Chapter support',
      'Internal processes',
      'Keeping the organization running smoothly',
    ],
  },
  {
    id: 'offensive-learning',
    name: 'Offensive Learning',
    tagline: 'Ethical hacking, taught right',
    description:
      'Offensive Learning builds the curriculum and competition prep that teaches people to think like attackers — always ethically, always legally, always authorized.',
    responsibilities: [
      'Ethical hacking education',
      'CTF preparation',
      'Web security',
      'Penetration testing concepts',
      'Offensive cybersecurity concepts',
      'Educational curriculum',
    ],
  },
  {
    id: 'defensive-learning',
    name: 'Defensive Learning',
    tagline: 'Defense, detection, and the fundamentals',
    description:
      'Defensive Learning teaches people to protect systems, spot incidents, and build the fundamentals every cybersecurity student needs — no matter where they end up specializing.',
    responsibilities: [
      'Blue team concepts',
      'Incident response concepts',
      'Security awareness',
      'Defensive cybersecurity education',
      'Cybersecurity fundamentals',
      'Educational curriculum',
    ],
  },
]

const DEPARTMENT_OPTIONS = DEPARTMENTS.map((d) => ({ value: d.id, label: d.name }))

// ─────────────────────────────────────────────────────────────────
// APPLICATION PATHS
// Each path is one card on the page and one branch of the form.
// `roleFields` = Step 3 (role-specific), `experienceFields` = Step 4.
// ─────────────────────────────────────────────────────────────────

export const APPLICATION_PATHS = [
  {
    id: 'department',
    title: 'Department Leadership',
    short: 'Help run Outreach, Operations, Offensive Learning, or Defensive Learning.',
    detail:
      'For people who want real responsibility early — running programs, not just attending them.',
    glyph: '01',
    estTime: '10–15 min',
    roleFields: [
      {
        name: 'department',
        label: 'Which department are you applying for?',
        type: 'select',
        required: true,
        options: DEPARTMENT_OPTIONS,
      },
      {
        name: 'departmentFit',
        label: 'Why are you a good fit for this department?',
        type: 'textarea',
        required: true,
        placeholder: 'What draws you to this specific department?',
      },
      {
        name: 'positionFit',
        label: 'Is there a specific focus or role within it you\u2019re aiming for, and why?',
        type: 'textarea',
        required: true,
        placeholder: 'e.g. leading sponsor outreach, running CTF prep, managing chapter support...',
      },
      {
        name: 'ideas',
        label: 'What ideas do you have for improving or growing Hash Browns?',
        type: 'textarea',
        required: false,
        helper: 'Optional, but leadership applications with a real idea attached stand out.',
      },
    ],
    experienceFields: 'leadership',
  },
  {
    id: 'chapter',
    title: 'Start a Chapter',
    short: 'Create and lead a Hash Browns chapter in your school, library, or community.',
    detail:
      'For people ready to build something local from scratch and keep showing up for it.',
    glyph: '02',
    estTime: '15–20 min',
    roleFields: [
      {
        name: 'hostLocation',
        label: 'Where do you plan to host your chapter?',
        type: 'text',
        required: true,
        placeholder: 'e.g. Lincoln High School, Elm Street Public Library...',
      },
      {
        name: 'locationType',
        label: 'What type of location will the chapter operate through?',
        type: 'select',
        required: true,
        options: [
          { value: 'school', label: 'A school' },
          { value: 'library', label: 'A library' },
          { value: 'community-center', label: 'A community center' },
          { value: 'independent-group', label: 'An independently organized local group' },
          { value: 'other', label: 'Another local meeting space' },
        ],
      },
      {
        name: 'recruitmentPlan',
        label: 'How do you plan on finding and recruiting members near you?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'whyStartChapter',
        label: 'Why do you want to start a Hash Browns chapter?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'impactGoal',
        label: 'How do you want to make an impact in your community?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'expectedMembers',
        label: 'How many members do you realistically expect to start with?',
        type: 'select',
        required: true,
        options: [
          { value: '1-2', label: 'Just me, maybe one other person' },
          { value: '3-5', label: '3–5 people' },
          { value: '6-10', label: '6–10 people' },
          { value: '10+', label: '10+ people' },
        ],
      },
      {
        name: 'meetingFrequency',
        label: 'How often do you expect to meet?',
        type: 'select',
        required: true,
        options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Every other week' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'irregular', label: 'Irregular, event-based' },
        ],
      },
      {
        name: 'chapterGoals',
        label: 'What goals do you have for your chapter?',
        type: 'textarea',
        required: true,
      },
    ],
    experienceFields: 'leadership',
  },
  {
    id: 'member',
    title: 'Join as a Member or Competitor',
    short: 'Learn, compete, find teammates, or plug into a chapter near you.',
    detail: 'For anyone who wants in — no experience required, no résumé needed.',
    glyph: '03',
    estTime: '5 min',
    roleFields: [
      {
        name: 'experienceLevel',
        label: 'How would you describe your experience level?',
        type: 'select',
        required: true,
        options: [
          { value: 'complete-beginner', label: 'Complete beginner' },
          { value: 'some-experience', label: 'Beginner with some experience' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
          { value: 'experienced-competitor', label: 'Experienced competitor' },
        ],
      },
      {
        name: 'participationInterests',
        label: 'What are you hoping to participate in?',
        type: 'checkboxGroup',
        required: true,
        options: [
          { value: 'ctfs', label: 'CTFs' },
          { value: 'hackathons', label: 'Hackathons' },
          { value: 'learning', label: 'Learning cybersecurity fundamentals' },
          { value: 'events', label: 'Events and workshops' },
          { value: 'teammates', label: 'Finding teammates' },
          { value: 'chapter-community', label: 'A local chapter community' },
        ],
      },
      {
        name: 'lookingForTeam',
        label: 'Are you looking for a team?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'maybe', label: 'Not sure yet' },
        ],
      },
      {
        name: 'lookingForChapter',
        label: 'Are you looking for a chapter near you?',
        type: 'radio',
        required: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No, joining the broader community is enough for now' },
          { value: 'none-nearby', label: 'I\u2019d like one, but there isn\u2019t one near me' },
        ],
      },
    ],
    experienceFields: 'light',
  },
  {
    id: 'team',
    title: 'Join or Form a Team',
    short: 'For people specifically chasing CTFs, hackathons, and a squad to do it with.',
    detail: 'Compete under the Hash Browns name, solo track or building a team from zero.',
    glyph: '04',
    estTime: '5–10 min',
    roleFields: [
      {
        name: 'teamStatus',
        label: 'What are you looking for?',
        type: 'select',
        required: true,
        options: [
          { value: 'join-existing', label: 'Looking to join an existing team' },
          { value: 'form-team', label: 'Interested in forming a team' },
          { value: 'via-chapter', label: 'Joining through a chapter' },
          { value: 'individual', label: 'Individual competitor looking for opportunities' },
        ],
      },
      {
        name: 'experienceLevel',
        label: 'How would you describe your experience level?',
        type: 'select',
        required: true,
        options: [
          { value: 'complete-beginner', label: 'Complete beginner' },
          { value: 'some-experience', label: 'Beginner with some experience' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
          { value: 'experienced-competitor', label: 'Experienced competitor' },
        ],
      },
      {
        name: 'competitionInterests',
        label: 'What kinds of competitions interest you?',
        type: 'checkboxGroup',
        required: true,
        options: [
          { value: 'ctf', label: 'CTF competitions' },
          { value: 'hackathons', label: 'Hackathons' },
          { value: 'cyber-competitions', label: 'Other cybersecurity competitions' },
          { value: 'educational-competitions', label: 'Educational competitions' },
        ],
      },
    ],
    experienceFields: 'light',
  },
  {
    id: 'volunteer',
    title: 'Volunteer',
    short: 'Contribute your time and skills, no formal leadership process required.',
    detail: 'For people who want to help build without committing to a title.',
    glyph: '05',
    estTime: '5 min',
    roleFields: [
      {
        name: 'volunteerInterests',
        label: 'What kind of volunteer work interests you?',
        type: 'checkboxGroup',
        required: true,
        options: [
          { value: 'curriculum', label: 'Curriculum creation' },
          { value: 'content', label: 'Educational content' },
          { value: 'social-media', label: 'Social media' },
          { value: 'design', label: 'Graphic design' },
          { value: 'event-assistance', label: 'Event assistance' },
          { value: 'moderation', label: 'Community moderation' },
          { value: 'research', label: 'Research' },
          { value: 'outreach-assistance', label: 'Outreach assistance' },
          { value: 'general-support', label: 'General organizational support' },
          { value: 'other', label: 'Something else' },
        ],
      },
      {
        name: 'specializedSkills',
        label: 'For more specialized work, what relevant qualifications, skills, or experience do you have?',
        type: 'textarea',
        required: false,
        helper: 'Optional — basic volunteering doesn\u2019t require this. It only helps for more specialized roles.',
      },
      {
        name: 'availability',
        label: 'What\u2019s your general availability?',
        type: 'text',
        required: true,
        placeholder: 'e.g. a few hours on weekends, evenings during the week...',
      },
    ],
    experienceFields: 'light',
  },
]

export const PATH_LOOKUP = Object.fromEntries(APPLICATION_PATHS.map((p) => [p.id, p]))

// ─────────────────────────────────────────────────────────────────
// STEP 2 — basic info, shared by every path (with small variations)
// ─────────────────────────────────────────────────────────────────

export const BASIC_INFO_FIELDS = [
  { name: 'fullName', label: 'Full name', type: 'text', required: true },
  { name: 'email', label: 'Email address', type: 'email', required: true },
  { name: 'location', label: 'General location', type: 'text', required: true, placeholder: 'City, region, or country' },
  {
    name: 'schoolOrOrganization',
    label: 'School or organization',
    type: 'text',
    required: false,
    helper: 'If applicable.',
  },
]

export const AGE_FIELD = {
  name: 'ageRange',
  label: 'Age range',
  type: 'select',
  required: true,
  options: [
    { value: 'under-13', label: 'Under 13' },
    { value: '13-15', label: '13–15' },
    { value: '16-18', label: '16–18' },
    { value: '19-22', label: '19–22' },
    { value: '23+', label: '23+' },
  ],
}

// Paths that need an age range on top of the shared basic-info fields.
export const PATHS_REQUIRING_AGE = ['department', 'chapter']

// ─────────────────────────────────────────────────────────────────
// STEP 4 — experience & interests. Two tiers: 'leadership' (department
// + chapter) gets the fuller set the brief calls for; 'light' (member,
// team, volunteer) gets a shorter version so beginners aren't overwhelmed.
// ─────────────────────────────────────────────────────────────────

export const EXPERIENCE_FIELD_SETS = {
  leadership: [
    {
      name: 'background',
      label: 'Tell us about yourself and your background.',
      type: 'textarea',
      required: true,
      helper: 'Achievements, positions held elsewhere, projects, interests, beliefs, experiences — anything relevant.',
    },
    {
      name: 'skillsBrought',
      label: 'What skills or experiences would you bring to Hash Browns?',
      type: 'textarea',
      required: true,
    },
    {
      name: 'timeCommitment',
      label: 'How much time are you realistically able to commit?',
      type: 'select',
      required: true,
      options: [
        { value: '1-2', label: '1–2 hours a week' },
        { value: '3-5', label: '3–5 hours a week' },
        { value: '6-10', label: '6–10 hours a week' },
        { value: '10+', label: '10+ hours a week' },
      ],
    },
    {
      name: 'links',
      label: 'Links to relevant projects, portfolios, LinkedIn, GitHub, or a website',
      type: 'text',
      required: false,
      helper: 'Optional.',
    },
  ],
  light: [
    {
      name: 'background',
      label: 'Tell us a bit about yourself.',
      type: 'textarea',
      required: true,
      helper: 'Interests, experience, what got you curious about cybersecurity — whatever feels relevant.',
    },
    {
      name: 'timeCommitment',
      label: 'How much time do you realistically want to put in?',
      type: 'select',
      required: false,
      options: [
        { value: 'casual', label: 'Casual — whenever I can' },
        { value: '1-2', label: '1–2 hours a week' },
        { value: '3-5', label: '3–5 hours a week' },
        { value: '5+', label: '5+ hours a week' },
      ],
    },
    {
      name: 'links',
      label: 'Links to any projects, a GitHub, or a portfolio',
      type: 'text',
      required: false,
      helper: 'Optional — most beginners won\u2019t have this, and that\u2019s completely fine.',
    },
  ],
}

// ─────────────────────────────────────────────────────────────────
// "Not sure where you fit?" quiz
// ─────────────────────────────────────────────────────────────────

export const FIT_FINDER_OPTIONS = [
  { id: 'learn', label: 'I want to learn', recommends: ['member'] },
  { id: 'lead', label: 'I want to lead', recommends: ['department', 'chapter'] },
  { id: 'compete', label: 'I want to compete', recommends: ['team', 'member'] },
  { id: 'help', label: 'I want to help', recommends: ['volunteer'] },
  { id: 'start', label: 'I want to start something locally', recommends: ['chapter'] },
]

// ─────────────────────────────────────────────────────────────────
// Growth model
// ─────────────────────────────────────────────────────────────────

export const GROWTH_STEPS = [
  { label: 'One leader', detail: 'Applies, gets approved, starts a chapter.' },
  { label: 'One chapter', detail: 'A school, library, or community space becomes a hub.' },
  { label: 'Local members', detail: 'The chapter recruits people who want in.' },
  { label: 'Competitive teams', detail: 'Up to four teams per chapter, up to ten people each.' },
  { label: 'Events + competitions', detail: 'CTFs, hackathons, workshops — under the Hash Browns name.' },
  { label: 'More people', detail: 'Awareness spreads through results, not ads.' },
  { label: 'More chapters', detail: 'The next leader applies, and it starts again.' },
]

export const SCALE_EXAMPLES = [
  { chapters: 10, perChapter: 5, total: 50 },
  { chapters: 20, perChapter: 5, total: 100 },
  { chapters: 50, perChapter: 8, total: 400 },
]

// ─────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────

export const FAQ_ITEMS = [
  {
    q: 'Do I need cybersecurity experience?',
    a: 'No. Beginners are welcome everywhere in Hash Browns — most members start with zero background.',
  },
  {
    q: 'Do I need to be part of a school?',
    a: 'No. Chapters and members can operate through schools, libraries, community centers, or other appropriate community spaces.',
  },
  {
    q: 'Can I start a chapter?',
    a: 'Yes. Eligible applicants can apply to become Chapter Leaders and build a local community from scratch.',
  },
  {
    q: 'Can I volunteer without being a cybersecurity expert?',
    a: 'Yes. There are plenty of ways to contribute — content, design, outreach, moderation — that have nothing to do with technical skill.',
  },
  {
    q: 'Can I join if there\u2019s no chapter near me?',
    a: 'Yes. You can join the broader community, participate online, volunteer, compete, or apply to start a chapter yourself.',
  },
  {
    q: 'Can I join a team?',
    a: 'Yes. Hash Browns is built to help members compete and connect with teammates, whether or not you\u2019re part of a chapter yet.',
  },
  {
    q: 'How many people can be in a chapter?',
    a: 'Chapters can have up to four teams, with up to ten people per team — though most new chapters start much smaller, often with just one team.',
  },
  {
    q: 'How long does the application take?',
    a: 'Joining as a member, volunteer, or team member takes about five minutes. Department and chapter leadership applications ask for more detail and take closer to 10–20 minutes.',
  },
]
