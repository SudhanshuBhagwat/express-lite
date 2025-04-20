import App from ".";

const server = new App();

server
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
  .listen();
