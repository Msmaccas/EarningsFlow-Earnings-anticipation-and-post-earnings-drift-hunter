import http from 'http';
import {
  runAnticipationBoard,
  runReactionBoard,
  runDriftBoard
} from '@earningsflow/workflows';
import {
  generatePrepMarkdown,
  generateReactionMarkdown,
  generateDriftMarkdown
} from '@earningsflow/reports';

// Determine the port. We avoid using dotenv here to remain dependency‑free.
const port = parseInt(process.env.PORT || '3000', 10);

/**
 * Helper to send JSON responses. Handles errors gracefully.
 */
function sendJson(res: http.ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

/**
 * Helper to send HTML responses.
 */
function sendHtml(res: http.ServerResponse, statusCode: number, html: string): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/html');
  res.end(html);
}

/**
 * Create and start the HTTP server. We handle a limited set of GET endpoints.
 */
const server = http.createServer(async (req, res) => {
  const url = req.url || '/';
  const method = req.method || 'GET';
  if (method !== 'GET') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }
  try {
    if (url === '/api/prep-board') {
      const items = await runAnticipationBoard();
      sendJson(res, 200, items);
      return;
    }
    if (url === '/api/reaction-board') {
      const items = await runReactionBoard();
      sendJson(res, 200, items);
      return;
    }
    if (url === '/api/drift-board') {
      const items = await runDriftBoard();
      sendJson(res, 200, items);
      return;
    }
    if (url === '/dashboard') {
      // Render a simple dashboard with Markdown previews. Escape HTML tags in
      // the markdown to prevent injection.
      const [prep, reaction, drift] = await Promise.all([
        runAnticipationBoard(),
        runReactionBoard(),
        runDriftBoard()
      ]);
      const prepMd = generatePrepMarkdown(prep).replace(/</g, '&lt;');
      const reactionMd = generateReactionMarkdown(reaction).replace(/</g, '&lt;');
      const driftMd = generateDriftMarkdown(drift).replace(/</g, '&lt;');
      const html = `<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EarningsFlow Dashboard</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; }
    pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>EarningsFlow Dashboard</h1>
  <h2>Preparation Board</h2>
  <pre>${prepMd}</pre>
  <h2>Reaction Board</h2>
  <pre>${reactionMd}</pre>
  <h2>Drift Board</h2>
  <pre>${driftMd}</pre>
</body>
</html>`;
      sendHtml(res, 200, html);
      return;
    }
    if (url === '/healthz') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }
    // Fall through: unknown path
    sendJson(res, 404, { error: 'Not Found' });
  } catch (err) {
    sendJson(res, 500, { error: (err as Error).message });
  }
});

server.listen(port, () => {
  console.log(`EarningsFlow server listening on port ${port}`);
});