# Metric Post Reader

Post reader is an app that let you read messaging from list of users.

## App Features
In this app, the reader can log-in with name and email, and a token is generated from the api for one hour which is then renewed by the app.

### Feature list
* Reader can log-in and logout, with the login page, and a provided log-out button
* Auto-renew readers token after one hour as passed and reader is still logged-in
* Can rad and manage senders messages in a nice smooth accordion style list
* Search box for filtering users and also for filtering messages
* Users list are alphabetical order with count of all their messages
* Button to order messages by date, from recent to older messages
* message pagination button, which fetch more messages for each user and update reflect on the ui.

## Setup and running the app
* run npm install
* npm run start
* Every is handled automatically by the app.

### Dependencies and others
* The only dependency I have used are (create-react-app, react-router-dom and prettier).
* Used SASS for css and OOP style with typescript
* Global State, session-storage is used for signed in reader token.
