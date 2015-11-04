Chatroom
====

This software repository/project contains a chatroom server (server.js) and a chat client (index.html). It suports following features:

  - Send message to the chatroom
  - Receive message from the chatroom
  - Receive offline messages (messages sent when the receiver was offline)
  - Get notification if a new member joins the chatroom 
  - List of members in the chatroom


Version
----

0.3


Coming soon...
----
  - Replace jQuery with Angular.js
  - Updated list of members online in the chatroom if someone disconnects


Technologies
----
* Javascript
* Node.js v5.0.0
* Socket.io v1.3.7
* Express.js v4.13.3
* jQuery core library v1.11.1
* Redis v2.3.0
* HTML5
* CSS3


Installation & Setup
----
* Download and unzip or `git clone` this project.
* Download and install Node.js and the following node modules: `socket.io`, `express`, `redis`. These node modules should be installed locally in the root folder of the project. Here is the command for installation:

```sh
npm install socket.io express redis
```

* Also download and install Redis server: http://redis.io/topics/quickstart
* Run the Redis server using the command `redis-server` in the redis directory.
* Ensure that port `8080` is free (or you can use any port that is free, just mention it in server.js and index.html)
* To run the Node server, browser to you projet's root directory in your command prompt/terminal and issue the following command:

```sh
node app.js
```

* After running the server, you can checkout the chatroom at `http://localhost:8080` (or with whatever port number that you used).


License
----

[MIT] (Open source)

[MIT]:http://opensource.org/licenses/MIT
