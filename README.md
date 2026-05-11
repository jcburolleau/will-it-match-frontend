# will-it-match-frontend

A local-first web app that scores how well a CV matches a job description, using any [Ollama](https://ollama.com) model installed on your computer. Everything runs in your browser and talks directly to the Ollama daemon on `localhost` — your CV and the JD never leave your machine.

> A separate hosted version (OpenAI-powered) lives in [`will-it-match-backend`](../will-it-match-backend). This frontend repo is fully self-contained for the local Ollama flow.

---

## English

### Prerequisites

1. **Install Ollama** — download from [ollama.com](https://ollama.com) and install for your OS.
2. **Pull at least one model.** Any chat-capable model works. For example:
   ```bash
   ollama pull <model-name>
   # e.g.  ollama pull llama3.1   or   ollama pull qwen2.5   or   ollama pull mistral
   ```
   The app lists whichever models you already have installed.
3. **Node.js 20+** and **npm**.

### Run Ollama with browser access

The Ollama daemon must allow requests from the dev server. Start it with `OLLAMA_ORIGINS` set:

```bash
OLLAMA_ORIGINS="*" ollama serve
```

Leave that running in its own terminal. (On macOS, if you launched Ollama from the menubar app, quit it first so the CLI `serve` can bind to the port.)

### Run the app

```bash
git clone <this-repo>
cd will-it-match-frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Pick one of your installed models, upload your CV (PDF / DOCX / TXT), paste the job description, click **Analyze match**.

---

## Español

### Requisitos

1. **Instala Ollama** — descárgalo desde [ollama.com](https://ollama.com) para tu sistema operativo.
2. **Descarga al menos un modelo.** Cualquier modelo de chat funciona. Por ejemplo:
   ```bash
   ollama pull <nombre-modelo>
   # ej:  ollama pull llama3.1   o   ollama pull qwen2.5   o   ollama pull mistral
   ```
   La aplicación lista los modelos que ya tengas instalados.
3. **Node.js 20+** y **npm**.

### Ejecuta Ollama con acceso desde el navegador

El daemon de Ollama debe permitir peticiones desde el servidor de desarrollo. Inícialo con `OLLAMA_ORIGINS`:

```bash
OLLAMA_ORIGINS="*" ollama serve
```

Déjalo corriendo en su propia terminal. (En macOS, si abriste Ollama desde la app de la barra de menús, ciérrala primero para que el `serve` de la CLI pueda usar el puerto.)

### Ejecuta la app

```bash
git clone <este-repo>
cd will-it-match-frontend
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`). Elige uno de tus modelos instalados, sube tu CV (PDF / DOCX / TXT), pega la descripción del puesto y haz click en **Analizar match**.

---

## Architecture

```
Browser (Vue 3 SPA, http://localhost:5173)
        │  fetch
        ▼
http://localhost:11434  ← Ollama daemon
```

- CV parsing happens in the browser (`pdfjs-dist`, `mammoth`).
- The extracted text and the JD are sent only to your local Ollama.
- Selected model + Ollama URL are persisted in `localStorage`.

## Stack

Vue 3, TypeScript, Vite, Tailwind, vue-i18n, Pinia.
