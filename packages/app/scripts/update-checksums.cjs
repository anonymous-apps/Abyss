const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const yaml = require('js-yaml');

function hashFile(file, algorithm = 'sha512', encoding = 'base64') {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        hash.on('error', reject).setEncoding(encoding);
        fs.createReadStream(file, {
            highWaterMark: 1024 * 1024, // better to use more memory but hash faster
        })
            .on('error', reject)
            .on('end', () => {
                hash.end();
                resolve(hash.read());
            })
            .pipe(hash, {
                end: false,
            });
    });
}

async function updateChecksums() {
    // Find the latest-mac.yml file in the dist directory
    const distDir = path.resolve(__dirname, '../dist');
    const ymlPath = path.join(distDir, 'latest-mac.yml');

    if (!fs.existsSync(ymlPath)) {
        console.error('Could not find latest-mac.yml in dist directory');
        process.exit(1);
    }

    // Read and parse the YAML file
    const ymlContent = fs.readFileSync(ymlPath, 'utf8');
    const ymlData = yaml.load(ymlContent);

    // Update checksums and sizes for each file
    for (const file of ymlData.files) {
        const filePath = path.join(distDir, file.url);
        if (!fs.existsSync(filePath)) {
            console.error(`Could not find file: ${file.url}`);
            continue;
        }

        // Compute new checksum
        const newChecksum = await hashFile(filePath);
        file.sha512 = newChecksum;

        // Update file size
        const stats = fs.statSync(filePath);
        file.size = stats.size;

        console.log(`Updated checksum and size for ${file.url}: ${newChecksum}, ${stats.size} bytes`);
    }

    // Update the main path checksum and size if it exists
    if (ymlData.path) {
        const mainFilePath = path.join(distDir, ymlData.path);
        if (fs.existsSync(mainFilePath)) {
            ymlData.sha512 = await hashFile(mainFilePath);

            // Update main file size
            const stats = fs.statSync(mainFilePath);
            ymlData.size = stats.size;

            console.log(`Updated main path checksum and size: ${ymlData.sha512}, ${stats.size} bytes`);
        }
    }

    // Write the updated YAML back to the file
    const updatedYml = yaml.dump(ymlData);
    fs.writeFileSync(ymlPath, updatedYml);
    console.log('Successfully updated checksums and sizes in latest-mac.yml');
}

updateChecksums();
