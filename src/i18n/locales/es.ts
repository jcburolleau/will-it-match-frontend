export default {
  appTitle: 'Will It Match',
  subtitle: 'Comparador local de CV y descripción de puesto con Ollama',
  language: 'Idioma',

  // Step 1 — Candidato
  cvSection: 'Tu CV',
  stepCandidateEyebrow: 'Material de origen',
  stepCandidateTitle: '¿De quién <em style="color:var(--accent)">estamos leyendo?</em>',
  stepCandidateLede: 'Arrastra un CV. Lo procesamos en tu máquina, extraemos la estructura y lo mantenemos a mano para el análisis.',
  stepCandidateNext: 'Pasar al puesto',
  dropZoneIdle: 'Arrastra un currículum aquí.',
  dropZoneActive: 'Sí — suéltalo aquí.',
  dropZoneBrowse: 'O busca en tu máquina. Nada se sube.',
  dropZoneTip: 'Tip · el texto plano se lee mejor que las tablas',
  candidateParsed: 'Procesado',
  candidateChars: 'caracteres',
  candidateReplace: 'Reemplazar',
  candidateParsing: 'Procesando…',
  candidateHintOk: 'Se ve bien — listo para continuar',
  candidateHintDrop: 'Arrastra un archivo para continuar',

  // Step 2 — Puesto
  jdSection: 'Descripción del puesto',
  jdPlaceholder: 'Pega la descripción del puesto aquí…',
  stepPostingEyebrow: 'Lo que pide el rol',
  stepPostingTitle: '¿Y a quién <em style="color:var(--accent)">estamos respondiendo?</em>',
  stepPostingLede: 'Pega la descripción del puesto. Extraemos los requisitos y mantenemos tu texto editable hasta el análisis.',
  stepPostingNext: 'Leer el match',
  postingClear: 'Limpiar',
  postingWords: 'palabras',
  postingChars: 'caracteres',
  postingInfo: 'Acerca de',
  postingInfoText: 'Pega el texto completo de la descripción del puesto. Cuanto más detalle, mejor la lectura.',
  postingHintOk: 'Suficiente texto para leer de cerca',
  postingHintNeed: 'Pega al menos un párrafo',

  // Step 3 — Análisis
  stepRunEyebrow: 'La lectura',
  stepRunTitle: 'Leyendo ambas páginas, <em style="color:var(--accent)">lado a lado.</em>',
  stepRunLede: 'Tu modelo local está trabajando — sin red, sin logs. Esto suele tardar entre diez y treinta segundos, según la máquina.',
  runPass1: 'Analizando el currículum',
  runPass1Detail: 'estructura, fechas, trayectoria',
  runPass2: 'Mapeando el puesto',
  runPass2Detail: 'requisitos, señales blandas, tono',
  runPass3: 'Alineando el lenguaje de habilidades',
  runPass3Detail: 'normalizando terminología entre documentos',
  runPass4: 'Cruzando las facetas',
  runPass4Detail: 'habilidades, experiencia, herramientas, dominio',
  runPass5: 'Contando evidencia en ambos lados',
  runPass5Detail: 'citas, contradicciones, brechas',
  runPass6: 'Componiendo la nota editorial',
  runPass6Detail: 'el veredicto, en prosa',
  runPhase1: 'calentando la prensa',
  runPhase2: 'en los márgenes',
  runPhase3: 'redactando la nota',
  runPhase4: 'encuadernando',
  runStream: 'Stream · salida del modelo',
  runStreamText: 'El modelo está leyendo ambos documentos y componiendo un veredicto detallado…',
  runPatience: 'Una lectura toma un momento.',
  runPatienceDetail: 'No mostramos el número final hasta que la nota esté compuesta. El puntaje debe leerse con la prosa, no antes.',
  runAutoAdvance: 'El veredicto se abre solo cuando la lectura termina.',
  runStop: 'Detener lectura',

  // Step 4 — Veredicto
  stepVerdictEyebrow: 'La nota',
  stepVerdictTitle: 'La lectura <em style="color:var(--accent)">editorial.</em>',
  stepVerdictLede: 'Aquí está la lectura editorial — el puntaje, las facetas, la evidencia emparejada. Tómalo como punto de partida para la conversación, no como sentencia.',
  verdictOverall: 'General',
  verdictFacets: 'Facetas',
  verdictFacet: 'Faceta',
  verdictReading: 'Lectura',
  verdictStrength: 'Fortaleza',
  verdictScore: 'Puntaje',
  verdictCarried: 'Coincidencias',
  verdictRaising: 'Para conversar',
  verdictEvidence: 'Evidencia · lecturas emparejadas',
  verdictTag: 'Tema',
  verdictNote: 'Nota',
  verdictNewReading: 'Iniciar nueva lectura',

  // Rail
  railSequence: 'Secuencia',
  railPrivacy: 'Privacidad',
  railPrivacyText: 'Todo se lee en esta máquina. Sin subidas, sin logs, sin terceros.',
  railOffline: 'Sin conexión',
  railSession: 'Esta sesión',

  // Navegación
  navBack: 'Atrás',

  // Modelo
  modelSection: 'Modelo',
  modelLabel: 'Modelo de Ollama',
  modelPlaceholder: 'Elige un modelo',
  noModels: 'No tienes modelos instalados. Descarga uno con:',
  noModelsExample: 'ollama pull <nombre-modelo>',
  refreshModels: 'Refrescar',

  // Conexión
  connectionError: 'No se puede conectar a Ollama en {url}.',
  connectionHelp:
    'Asegúrate de que Ollama esté ejecutándose con acceso desde el navegador habilitado, por ejemplo: OLLAMA_ORIGINS="*" ollama serve',

  // Acciones
  analyze: 'Analizar match',
  analyzing: 'Analizando…',
  cancel: 'Cancelar',
  newAnalysis: 'Nuevo análisis',

  // Resultados (claves legacy)
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
