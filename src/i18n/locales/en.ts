export default {
  appTitle: 'Will It Match',
  subtitle: 'Local CV / Job Description matcher powered by Ollama',
  language: 'Language',

  // Step 1 — Candidate
  cvSection: 'Your CV',
  stepCandidateEyebrow: 'Source material',
  stepCandidateTitle: 'Whose page <em style="color:var(--accent)">are we reading?</em>',
  stepCandidateLede: 'Drop a CV. We parse it on your machine, pick out the structure, and keep the original close at hand for the run.',
  stepCandidateNext: 'Take the posting next',
  dropZoneIdle: 'Drop a curriculum here.',
  dropZoneActive: 'Yes — let go here.',
  dropZoneBrowse: 'Or browse your machine. Nothing is uploaded.',
  dropZoneTip: 'Tip · plain prose reads cleaner than tables',
  candidateParsed: 'Parsed',
  candidateChars: 'characters',
  candidateReplace: 'Replace',
  candidateParsing: 'Parsing…',
  candidateHintOk: 'Looks good — ready to continue',
  candidateHintDrop: 'Drop a file to continue',

  // Step 2 — Posting
  jdSection: 'Job description',
  jdPlaceholder: 'Paste the posting here…',
  stepPostingEyebrow: 'What the role asks for',
  stepPostingTitle: 'And whose call <em style="color:var(--accent)">are we answering?</em>',
  stepPostingLede: 'Paste the job description. We\'ll lift the requirements and keep your text editable until the run.',
  stepPostingNext: 'Read the match',
  postingClear: 'Clear',
  postingWords: 'words',
  postingChars: 'characters',
  postingInfo: 'About',
  postingInfoText: 'Paste the full text of the job description. The more detail, the better the reading.',
  postingHintOk: 'Enough text to read closely',
  postingHintNeed: 'Paste at least a paragraph',

  // Step 3 — Run
  stepRunEyebrow: 'The reading',
  stepRunTitle: 'Reading both pages, <em style="color:var(--accent)">side by side.</em>',
  stepRunLede: 'Your local model is doing the work — no network, no logs. This usually takes ten to thirty seconds, depending on the machine.',
  runPass1: 'Parsing the curriculum',
  runPass1Detail: 'structure, dates, role arcs',
  runPass2: 'Mapping the posting',
  runPass2Detail: 'requirements, soft signals, tone',
  runPass3: 'Aligning the language of skill',
  runPass3Detail: 'normalizing terminology across both documents',
  runPass4: 'Cross-referencing the facets',
  runPass4Detail: 'skills, experience, tooling, domain',
  runPass5: 'Counting evidence on both sides',
  runPass5Detail: 'quotes, contradictions, gaps',
  runPass6: 'Composing the editorial note',
  runPass6Detail: 'the verdict, in prose',
  runPhase1: 'warming the press',
  runPhase2: 'in the margins',
  runPhase3: 'drafting the note',
  runPhase4: 'binding',
  runStream: 'Stream · model output',
  runStreamText: 'The model is reading both documents and composing a detailed verdict…',
  runPatience: 'A reading takes a moment.',
  runPatienceDetail: 'We don\'t stream the final number until the note is composed. The score is meant to be read with the prose, not before it.',
  runAutoAdvance: 'The verdict opens on its own when the reading is done.',
  runStop: 'Stop reading',

  // Step 4 — Verdict
  stepVerdictEyebrow: 'The note',
  stepVerdictTitle: 'The editorial <em style="color:var(--accent)">reading.</em>',
  stepVerdictLede: 'Here\'s the editorial reading — the score, the facets, the paired evidence. Take it as a starting point for the conversation, not a sentence.',
  verdictOverall: 'Overall',
  verdictFacets: 'Facets',
  verdictFacet: 'Facet',
  verdictReading: 'Reading',
  verdictStrength: 'Strength',
  verdictScore: 'Score',
  verdictCarried: 'Carried over',
  verdictRaising: 'Worth raising',
  verdictEvidence: 'Evidence · paired readings',
  verdictTag: 'Tag',
  verdictNote: 'Note',
  verdictNewReading: 'Start a new reading',

  // Rail
  railSequence: 'Sequence',
  railPrivacy: 'Privacy',
  railPrivacyText: 'Everything is read on this machine. No upload, no logs, no third party.',
  railOffline: 'Offline-friendly',
  railSession: 'This session',

  // Navigation
  navBack: 'Back',

  // Model
  modelSection: 'Model',
  modelLabel: 'Ollama model',
  modelPlaceholder: 'Select a model',
  noModels: 'No models installed. Pull one with:',
  noModelsExample: 'ollama pull <model-name>',
  refreshModels: 'Refresh',

  // Connection
  connectionError: 'Cannot reach Ollama at {url}.',
  connectionHelp:
    'Make sure Ollama is running and started with browser access enabled, e.g. OLLAMA_ORIGINS="*" ollama serve',

  // Actions
  analyze: 'Analyze match',
  analyzing: 'Analyzing…',
  cancel: 'Cancel',
  newAnalysis: 'New analysis',

  // Results (legacy keys kept for compat)
  resultScore: 'Overall score',
  resultSummary: 'Summary',
  resultStrengths: 'Strengths',
  resultGaps: 'Gaps',
  resultRecommendations: 'Recommendations',
  parseError: "The model didn't return a valid result. Try again.",
  retry: 'Try again',

  loadingTitle: 'Analyzing your match…',
  loadingHint: 'This usually takes 10–30 seconds depending on your model.',

  scoreBandExcellent: 'Excellent fit',
  scoreBandGood: 'Good fit',
  scoreBandPartial: 'Partial fit',
  scoreBandWeak: 'Weak fit',

  settings: 'Settings',
  ollamaUrlLabel: 'Ollama base URL',
  save: 'Save',
  close: 'Close',

  errorNoCv: 'Upload a CV first.',
  errorNoJd: 'Paste a job description first.',
  errorNoModel: 'Choose a model first.',
}
