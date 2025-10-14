// scripts/fetch-latest.js
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const urlModule = require('url');

const repo = 'Tasty-Syntax/bf6-portal-builder';
const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'node.js',
            'Accept': 'application/vnd.github+json'
          }
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            if (res.statusCode >= 400) {
              return reject(new Error(`GitHub API request failed: ${res.statusCode} ${res.statusMessage}`));
            }
            try {
              const obj = JSON.parse(data);
              resolve(obj);
            } catch (e) {
              reject(new Error(`Failed to parse JSON: ${e.message}`));
            }
          });
        }
      )
      .on('error', reject);
  });
}

// Support redirects (HTTP 3xx)
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const parsed = url.match(/https{0,1}/)[0];
    const get = parsed === 'https' ? https.get : http.get;

    const request = get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // redirect — try again at new location
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Download request failed: ${res.statusCode} ${res.statusMessage}`));
      }

      const file = fs.createWriteStream(dest);
      let downloaded = 0;
      res.on('data', (chunk) => {
        downloaded += chunk.length;
      });
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          resolve();
        });
      });
    });

    request.on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

(async () => {
  try {
    console.log(`Fetching latest release info from ${apiUrl}`);
    const release = await fetchJson(apiUrl);
    const assets = release.assets;
    console.log(`Release tag: ${release.tag_name}`);

    if (!assets || assets.length === 0) {
      throw new Error('No assets found in latest release');
    }
    // Optionally: Pick the right asset by name or filter criteria instead of assets[0]
    const asset = assets[0];
    const downloadUrl = asset.browser_download_url;

    if (!downloadUrl) {
      throw new Error('Asset has no browser_download_url');
    }

    const fileName = path.basename(downloadUrl);
    const tmpPath = path.join(__dirname, 'temp_' + fileName);
    const outputDir = path.join(__dirname, '..', 'src', 'lib');
    const outputPath = path.join(outputDir, 'tasty_lib.ts');

    console.log(`Downloading from: ${downloadUrl}`);
    await downloadFile(downloadUrl, tmpPath);

    const content = fs.readFileSync(tmpPath, 'utf-8');

    const lines = content.split(/\r?\n/);
    if (lines.length === 0) {
      console.warn(`Downloaded file is empty`);
    }

    const fileBody = lines.slice(8).join('\n');
    const finalContent = `namespace tasty {\n${fileBody}\n}`;

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, finalContent, 'utf-8');
    console.log(`Wrote processed file to: ${outputPath}`);

    fs.unlinkSync(tmpPath);

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();

