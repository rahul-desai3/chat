Chat
====

This software repository/project contains a chat server (app.js) and a chat client (index.html). It suports following features:

  - Send message to the chatroom
  - Receive message from the chatroom
  - Receive offline messages (messages sent when the receiver was offline)
  - Get notification if new member joins the chatroom 


Version
----

0.2


Coming soon...
----
    
  - List of members online in the chatroom


Technologies
----
* Javascript
* jQuery core library v1.11.1
* Node.js v0.10.32
* Socket.io v1.2.0
* HTML5
* CSS3


Installation & Setup
----

* Download and install [Node.js] and [Socket.io] versions mentioned above, locally in the root folder of your project.
* Ensure that port 8080 is free (or you can use any port that is free, just mention it in app.js and index.html)
* To run the Node server, browser to you projet's root directory in your command prompt/terminal and issue the following command:

```sh
node app.js
```
* After running the server, you can checkout the chatroom at http://localhost:8080


License
----

[MIT] (Open source)

[Node.js]:http://nodejs.org/download/
[Socket.io]:https://www.npmjs.org/package/socket.io
[MIT]:http://opensource.org/licenses/MIT