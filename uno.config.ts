import { defineConfig, presetIcons, presetWebFonts, presetWind } from "unocss";

export default defineConfig({
	cli: {
		entry: {
			patterns: ["views/index.html", "src/index.ts"],
			outFile: "public/style.css",
		},
	},
	presets: [presetWind(), presetIcons(), presetWebFonts({
		provider: 'fontshare',
		fonts: {
			sans: 'satoshi'
		}
	})]
});


