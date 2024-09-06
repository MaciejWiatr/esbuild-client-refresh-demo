import * as esbuild from "esbuild";
import { WebSocketServer } from "ws";
import config from "./config.mjs";

const reloadServer = new WebSocketServer({ port: 8080 });
const clients = [];

reloadServer.on("connection", (ws) => {
  clients.push(ws);
  ws.on("close", () => clients.splice(clients.indexOf(ws), 1));
});

const ctx = await esbuild.context({
  ...config,
  plugins: [
    {
      name: "live-reload",
      setup(build) {
        build.onEnd(() => {
          clients.forEach(
            (client) => client.readyState === 1 && client.send("reload")
          );
        });
      },
    },
  ],
});

await ctx.watch();
