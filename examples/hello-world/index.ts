import App, {
  loggerPlugin,
  type Request,
  type Response,
  Router,
  staticPlugin,
} from "express-lite";

const server = new App();
const authRouter = new Router();

authRouter
  .use((request, response, next) => {
    console.log("Authenticating...");
    next();
  })
  .get("/hello", (request, response) => {
    response.json({
      message: "Hello from authenticated router!",
    });
  });

server
  .use(loggerPlugin())
  .use(staticPlugin({ path: "public" }))
  .use("/auth", authRouter)
  .get("/hello", (request: Request, response: Response) => {
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
