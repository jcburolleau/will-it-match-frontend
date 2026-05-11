export default {
  appTitle: 'Will It Match',
  subtitle: 'Local CV / Job Description matcher powered by Ollama',
  language: 'Language',

  cvSection: 'Your CV',
  cvDropzone: 'Drop your CV here or click to upload (PDF, DOCX, TXT)',
  cvParsed: 'Loaded {chars} characters from {name}',

  jdSection: 'Job description',
  jdPlaceholder: 'Paste the full job description text here',

  modelSection: 'Model',
  modelLabel: 'Ollama model',
  modelPlaceholder: 'Select a model',
  noModels: 'No models installed. Pull one with:',
  noModelsExample: 'ollama pull <model-name>',
  refreshModels: 'Refresh',

  connectionError: 'Cannot reach Ollama at {url}.',
  connectionHelp:
    'Make sure Ollama is running and started with browser access enabled, e.g. OLLAMA_ORIGINS="*" ollama serve',

  analyze: 'Analyze match',
  analyzing: 'Analyzing…',
  cancel: 'Cancel',
  newAnalysis: 'New analysis',

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
