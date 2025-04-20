# express-lite

A fully type-safe ExpressJS like server built to understand how these NodeJS HTTP functions work. This will help understand how the type systems work across packages and how API's are designed to be iniuitive and developer friendly.

This project is a work in development and will be adding more items to the list below as and when I'm curious about anything HTTP/HTTPS

Will be adding examples for each of the items mentioned below as and when those are developed (Hopefully everything should be type-safe by the end)

## Proposed Syntax for the Server

```TS
    const server = new App();

    server.get("/hello-world", (reques, response) => {
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

- [ ] Should support all the basic HTTP methods
  - [ ] GET
  - [ ] POST
  - [ ] PUT
  - [ ] DELETE
- [ ] Should be able to set Status Codes for each request
- [ ] Should be able to send the following type of responses:
  - [ ] JSON
  - [ ] Text
  - [ ] HTML
- [ ] Should be able to manipulate the following:
  - [ ] Headers
  - [ ] Cookies
- [ ] Routes should be typesafe
  - [ ] If the route has any query params then the request object should have a typed query object
  - [ ] If the path contains dynamic segments, then those should be typed in the requests URL object (/user/:id)
- [ ] Route Groups
- [ ] Middlewares
  - [ ] For individual function
  - [ ] For a specific Route Group
- [ ] Serving static assets
- [ ] Support Async Functions
- [ ] Setting up a simple bundler system

Also, in addition to the above get the following things to work (Cherry on top 🤌):

- [x] A simple module bundler
- [x] Prettier
- [ ] Eslint
- [x] Jest
