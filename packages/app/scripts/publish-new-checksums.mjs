import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const OWNER = 'anonymous-apps';
const REPO = 'Abyss';

console.log('Publishing updated checksums to GitHub...');

// Get the directory name using ESM pattern
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function publishNewChecksums() {
    try {
        // Get GitHub token from environment variable
        const token = process.env.GH_TOKEN;
        if (!token) {
            console.error('GitHub token not found. Please set the GH_TOKEN environment variable.');
            process.exit(1);
        }

        // Initialize Octokit with authentication
        const octokit = new Octokit({
            auth: token,
        });

        // Get the latest release (including drafts)
        const { data: releases } = await octokit.repos.listReleases({
            owner: OWNER,
            repo: REPO,
        });

        // Find the most recent draft release
        const latestRelease = releases.find(release => release.draft === true);

        console.log(`Found ${releases.length} releases, including ${releases.filter(r => r.draft).length} drafts`);
        console.log('Releases:', releases.map(r => `${r.tag_name} (draft: ${r.draft})`).join(', '));

        if (!latestRelease) {
            console.error('Could not find any draft releases');
            process.exit(1);
        }

        console.log(`Found release: ${latestRelease.tag_name}`);

        // Find the latest-mac.yml file in the dist directory
        const distDir = path.resolve(__dirname, '../dist');
        const ymlPath = path.join(distDir, 'latest-mac.yml');

        if (!fs.existsSync(ymlPath)) {
            console.error('Could not find latest-mac.yml in dist directory');
            return;
        }

        // Read the updated YAML file
        const ymlContent = fs.readFileSync(ymlPath, 'utf8');

        // Find the latest-mac.yml asset in the release
        const latestMacAsset = latestRelease.assets.find(asset => asset.name === 'latest-mac.yml');

        if (!latestMacAsset) {
            console.error('Could not find latest-mac.yml in the release assets');
            return;
        }

        // Delete the existing asset
        await octokit.repos.deleteReleaseAsset({
            owner: OWNER,
            repo: REPO,
            asset_id: latestMacAsset.id,
        });

        console.log('Deleted existing latest-mac.yml asset');

        // Upload the updated asset
        await octokit.repos.uploadReleaseAsset({
            owner: OWNER,
            repo: REPO,
            release_id: latestRelease.id,
            name: 'latest-mac.yml',
            data: ymlContent,
        });

        console.log('Successfully uploaded updated latest-mac.yml to GitHub release');
    } catch (error) {
        console.error('Error publishing checksums to GitHub:', error);
        process.exit(1);
    }
}

publishNewChecksums();
