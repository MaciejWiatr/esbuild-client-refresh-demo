import * as esbuild from "esbuild";
import { WebSocketServer, WebSocket } from "ws";

const reloadServer = new WebSocketServer({ port: 8080 });
const clients = [];

reloadServer.on("connection", (ws) => {
  clients.push(ws);
  ws.on("close", () => {
    const index = clients.indexOf(ws);
    if (index !== -1) clients.splice(index, 1);
  });
});

const ctx = await esbuild.context({
  entryPoints: ["src/**/*.ts"],
  outdir: "dist",
  logLevel: "info",
  sourcemap: "both",
  plugins: [
    {
      name: "live-reload",
      setup(build) {
        build.onEnd(() => {
          clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send("reload");
            }
          });
        });
      },
    },
  ],
});

await ctx.watch();
