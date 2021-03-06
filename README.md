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
- With the server running, use your browser to navigate to `localhost:8080/`[^1]
- **Note:** _the app will create and delete browser cookies during usage; if the server is restarted before the user logs out, cookies will need to be manually deleted from the browser for the next session_[^2]

## Functionality
- A new user can register their email and password, and are then auto-logged in [^3]
- An existing user can use their email and password to login
- Once logged in, users can
  - create new URL short links (tinyURLs)
  - view a table of their existing link
  - edit or delete existing links
- With the server running, any short link (tinyURL) can be used to access the full URL address

## Security
- Passwords entered by a user are hashed
- Browser cookies are encrypted, and are used by the app to verify user status (logged in or logged out)
- Browser cookies are deleted upon logout
- Only URLs owned (created) by a user are accessible to them for sharing, editing or deleting

## Future Objectives
1. Add database functionality to store user data and URLs
2. Add logging functionality to when short URL links are used
3. Build out error pages to provide more visual continuity for the user
4. Add persistant data storage for user data

[^1]: Currently only set-up for local running. Check back in future for the fully-hosted version!
[^2]: If using Chrome browser, [refer here](https://support.google.com/accounts/answer/32050?hl=en&co=GENIE.Platform%3DDesktop) for clearing cookies.
[^3]: User data is currently stored in short-term memory. Check back in future for persistant data functionality!