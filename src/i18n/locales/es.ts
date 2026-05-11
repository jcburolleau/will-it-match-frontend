export default {
  appTitle: 'Will It Match',
  subtitle: 'Comparador local de CV y descripción de puesto con Ollama',
  language: 'Idioma',

  cvSection: 'Tu CV',
  cvDropzone: 'Arrastra tu CV aquí o haz click para subirlo (PDF, DOCX, TXT)',
  cvParsed: 'Se cargaron {chars} caracteres de {name}',

  jdSection: 'Descripción del puesto',
  jdPlaceholder: 'Pega aquí el texto completo de la descripción del puesto',

  modelSection: 'Modelo',
  modelLabel: 'Modelo de Ollama',
  modelPlaceholder: 'Elige un modelo',
  noModels: 'No tienes modelos instalados. Descarga uno con:',
  noModelsExample: 'ollama pull <nombre-modelo>',
  refreshModels: 'Refrescar',

  connectionError: 'No se puede conectar a Ollama en {url}.',
  connectionHelp:
    'Asegúrate de que Ollama esté ejecutándose con acceso desde el navegador habilitado, por ejemplo: OLLAMA_ORIGINS="*" ollama serve',

  analyze: 'Analizar match',
  analyzing: 'Analizando…',
  cancel: 'Cancelar',
  newAnalysis: 'Nuevo análisis',

  resultScore: 'Puntaje general',
  resultSummary: 'Resumen',
  resultStrengths: 'Fortalezas',
  resultGaps: 'Brechas',
  resultRecommendations: 'Recomendaciones',
  parseError: 'El modelo no devolvió un resultado válido. Inténtalo de nuevo.',
  retry: 'Reintentar',

  loadingTitle: 'Analizando tu coincidencia…',
  loadingHint: 'Esto suele tardar entre 10 y 30 segundos según tu modelo.',

  scoreBandExcellent: 'Coincidencia excelente',
  scoreBandGood: 'Buena coincidencia',
  scoreBandPartial: 'Coincidencia parcial',
  scoreBandWeak: 'Coincidencia débil',

  settings: 'Configuración',
  ollamaUrlLabel: 'URL base de Ollama',
  save: 'Guardar',
  close: 'Cerrar',

  errorNoCv: 'Sube un CV primero.',
  errorNoJd: 'Pega una descripción del puesto primero.',
  errorNoModel: 'Elige un modelo primero.',
}
