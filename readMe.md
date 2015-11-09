Chatroom
====

This repo contains a chatroom server (`index.js`) and a chat client (`index.html`/`app.js`). It suports following features:

  - Send and receive message to and from the chatroom.
  - 1:1 chat can be converted to a group chat by just sharing the URL.
  - Get notification if a member joins or leaves the chatroom. 

Demo
----
[Sample deployment on Heroku]


Version
----

0.4


Technologies
----
* Javascript (ECMAScript 6)
* Angular.js v1.4.7
* Node.js v5.0.0
* Socket.io v1.3.7
* Express.js v4.13.3
* Angular Bootstrap v0.14.3
* HTML5
* CSS3


Installation & Setup
----
* `git clone` or download and unzip this project.
* Download and install `node.js`.
* Use the following command to install node packages mentioned in `packages.json`
```sh
npm install
```

* Download and install `MongoDB`. 
* Mention the connection string in `index.js` line # 18 and run `MongoDB`.
* Run the project using following command:
```sh
node index.js
```

* After running the server, you can checkout the chatroom at `http://localhost:5000`

Deploying on Heroku
----
Heroku doesnt support static port number. So, make sure to change the port number in `index.js` line # 6 to `process.env.PORT`

Coming soon...
----
  - Emoticons support


License
----

[MIT] (Open source)

[MIT]:http://opensource.org/licenses/MIT
[Sample deployment on Heroku]:https://my-chatroom-demo.herokuapp.com/


___

Version History:
----
v0.4
-----------
* Updated as per Heroku's node project structure
* Migrated to MongoDB from Redis for persisting messages
* Added Angular Bootstrap UI components library

v0.3
-----------
* Upgraded Node.js to v5.0.0
* Upgraded Socket.io to v1.0

v0.2
-----------
* Performance enhancements and style fixes

v0.1
-----------
* Basic working setup
