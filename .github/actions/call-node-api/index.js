const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    // 1. Get input
    const apiUrl = core.getInput('api-url', { required: true });
    core.info(`Calling API: ${apiUrl}`);

    // 2. Call API using global fetch (Node 20 on GitHub runner supports it)
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

    // 3. Build markdown
    const markdown = [
      '## API Status',
      `- Status: ${status}`,
      `- Service: ${service}`,
      `- Timestamp: ${timestamp}`,
      ''
    ].join('\n');

    core.info('Generated markdown:');
    core.info(markdown);

    // 4. Always append this block to ROOT README.md
    const repoRoot = process.env.GITHUB_WORKSPACE || process.cwd();
    const readmePath = path.join(repoRoot, 'README.md');

    let readmeContent = '';
    if (fs.existsSync(readmePath)) {
      readmeContent = fs.readFileSync(readmePath, 'utf8');
    } else {
      core.info('README.md not found at repo root, creating a new one.');
    }

    // Add a separator so we clearly see new runs
    const newContent =
      (readmeContent.trim() ? readmeContent.trim() + '\n\n' : '') +
      '<!-- API_STATUS_START -->\n' +
      markdown +
      '\n' + '<!-- /API_STATUS_END -->\n';

    fs.writeFileSync(readmePath, newContent, 'utf8');
    core.info(`README.md updated at: ${readmePath}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
