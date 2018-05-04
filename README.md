Chat
====

This is a M.E.A.N. stack Chat application, it contains a chat server (`index.js`) and a chat client (`index.ejs`/`app.js`). It provides following features:

  - Send and receive message to and from the chat.
  - 1:1 chat can be converted to a group chat by just sharing the URL.
  - Get notification if a member joins or leaves the chat.

Demo
----
[Sample deployment on Heroku]


Version
----

0.5


Technologies
----
* Javascript
* Angular.js
* Node.js
* Socket.io
* Express.js
* MongoDB
* Bootstrap
* HTML5
* CSS3


Installation & Setup
----
* `git clone` or download and unzip this project.
* Download and install `node.js` https://nodejs.org
* Use the following command to install node packages mentioned in `packages.json`
```sh
npm install
```

* Download and install `MongoDB` https://www.mongodb.com
* Mention the connection string in `index.js` line # 18 and run `MongoDB`.
* Run the project using following command:
```sh
npm start
```

* After running the server, you can access the app at `http://localhost:5000`

Deploying on Heroku
----
Heroku doesnt support static port number. So, make sure to change the port number in `index.js` line # 6 to `process.env.PORT`. Mention the server URL on the client side (`app.js` line # 6).
For MongoDB hosting, I would recommend https://mlab.com

Coming soon...
----
  - Private chatrooms using system generated ID and user assigned password
  - Emoticons support


License
----

[MIT] (Open source)

[MIT]:http://opensource.org/licenses/MIT
[Sample deployment on Heroku]:https://my-chat-demo.herokuapp.com/


___

Version History:
----
v0.5
-----------
* Resolved security vulnerabilities in NPM modules, upgraded all outdated modules

v0.4
-----------
* Updated as per Heroku's node project structure
* Migrated to MongoDB from Redis for persisting messages

v0.3
-----------
* Upgraded Node.js to v5.0.0
* Upgraded Socket.io to v1.0

v0.2
-----------
* Performance enhancements

v0.1
-----------
* Basic working setup
