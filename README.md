# A chatGPT-like Web interface using Bun / Elysia / HTMX / UnoCSS

If you're working on a project or product that involves LLMs, selecting the appropriate provider and model can be a challenging task. Or perhaps you're at a company where many colleagues are hesitant to incorporate LLMs into their workflows. In such cases, providing a way for them to interact with the latest LLMs without requiring a subscription to a monthly plan can be incredibly useful.
The creation of this web interface is the object of a [Blogpost](https://www.smartesting.com). Read it if you want a deep understanding of how the code is structured.

## Installation
1. Install the dependencies:
```bash
bun i
```
2. Create a .env file with a `OPENAI_API_KEY` variable

## CSS Generation
Use UnoCSS to generate the CSS file:
```bash
bun uno
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.
