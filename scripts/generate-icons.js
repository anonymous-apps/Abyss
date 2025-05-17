const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const icongen = require('icon-gen');

const SIZES = [16, 32, 64, 128, 256, 512, 1024];
const SOURCE_LOGO = path.join(__dirname, '../assets/logo.png');
const BUILD_DIR = path.join(__dirname, '../build');
const ICONSET_DIR = path.join(BUILD_DIR, 'icon.iconset');

async function generateIcns() {
	// Create build and iconset directories if they don't exist
	if (!fs.existsSync(BUILD_DIR)) {
		fs.mkdirSync(BUILD_DIR, { recursive: true });
	}
	if (!fs.existsSync(ICONSET_DIR)) {
		fs.mkdirSync(ICONSET_DIR, { recursive: true });
	}

	// Generate different size icons
	for (const size of SIZES) {
		const filename = `${size}.png`;

		await sharp(SOURCE_LOGO)
			.resize(size, size, {
				fit: 'contain',
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			})
			.png()
			.toFile(path.join(ICONSET_DIR, filename));
	}

	// Generate icns file
	await icongen(ICONSET_DIR, BUILD_DIR, {
		report: true,
		icns: {
			name: 'icon',
			sizes: SIZES,
		},
	});

	// Clean up the temporary iconset directory
	fs.rmSync(ICONSET_DIR, { recursive: true, force: true });
}

generateIcns().catch(console.error);
