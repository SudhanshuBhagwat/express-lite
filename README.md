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

- [x] Should support all the basic HTTP methods
  - [x] GET
  - [x] POST
  - [x] PUT
  - [x] DELETE
  - [x] PATCH
- [x] Should be able to set Status Codes for each request
- [x] Should be able to send the following type of responses:
  - [x] JSON
  - [x] Text
  - [x] HTML
- [ ] Should be able to manipulate the following:
  - [x] Headers
  - [ ] Cookies
- [x] Routes should be typesafe
  - [x] If the path contains dynamic segments, then those should be typed in the requests URL object (/user/:id)
- [ ] Route Groups
- [ ] Middlewares
  - [x] For entire App
  - [ ] For individual function
  - [ ] For a specific Route Group
- [x] Serving static assets
- [ ] Support Async Functions

Also, in addition to the above get the following things to work (Cherry on top 🤌):

- [x] A simple module bundler
- [x] Prettier
- [ ] Eslint
- [x] Jest

And most importantly, HAVE FUN🕺 in the process
