# running locally

First steps towards a Node Express- Mongo DB project

npm init
tsc --init
git init

This project is developed using typescript and uses nodemon to automatically restart the development server, everytime there is any change in the files in the src folder. We are also using ts-node, which is a TypeScript execution engine and REPL (Read-Eval-Print Loop) for Node.js. It allows direct execution of TypeScript code on Node.js without the need for pre-compilation into JS.

We have installed dotenv as dev dependency to load environment variables from the local.env file in the root of the project. dotenv is only used for local development.

MongoDB is schema-less, which means documents can have any shape. That's flexible - but also risky. Mongoose lets you define schemas that enforce structure. Hence the mongoose npm package.

winston and morgan npm packages are for logging purposes. Morgan is a middleware for Express apps that logs incoming HTTP requests. On the other hand, Winston is a general-purpose logger for your entire application - not just HTTP.

axios is required when 1 microservice wants to communicate with another microservice.

Just running the below script in package.json

```
    "local": "set DOTENV_CONFIG_PATH=./local.env&&nodemon",

```

We are setting the environment variable DOTENV_CONFIG_PATH to ./local.env so that dotenv can pick the correct environment file when we execute the nodemon command.

Moving to the nodemon.json file. It's a configuration file used by Nodemon. Instead of passing command-line flags every time, you can define them once in this JSON file.

```
{
"watch": ["src"],
"ext": "ts,js",
"ignore": ["dist", "node_modules"],
"exec": "ts-node -r dotenv/config ./src/app.ts"
}

```

So Nodemon is going to watch only the src folder for any changes. It only going to watch only files with .ts or .js extension within the src folder. It will ignore any changes within the dist or the node_modules folder. Finally it will run the below command, everytime there is a change and also when the server is started for the first time using "npm run local"

```
ts-node -r dotenv/config ./src/app.ts

```

Note:
If you do not want to install the dotenv package, you can load environment variables using nodemon as well. Specify the environment vairables as key-value pairs within the "env" field in the nodemon.json, instead of defining it within the local.env file. You can skip the dotenv/config within the "exec" field.
```
{
"watch": ["src"],
"ext": "ts,js",
"ignore": ["dist", "node_modules"],
"env":{
  //define your key-value pairs here
},
"exec": "ts-node ./src/app.ts"
}
```

Finally in the "local" script in the package.json will be just executing the nodemon command.

```
"local": "nodemon",

```

how are we running MongoDb locally ?

We need to do this only once. not for every microservice because all microservices are running on the same host when running locally.


For local testing, we need to install the Community Edition of MongoDB. Below is the link. Here we download the Mongo DB community server and then install it. MongoDB Community Server is the free, open-source version of the MongoDB document database. It is widely used for development and non-production environments.

https://www.mongodb.com/try/download/community

 When installing the .msi, choose custom setup.Click Next and select to use mongodb as a service and not
as a local domain or user.

Once installed, you can create a empty data/db directory within C:/ using the command "mkdir data/db" in cmd . To start the mongodb server, which by default listens on the port 27017.

The MongoDB data directory is the location on the file system where MongoDB stores all of its data files, including collections, indexes, and oplog (for replica sets).
Default Locations:
Unix-like systems (Linux, macOS): /data/db
Windows: C:\data\db (on the drive from which mongod is started, if not specified)

Go to the bin folder of the installation on command prompt. For me it is C:\Program Files\MongoDB\Server\8.0\bin. Type "mongod" to start the mongodb server on default port 27017.

To verify if the mongodb server is running, enter the below in another command prompt window. If MongoDB is running, you will see a process named mongod.exe listed in the output, along with its PID (Process ID).

```
tasklist | findstr "mongod"

```

# Connecting to MongoDB

To connect to a MongoDB deployment, you need two things:

=>Connection URI, also known as a connection string, which tells the Node.js driver which MongoDB deployment to connect to.

=>MongoClient object, which creates the connection to and performs operations on the MongoDB deployment.

In  dbClient.ts below is the connection URI

const uri=`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

MONGO_HOST is nothing but the docker service name for mongodb
MONGO_PORT is 27017, which is default port, which the mongod process listens on ,internally in the container. It is better not to change
the port the mongod process listens on. Let the container port always be 27017. The host port needs to be changed if you have multiple
docker containers for mongodb within the same host.
MONGO_DB is myCartApp

There is no need to create a database before itself. myCartApp was not created. It got created
automatically on the first connection since it didnt exist.

myCartApp is the database. In this example, we are creating a carts collection in this database.
The collection again not explicitly created.

```
export default mongoose.model("Cart",cartSchema);

```

Since the schema model name was Cart, the collection name has become the plural lowercase version of the model name :carts. Each collection will have its mongoose schema.

## How to view the collections and documents in the database in docker container ?

Once docker image is built and docker containers for db,node and nginx are up and running,

In CMD,use the below  docker exec command to open an interactive mongosh session inside your running MongoDB container.

See the container name, we have in the docker compose file

```
docker exec -it <container-name> mongosh

```

Screenshot of above and below in public/images folder.

Once inside the mongosh shell session, execute the below command to show the list dbs.

```
show dbs
```

Switch to your db

```
use myCartApp

```

List the collections


```
show collections

```

Query the collections

```
db.products.find()

```

# Environment files:

We are using local.env for local running, dev.env for dev docker container and prod.env for prod docker container
common.env defines variables common to both dev and prod docker containers.

# running in docker

```
DEV Build the docker image

docker compose -p cart-microservices-dev -f docker/docker-compose.yml -f docker/docker-compose.dev.override.yml  build

docker compose -p cart-microservices-dev -f docker/docker-compose.yml -f docker/docker-compose.dev.override.yml up -d --remove-orphans --no-build

PROD: Run using the already built docker image

docker compose -p cart-microservices-prod -f docker/docker-compose.yml -f docker/docker-compose.prod.override.yml up -d --remove-orphans --no-build

```

Looking at docker-compose.dev.override.yml for db

```
cart-db:
      ports:
         - 27018:27017
      networks:
       - mynetwork-dev

```

Looking at docker-compose.prod.override.yml

```
 cart-db:
      ports:
         - 27019:27017
      networks:
       - mynetwork-prod

```

In the docker compose file, the container port(RHS) must be the port on which the mongod process within the container is listening on. This
port will always be 27017 so the container port(RHS) must also be 27017, unless you are changing the port on which the mongod process
itself listens on(which is very unncessary)
The host port (LHS) is 27018 which means that mongo db will be accessible on port 27018 of host machine for dev container
For prod docker container, the host port is 27019.
It should not be 27017 again because we already have another container mapped to
host port 27017 on the same host. So the host port needs to be different here.

Observe that we have defined 3 docker services for the express app: cart-node-1, cart-node-2 and cart-node-3

Express-gateway has the task of loadbalancing between these instances.

# SSL

Only for prod docker containers, we are using ssl self signed certificates.

Same rootCa certificate is used for all microservices and gateway project. That command already specified in gateway project.

For cart microservice, we execute the below commands to generate the certificates.

```
=> Generate private key
openssl genrsa -out cart.key 2048

=> Generate csr using private key
openssl req -key cart.key -new -out cart.csr

=>Sign csr with root ca and generate cart.crt using cart-config.ext

openssl x509 -req -CA rootCA.crt -CAkey rootCA.key -in cart.csr -out cart.crt -days 365 -CAcreateserial -extfile cart-config.ext

Below are the contents of the cart-config.ext

authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
DNS.2 = cart-node-1
DNS.3 = cart-node-2
DNS.4 = cart-node-3

```

We are bind mounting these cetificates from the host onto the container

```
volumes:
         - C:/Users/User/certificates/self-signed-custom-ca/rootCA.crt:/var/lib/certs/rootCA.crt
         - C:/Users/User/certificates/self-signed-custom-ca/cart.key:/var/lib/certs/cart.key
         - C:/Users/User/certificates/self-signed-custom-ca/cart.crt:/var/lib/certs/cart.crt     

```

We are referencing these certificates in the src/app.ts to create a https server if the environment is "prod".

```
if(process.env.APP_ENV === "prod"){
const options = {
      key: fs.readFileSync('/var/lib/certs/cart.key'), // Path to your private key
      cert: fs.readFileSync('/var/lib/certs/cart.crt')  // Path to your certificate
  };

https.createServer(options, app).listen(process.env.APP_HTTP_PORT, () => {
      winstonLogger.debug(`HTTPS server running on port ${process.env.APP_HTTP_PORT}`);
  });
}
else{
app.listen(process.env.APP_HTTP_PORT,()=>{
  winstonLogger.debug(`Server listening on port ${process.env.APP_HTTP_PORT}`)
})
}

```

Where is rootCA.crt used ? It is used in prod.env to set the below env variable

```
NODE_EXTRA_CA_CERTS=/var/lib/certs/rootCA.crt

```

The NODE_EXTRA_CA_CERTS environment variable in Node.js is used to specify an additional Certificate Authority (CA) certificate file that Node.js should trust when making HTTPS requests.

Why Use NODE_EXTRA_CA_CERTS?
By default, Node.js uses a built-in set of trusted root certificates. However, in enterprise or private environments, you might need to trust custom or internal CAs—for example:
- Your company uses a private CA to issue certificates for internal services.
- You're working with a self-signed certificate.
- You need to trust a third-party CA not included in Node’s default list.

When you set NODE_EXTRA_CA_CERTS, Node.js:
- Loads the specified PEM-encoded certificate file.
- Adds those certificates to the trust store used by TLS/HTTPS modules.
- Applies them globally to all HTTPS requests made by your Node.js app.


# Logging

Using winston + morgan for logging

npm i --save winston morgan
npm i --save-dev @types/morgan

set LOG_LEVEL=debug in local.env and common.env for usage in winstonLogger.js
If you dont set this, even debug logs appear as info.

As mentioned earlier, morgan is used for logging http requests and winston is a more genralised logger.

In src/logger, we have 2 files for winston and logger respectively.

Locally we are using combined.log and error.log in the root to store info+debug and error messages
respectively.

In docker, check the below variables set in common.env. The paths are different

```
stdoutPath=/var/log/cartmicrosvcs/combined.log
stderrPath=/var/log/cartmicrosvcs/error.log

```

Also in order to integrate this with ELK, we have done few more steps

1. Observe the filebeat folder in the root. Each microservice has the filebeat configured to pick up
the log messages from configured path, send them to logstash, which in turn sends them to elastic search. 
Kibana provides a visual display.

2. Logstash,Elastic Search and Kibana are configured in a seperate project. But filebeat needs to be in
every project, where log messages need to be collect, processed and displayed in kibana.

Moving to the docker-compose.yml

```
filebeat:
      restart: always
      build:
        context: ../
        dockerfile: filebeat/Dockerfile
      environment:
         - strict.perms=false
      volumes:
         - logs-volume:/var/log/cartmicrosvcs/:ro
      networks:
         - elk-network
```

In Docker, both named volumes and bind mounts are used to persist and share data between containers and the host system—but they serve different purposes and behave differently.
Here’s a clear comparison to help you choose the right one:

📦 Named Volumes
- Managed by Docker: Stored in Docker’s internal storage (/var/lib/docker/volumes/).
- Created by name: You can create them explicitly (docker volume create mydata) or implicitly when starting a container.
- Portable: Easier to use across environments (e.g., dev, staging, prod).
- Safe and isolated: Docker controls access, reducing risk of accidental deletion or modification.
- Backups and drivers: Can be backed up easily and support volume drivers (e.g., for cloud storage).
Use when:
- You want Docker to manage the storage.
- You need portability and isolation.
- You're deploying to production or orchestrating with Docker Compose or Swarm.

📂 Bind Mounts
- Direct host path: Maps a specific file or folder from the host system into the container.
- Full control: You can edit files directly on the host and see changes instantly in the container.
- Less portable: Depends on host file paths, which may vary across systems.
- More flexible: Useful for development, debugging, or sharing config files.
Use when:
- You need real-time access to host files (e.g., source code).
- You're developing locally and want to see changes instantly.
- You need to mount specific host directories.

So we have created a named volume called logs-volume

```
  volumes:
         - logs-volume:/var/log/cartmicrosvcs/:ro
```

- logs-volume is a named volume managed by Docker.
- Docker mounts this volume into the container at /var/log/cartmicrosvcs/.
- The :ro flag makes it read-only inside the container

So inside the container, when it accesses /var/log/cartmicrosvcs/, it's actually reading data from the logs-volume—not from a specific host directory.

🧠 Key Distinction
If you had used a bind mount like this:
volumes:
  - ./host-logs:/var/log/cartmicrosvcs/:ro


Then the container would be reading directly from the host path ./host-logs.
But with a named volume (logs-volume), Docker abstracts away the host path and manages the storage internally.


Observe that the docker service for the express app also references the named volume. The express app will write the logs using winston to the combined.log/error.log within /var/log/cartmicrosvcs folder. So this also means that these logs will be available in the logs-volume.
The filebeat service has ro access to the volume and can access the log messages.

```
 volumes:
       - logs-volume:/var/log/cartmicrosvcs
```

- logs-volume: A Docker-managed volume that stores data persistently.
- /var/log/cartmicrosvcs: The location inside the container where the volume is mounted.
- No :ro flag: So the mount is read-write by default—the container can read from and write to this volume.
- any logs or files written by the container to /var/log/cartmicrosvcs will be stored in logs-volume.
- This data persists even if the container is stopped or removed.
- Multiple containers can share this volume if needed.

Observe that the filebeat service is connected to an external network: elk-network. This is nothing but the network connecting
elasticsearch,logstash and kibana services. In order to communicate with logstash and other services, filbeat needs to be connected
to the same network.

```
networks:
         - elk-network
```

No ports specified for filebeat in docker compose ?

Filebeat is a log shipper, not a service that listens for incoming network traffic. It typically:
- Reads log files from mounted volumes or paths.
- Sends data out to Elasticsearch, Logstash, or other endpoints.
Because it acts as a client, it doesn’t expose ports by default—so you don’t need to specify any ports: unless you’re doing something custom, like exposing its monitoring endpoint.

So unless you're explicitly enabling monitoring or debugging, no ports is perfectly normal.

In the filebeat.yml, observe the service_name field added. This field will be used in the elk project
to differentiate between the logs of different microservices and gateways.

```
 fields:
           event.dataset: cart-microsvcs
           service_name: cart-microservice
```

Filebeat picks up log messages from the location specified in the path field and sends to logstash
*.log ensures that both combined.log and error.log are picked.

```
 paths:
            - /var/log/cartmicrosvcs/*.log
            
```