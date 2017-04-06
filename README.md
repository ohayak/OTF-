# Eirbot Inventory Application

This application have been designed to help Eirbot managing its inventory. The application is based on the framework On The Fly, and was designed by ENSEIRB-MATMECA students (Bordeaux, France).

# Pre-requisites

You need to install Node.js, npm, mongoDB and Redis on your server to use our application. For example, on Ubuntu 14.04 you just need to make :

<pre><code>$ sudo apt-get install nodejs npm redis-server build-essential python2.7 nodejs-legacy</code></pre>

You need to install graphicsmagic library for images work :
 
<pre><code>$ sudo apt-get install graphicsmagick</code></pre>

And you to install mongoDB v2.6.10 :

<pre><code>$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927</code></pre>
<pre><code>$ echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list</code></pre>
<pre><code>$ sudo apt-get update</code></pre>
<pre><code>$ sudo apt-get install -y mongodb-org</code></pre>

Create « /data/db/ » folder , on your system's root. (cd /)
In sudoer mode
<pre><code>$ sudo -s</code></pre>
<pre><code># mkdir /data</code></pre>
<pre><code># mkdir /data/db</code></pre>

After mongoDB installation, you can restore the database of the demo application by opening a terminal, go into your workspace directory to get source code and type :

<pre><code>$ sudo apt-get install git</code></pre>
<pre><code>$ git clone https://github.com/dhaurat/eirbot-inventory.git </code></pre>

Change the current directory to name "otf" :

<pre><code>$ mv eirbot-inventory otf</code></pre>

You need to start mongoDB with a ReplicatSet,
Go to  /data/db folder

<pre><code>$ sudo mongod --replSet otf_demo</code></pre>

In a new Terminal, run mongo shell you need to configure replicatSet like this :

Open Mongo DB
<pre><code>$ mongo</code></pre>
<blockquote>MongoDB shell version: 2.4.9</blockquote>
<blockquote>connecting to: test</blockquote>
Change the db 
<pre><code>> use otf_demo</code></pre>

<pre><code>>var config = {_id: "otf_demo", members: [{_id: 0, host: "127.0.0.1:27017"}]}</code></pre>
<pre><code>>rs.initiate(config)</code></pre>
<i>You should have this result :</i>
<code>
{
	"info" : "Config now saved locally.  Should come online in about a minute.",
	"ok" : 1
}</code>

<pre><code> exit</code></pre>

And return into dump directory (cd /workspace/otf/) :

<pre><code>$ cd dump</code></pre>

Restore database MongoDB like this :

<pre><code>$ mongorestore -d otf_demo ../BDD_EIRBOT/base_minimale_cryptee/otf_demo </code></pre>

<i>You should have this result in your Terminal:</i>
<code><pre>connected to: 127.0.0.1
Mon Apr 27 10:33:17.133 ./otf_demo/logs.bson
Mon Apr 27 10:33:17.133 	going into namespace [otf_demo.logs]
262 objects found
Mon Apr 27 10:33:17.135 	Creating index: { key: { _id: 1 }, ns: "otf_demo.logs", name: "_id_" }
Mon Apr 27 10:33:17.154 ./otf_demo/users.bson
Mon Apr 27 10:33:17.154 	going into namespace [otf_demo.users]
Mon Apr 27 10:33:17.157 	Created collection otf_demo.users with options: { "create" : "users", "autoIndexId" : true, "size" : 0, "capped" : false, "max" : 0, "strict" : true }
2 objects found
Mon Apr 27 10:33:17.157 	Creating index: { key: { _id: 1 }, ns: "otf_demo.users", name: "_id_" }
Mon Apr 27 10:33:17.158 ./otf_demo/accounts.bson
Mon Apr 27 10:33:17.158 	going into namespace [otf_demo.accounts]
Mon Apr 27 10:33:17.160 	Created collection otf_demo.accounts with options: { "create" : "accounts", "autoIndexId" : true, "size" : 0, "capped" : false, "max" : 0, "strict" : true }
1 objects found
Mon Apr 27 10:33:17.160 	Creating index: { key: { _id: 1 }, ns: "otf_demo.accounts", name: "_id_" }
Mon Apr 27 10:33:17.160 ./otf_demo/accountsuuid.bson
Mon Apr 27 10:33:17.160 	going into namespace [otf_demo.accountsuuid]
Mon Apr 27 10:33:17.162 	Created collection otf_demo.accountsuuid with options: { "create" : "accountsuuid", "autoIndexId" : true, "size" : 0, "capped" : false, "max" : 0, "strict" : true }
1 objects found
Mon Apr 27 10:33:17.162 	Creating index: { key: { _id: 1 }, ns: "otf_demo.accountsuuid", name: "_id_" }
Mon Apr 27 10:33:17.163 ./otf_demo/log.bson
Mon Apr 27 10:33:17.163 	going into namespace [otf_demo.log]
40 objects found
Mon Apr 27 10:33:17.164 	Creating index: { key: { _id: 1 }, ns: "otf_demo.log", name: "_id_" }
</pre></code>

<b>Create log directory</b>
Go back to the OTF's root directory.
<pre><code>$ cd ..</code></pre>
<pre><code>$ mkdir log</code></pre>

# Quick Start

Open a terminal, Go back to the OTF's root directory. :

<pre><code>$ cd otf</code></pre>

Get all the dependencies by npm :

<pre><code>$ npm install</code></pre>

and 

<pre><code>$ npm install bcrypt</code></pre>

Wait a moment for dependancies

Before launching OTF²,</br>

In new Terminal, Start "redis-server" in 'sudo' mode

Go back to the OTF's root directory.
<pre><code>/otf$ sudo redis-server</code></pre>
Stand "redis-server" start into the Terminal.

Now in the otf directory you can start the application :
<pre><code>$ ./start.sh</code></pre>

Now that the application is running on your server, you can access it by accessing your server's url. 

If you want to access it in localhost, just use the url :
<pre><code>http://localhost:3000</code></pre>

# Licence

OTF² is under LGPL V3 licence, you can see the licence file into the repository
