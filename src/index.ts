import express, { Request, Response, NextFunction } from 'express';
const app = express();

const reloadScript = `
<script>
(() => {
  let ws;
  const connect = () => {
    ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = e => {
      if (e.data === 'reload') {
        ws.close();
        setTimeout(() => { location.reload(true) }, 300)
      }
    };
    ws.onclose = () => setTimeout(connect, 3000);
  };
  connect();
  addEventListener('online', connect);
  addEventListener('beforeunload', () => ws && ws.close());
})(); 
</script>
`

// Middleware for injecting script
const injectScript = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function(body) {
    if (typeof body === 'string' && res.get('Content-Type')?.includes('text/html')) {
      body = body.replace('</head>', `${reloadScript}</head>`);
    }
    return originalSend.call(this, body);
  };

  next();
};

// Apply the middleware
app.use(injectScript);

// Route definition
app.get("/", async (req: Request, res: Response) => {
  const text = await import("./module/test.js")

  res.setHeader('Content-Type', 'text/html');
  
  return res.send(`
    <html>
      <head>
        <title>hi!!</title> 
      </head>
      <body> 
        wowowo ${text.lol}
      </body>
    </html>
  `);
});

// Start the server
app.listen(3000, () => {
  console.log(`Listening at http://localhost:3000`);
}); 