const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    // getting the input
    const apiUrl = core.getInput('api-url', { required: true });
    core.info(`Calling API: ${apiUrl}`);

    // calling the API
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status} ${res.statusText}`);
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error(`Failed to parse JSON: ${e.message}`);
    }

    const status = data.status || 'unknown';
    const service = data.service || 'devops-assignment';
    const timestamp = new Date().toISOString();

    // building the markdown
    const markdown = [
      '## API Status',
      `- Status: ${status}`,
      `- Service: ${service}`,
      `- Timestamp: ${timestamp}`,
      ''
    ].join('\n');

    core.info('Generated markdown:');
    core.info(markdown);

    // updating the README.md
    const repoRoot = process.env.GITHUB_WORKSPACE || process.cwd();
    const readmePath = path.join(repoRoot, 'README.md');

    // creating or updating the README.md file
    let readmeContent = '';
    if (fs.existsSync(readmePath)) {
      readmeContent = fs.readFileSync(readmePath, 'utf8');
    } else {
      core.info('README.md not found at repo root, creating a new one.');
    }
    
    // markers for the status block
    const startMarker = '<!-- API_STATUS_START -->';
    const endMarker = '<!-- API_STATUS_END -->';

    const block = `${startMarker}\n${markdown}\n${endMarker}`;
     
    
    if (readmeContent.includes(startMarker) && readmeContent.includes(endMarker)) {
      // Replace old block
      core.info('Found existing status block. Replacing...');
      const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'm');
      readmeContent = readmeContent.replace(regex, block);
    } else {
      // Append new block at bottom
      core.info('No existing status block found. Appending new block.');
      readmeContent = readmeContent.trim() + `\n\n${block}\n`;
    }

    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    core.info(`README.md updated at: ${readmePath}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
