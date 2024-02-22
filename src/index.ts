import { Elysia } from "elysia";

const indexPlugin = new Elysia()
    .get('/', () => {
       return Bun.file('views/index.html');
    })

const app = new Elysia()
  .use(indexPlugin)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
