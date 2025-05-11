import App from "./server/index";
import { staticPlugin } from "./plugins/static";
import { loggerPlugin } from "./plugins/logger";
import { Router } from "./server/index";
const server = new App();
const authRouter = new Router();

authRouter.get("/hello", (request, response) => {
  response.json({
    message: "Hello from authenticated router!",
  });
});

server
  .use(loggerPlugin())
  .use(staticPlugin({ path: "public" }))
  .use("/auth", authRouter)
  .get("/hello", (request, response) => {
    response
      .headers({
        foo: "bar",
      })
      .status(200)
      .json({
        message: "Hello World!",
      });
  })
  .get("/hello/:name", (request, response) => {
    response.json({
      message: `Hello from dynamic path ${request.params.name}!`,
    });
  })
  .get("/hello/name", (request, response) => {
    response.json({
      message: `Hello world!`,
    });
  })
  .listen(3000);
