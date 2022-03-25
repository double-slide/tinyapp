# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (similar to bit.ly). Users can register, login and create/edit/delete their links.

## Final Product

!["Login Page"](https://github.com/double-slide/tinyapp/blob/master/docs/tinyApp_login.jpg "Login Page")

!["URL Summary Page"](https://github.com/double-slide/tinyapp/blob/master/docs/tinyApp_urls.jpg "URL Summary Page")

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- morgan

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.
- With the server running, use your browser to navigate to `localhost:8080/`

## Functionality
- A new user can register their email and password, and are then auto-logged in
- An existing user can use their email and password to login
- Once logged in, users can
  - create new URL short links (tinyURLs)
  - view a table of their existing link
  - edit or delete existing links

## Security
- Passwords entered by a user are hashed
- Browser cookies are encrypted, and are used by the app to verify login status
- Browser cookies are deleted upon logout

## Future Objectives
- Add database functionality to store user data and URLs
- Add logging functionality to when short URL links are used
- Build out error pages to provide more visual continuity for the user