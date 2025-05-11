# express-lite

A fully type-safe ExpressJS like server built to understand how these NodeJS HTTP functions work. This will help understand how the type systems work across packages and how API's are designed to be iniuitive and developer friendly.

This project is a work in development and will be adding more items to the list below as and when I'm curious about anything HTTP/HTTPS

Will be adding examples for each of the items mentioned below as and when those are developed (Hopefully everything should be type-safe by the end)

## Proposed Syntax for the Server

```TS
import App from "express-lite";

const server = new App();

server.get("/hello-world", (request, response) => {
  response
      .status(200) // Can be ommitted if we don't want to explicitely send it
      .headers({
        foo: bar
      })
      .json({
        message: "Hello World!!"
      });
}).listen(8080); // The port parameter can be ommitted if we want the server to start at Port: 8080
```

## Basic Functionalities

- [x] Should support all the basic HTTP methods
  - [x] GET
    ```TS
    const server = new App();
    server.get("/products", (request, response) => {});
    ```
  - [x] POST
    ```TS
    const server = new App();
    server.post("/products/create", (request, response) => {});
    ```
  - [x] PUT
    ```TS
    const server = new App();
    server.put("/products/update", (request, response) => {});
    ```
  - [x] DELETE
    ```TS
    const server = new App();
    server.delete("/products/:productId", (request, response) => {});
    ```
  - [x] PATCH
    ```TS
    const server = new App();
    server.patch("/products/:productId", (request, response) => {});
    ```
- [x] Should be able to set Status Codes for each request

  ```TS
  const server = new App();
  server.get("/hello-world", (request, response) => {
    response.status(200) // Can be ommitted if we don't want to explicitely send it
  })
  ```

  - In order to make it simpler, the exported **_STATUS_CODE_** can also be used to set statuses. Eg. STATUS_CODE.NOT_FOUND, STATUS_CODE.OK

- [x] Should be able to send the following type of responses:

  - [x] JSON

    ```TS
    server.get("/hello-world", (request, response) => {
      response.json({
        message: "Hello World!!"
      });
    });
    ```

  - [x] Text
    ```TS
    server.get("/hello-world", (request, response) => {
      response.send("Hello World!");
    });
    ```
  - [x] HTML
    ```TS
    server.get("/hello-world", (request, response) => {
      response.html(`
        <html>
          <body>
            Hello World from HTML land!!
          </body>
        </html>
      `);
    });
    ```

- [ ] Should be able to manipulate the following:

  - [x] Headers

    ```TS
    server.get("/hello-world", (request, response) => {
      response.headers({
        foo: bar
      })
    })
    ```

    - New headers can be directly added in the Object on the **_headers_** method. When using Typescript, it can also help autocomplete the pre-existing headers that can be sent via the HTTP protocol.

  - [ ] Cookies

- [x] Routes should be typesafe

  - [x] If the path contains dynamic segments, then those should be typed in the requests URL object (/user/:id)

    ```TS
    import App from "express-lite";
    const server = new App();

    server.get("/products/:productId", (request, response) => {
      request.params.productId
    })
    ```

    - You can define a new dynamic route param but appending a **_:(semicolon)_** before the route param name. Eg. **_:productId_**
    - This route param should be available on the **_request.params_** object with complete typesafety

- [x] Route Groups

  ```TS
  import App, { Router } from "express-lite";

  const server = new App();
  const router = new Router();

  router.get("hello", (request, response) => {});

  server
    .use("/api", router)
    .get("/hello-world", (request, response) => {
      response.status(200) end();
    }).listen(8080);
  ```

  - A **_Router_** is basically the App object itself but it encapsulated the functionality of the Server within it.
  - A **_Router_** can be added to an existing App or a different Router all together.
  - To use a router, it should be provided in the **_use_** method on the App/Router with a sub-route URI and the newly created Router itself.

- [ ] Middlewares

  - [x] For entire App

    ```TS
    import App from "express-lite";

    const server = new App();

    const middleware = (req, res, next) => {
      console.log("Logging from middleware");
      next();
    }

    server
      .use(middleware())
      .get("/hello-world", (request, response) => {
        response.status(200) end();
      }).listen(8080);
    ```

    - A **_middleware_** is basically a function which will accept a request, response and a next function.
    - We can write any business logic for preventing the user flow or adding new information the request or response object.
    - To continue the execution of the further function call, make sure to call the **_next_** function after the newly added business logic.

  - [ ] For individual function
  - [x] For a specific Route Group

    ```TS
    import App, { Router } from "express-lite";

    const server = new App();
    const router = new Router();

    router
      .use(middleware())
      .get("hello", (request, response) => {});

    const middleware = (req, res, next) => {
      console.log("Logging from middleware");
      next();
    }

    server.get("/hello-world", (request, response) => {
      response.status(200) end();
    }).listen(8080);
    ```

    - Similar to adding the Middleware to the App object, it can also be easily added to the Router directly for any specific functionality for the specific route group.

- [x] Serving static assets

  ```TS
  import App, { staticPlugin } from "express-lite";

  const server = new App();

  server
    .use(staticPlugin({ path: "public" }))
    .get("/hello-world", (request, response) => {
      response.status(200) end();
    }).listen(8080);
  ```

  - The staticPlugin can be used to serve static files from a specific path.
  - This **_path_** should be present in the root of the project directly that should contain all the static assets.
  - The server will automatically server the files with the correct content-type and the rest of the parameters required.

- [ ] Support Async Functions

Also, in addition to the above get the following things to work (Cherry on top 🤌):

- [x] A simple module bundler
- [x] Prettier
- [ ] Eslint
- [x] Jest

And most importantly, HAVE FUN🕺 in the process
