import { Code } from "../../Utilities";


function HowToCommentingWithDjangoComments() {
    return (
	<div>
          <h1>How to: Simple microservices app with Kubernetes, Flask and React</h1>

          <div>
            Published on <i>11th May 2021</i>
          </div>
          <hr />
          
          <div id="introduction">
            <h2>Introduction</h2>
            <p>This article describes how to build a lightweight scalable application composed of separate frontend and backend components. This application is built on a Kubernetes cluster and each component can be scaled independent of the other components. The frontend is built using <code>React.js</code> and the backend api is built using the lightweight Python framework <code>Flask</code>, state about the app is stored in a <code>postgres</code> database and routing client requests to either the frontend or backend is managed with the <code>nginx</code> webserver.</p>
          </div>

          <div id="architecture">
            <h2>Architecture</h2>
            <img src={`${process.env.PUBLIC_URL}/articles/web_development/how_to_simple_microservices_app_with_kubernetes_flask_and_react/architecture.png`} style={{maxWidth: '100%'}} />

            <p>Where a client makes a request it is first directed to nginx. If the url being requested begins with <code>/api/</code> the request will be redirected to the backend api else it will be passed to the frontend server.</p>

            <p>One of the advantages to having an architecture as shown above is the ability to scale components individually. For example, if there are long running processes in the backend component of the app, the number of instances of the backend component can be scaled up to prevent requests building up, without having to create frontend instances. This enables the best use of the computing resources.</p>

            <p>In addition to this there is also good code separation between the frontend and the backend, allowing independent work on either component without affecting eachother provided the api rules are adhered to.</p>
          </div>

          <div>
            <h2>Project structure</h2>
          </div>

          <div>
            <h2>Setting up a Kubernetes cluster</h2>
            <p>To begin with we'll need to install Docker which is used to build the containers in Kubernetes. Instructions on installing Docker can be found <a href="https://docs.docker.com/engine/install/">here</a>. Check it has been installed properly by inputting the following command in a terminal.</p>

            <Code language='shell' text={`docker --version`} />

            <p>Which should output something like this,</p>
            <Code language='shell' copy={false} text={`Docker version 20.10.2, build 20.10.2-0ubuntu1~20.04.2`} />
            
            <p>Next, create a local Kubernetes cluster using <code>minikube</code>, which is a tool for creating Kubernetes clusters locally. Follow the instructions <a href="https://minikube.sigs.k8s.io/docs/start/">here</a> to install <code>minikube</code>. Next create a cluster with the command,</p>

            <Code language='shell' text={`minikube start`} />

            <p>The output will look something like,</p>
            
            <Code language='shell' copy={false} text={`dvoong@dvoong$ minikube start
😄  minikube v1.19.0 on Ubuntu 20.04
✨  Using the docker driver based on existing profile
👍  Starting control plane node minikube in cluster minikube
🔄  Restarting existing docker container for "minikube" ...

🐳  Preparing Kubernetes v1.20.2 on Docker 20.10.5 ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
    ▪ Using image k8s.gcr.io/metrics-server/metrics-server:v0.4.2
    ▪ Using image kubernetesui/dashboard:v2.1.0
    ▪ Using image kubernetesui/metrics-scraper:v1.0.4
🌟  Enabled addons: default-storageclass, storage-provisioner, dashboard, metrics-server
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default`} />

            <p>Then install <code>kubectl</code> which is a tool for managing a Kubernetes cluster, see <a href="https://kubernetes.io/docs/tasks/tools/#kubectl">here</a> for more information.</p>

            <Code language='shell' text={`kubectl version`} />

            <p>Which should output something like this,</p>

            <Code language='shell' copy={false} text={`Client Version: version.Info{Major:"1", Minor:"21", GitVersion:"v1.21.0", GitCommit:"cb303e613a121a29364f75cc67d3d580833a7479", GitTreeState:"clean", BuildDate:"2021-04-08T16:31:21Z", GoVersion:"go1.16.1", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"20", GitVersion:"v1.20.2", GitCommit:"faecb196815e248d3ecfb03c680a4507229c2a56", GitTreeState:"clean", BuildDate:"2021-01-13T13:20:00Z", GoVersion:"go1.15.5", Compiler:"gc", Platform:"linux/amd64"}`} />

            <p>The status of the minikube cluster can be checked with the command,</p>

            <Code language='shell' text={`kubectl cluster-info`}/>

            <p>Which should output something like this,</p>

            <Code language='shell' copy={false} text={`Kubernetes control plane is running at https://192.168.49.2:8443
KubeDNS is running at https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.`} />
          </div>

          <div id="setting-up-nginx">
            <h2>Setting up nginx</h2>
            <p>First create a directory for the project.</p>
            <Code language='shell' text={`cd ~/
mkdir -p projects/kubernetes_microservice_app`}/>
            <p>Then create a directory for storing the config for nginx.</p>
            <Code language='shell' text={`cd ~/projects/kubernetes_microservice_app
mkdir nginx`} />
            <p>Next we'll create a deployment file which contains the information on how to configure nginx.</p>

            <small><code>~/projects/kubernetes_microservice_app/deployment.yaml</code></small>
            <hr />
            <Code language='yaml' text={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
`} />

            <p>Looking deeper into each component of the script,</p>
            <code>apiVersion</code>
            <p>The API version of the Kubernetes <code>control plane</code>. The <code>control plane</code> is the container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers. See <a href="https://kubernetes.io/docs/concepts/overview/components/">here</a> for more details.</p>
            <Code language='yaml' copy={false} text={`metadata:
  name: nginx`} />
            <p>The name of the deployment.</p>
            <Code language='yaml'copy={false} text='spec: ' />
            <p>The specifications for the deployment</p>
            <Code language='yaml'copy={false} text={`selector:
    matchLabels:
      app: nginx`} />
            <p>Tells the deployment which pods to match to, i.e. pods with the label <code>app: nginx</code></p>
            <Code language='yaml'copy={false} text={`  template:
    metadata:
      labels:
        app: nginx`} />
            <p>What labels to apply to the pods that the deployment creates. This should match the <code>matchLabels</code> shown earlier.</p>
            <Code language='yaml'copy={false} text={`    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80`}/>
            
            <p>The containers to be created on the pod. The image should correspond to a Docker image from a repository (normally from <a href="https://hub.docker.com/">Docker Hub</a>) but may also be from a local repository. In this case we use the <code>nginx</code> which is already on Docker Hub and can be found <a href="https://hub.docker.com/_/nginx">here</a>.</p>

            <Code language='yaml'copy={false} copy={false} text={`containerPort: 80`} />
            <p>This is the port in which your container can be reached from within the cluster.</p>

            <p>To apply the deployment use the following command,</p>
            <Code language='shell'text={`kubectl apply -f nginx/deployment.yaml`} />
            <p>Which should give an output like this,</p>
            <Code language='shell'copy={false} text={`deployment.apps/nginx created`} />
            <p>To check the deployment use the command,</p>
            <Code language='shell'text={`kubectl get deployments`} />
            <Code language='shell'copy={false} text={`NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
nginx                     1/1     1            1           10h
`} />
            <p>Also check the pods that are running,</p>
            <Code language='shell'text={`kubectl get pods`} />
            <p>output,</p>
            <Code language='shell'copy={false} text={`NAME                                       READY   STATUS    RESTARTS   AGE
nginx-7848d4b86f-5sp88                     1/1     Running   0          11h
`} />
            <p>We can also check to see if nginx is working properly by going into the cluster and making a HTTP request with <code>curl</code></p>

            <Code language='shell'text={`kubectl exec --stdin --tty nginx-7848d4b86f-5sp88 /bin/bash`} />
            <p>then from the bash shell in the pod,</p>
            
            <Code language='shell'text={`curl localhost`} />
            <p>with output,</p>
            <Code copy={false} language='html' text={`<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
`} />
            <h3>Setting up the nginx service</h3>
            <p>So far we have successfully managed to setup a nginx deployment and its corresponding pods. However nginx is only exposed inside of the cluster, which is why we need to <code>{`kubectl exec`}</code> to open a bash shell inside the pod we just created to access nginx.</p>
            <p>To expose the nginx service to the external world we need to create a service. We can do this by creating a yaml config file similar to how we created the deployment.</p>

            <small>~/projects/kubernetes_microservice_app/service.yaml</small>
            <hr />
            <Code language='yaml' text={`apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  type: LoadBalancer
  ports:
    - port: 80
  selector:
    app: nginx
`} />

            <p>Here we create a service with type <code>LoadBalancer</code> which enables our nginx service to be accessed from the internet. Make sure the,</p>

            <Code copy={false} language='yaml' text={`  selector:
    app: nginx`} />

            <p>matches the container label for the deployment.</p>

            <p>Check the service is running,</p>

            <Code language='shell' text={`kubectl get services`} />
            <p>output,</p>
            <Code copy={false} lanaguage='shell' text={`
NAME                      TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
nginx                     LoadBalancer   10.106.1.4       <pending>     80:30068/TCP                 12m
`}/>
            <p><code>minikube</code> requires an additional step in order to expose the service outside of the cluster. In a new terminal run the command,</p>

            <Code language='shell' text={`minikube tunnel`} />
            <p>Which will create a routing process allowing the service to be accessed from outside the cluster. Switch back to the previous terminal and check ther nginx service again.</p>

            <Code language='shell' text={`kubectl get services`} />
            <p>output,</p>
            <Code copy={false} language='shell' text={`NAME                      TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)                      AGE
nginx                     LoadBalancer   10.106.1.4       10.106.1.4      80:30068/TCP                 22m
`} />
            <p>Notice this time the <code>EXTERNAL-IP</code> field has been populated. Check we can access this service from web browser of using <code>curl</code> again.</p>
            <Code langauge='shell' text={`curl 10.106.1.4`} />
            <p>output,</p>
            <Code copy={false} language='html' text={`<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
`} />

            <p>We have successfully create an nginx service on a <code>minikube</code> cluster and exposed it outside of the cluster. </p>

            <h3>Scaling the nginx service</h3>
            <p>So far we have only one instance of nginx running, we can add more instances by adding <code>replicas</code> to the deployment config script.</p>

            <Code language='yaml' text={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
`} />

            <p>Then reapply the deployment.</p>

            <Code language='shell' text={`kubectl apply -f nginx/deployment.yaml`} />

            <p>Then check that a new pod has been added.</p>

            <Code language='shell' text={`kubectl get pods`} />

            <p>output,</p>

            <Code copy={false} language='shell' text={`NAME                                       READY   STATUS    RESTARTS   AGE
nginx-7848d4b86f-5sp88                     1/1     Running   0          12h
nginx-7848d4b86f-n66mg                     1/1     Running   0          12m
`} />

            <p>So far we have a functioning nginx server that is exposed outside of the cluster. Next we'll create a frontend reactjs app and link it to the nginx server.</p>
          </div>

          <div>
            <h2>Creating the frontend reactjs app</h2>
            <p>We'll be using the <code>create-react-app</code> toolchain to create the frontend app. To install it follow the instructions <a href="https://reactjs.org/docs/create-a-new-react-app.html#create-react-app">here</a>.</p>

            <p>From the project home, create the app with the commnd,</p>
            <Code text={`npm create-react-app frontend`} />
            <p>Then start the app locally,</p>
            <Code text={`cd frontend`} />
            <Code text={`npm start`} />
            <p>Check it is running properly by opening <code>localhost:3000</code> in your web browser.</p>
            <h3>Creating a Docker image</h3>
            <p>Next create a <code>Dockerfile</code> to build and serve the react app.</p>

            <small>~/projects/kubernetes_microservice_app/frontend/Dockerfile</small>
            <hr />
            <Code text={`FROM node

COPY package.json .

RUN npm install
RUN npm install -g serve 

COPY public public
COPY src src

RUN npm run build
CMD ["serve", "-s", "build", "-l", "3000"]`} />

            <p>Test the docker file by building and running the image in a container. From the directory <code>~/projects/kubernetes_microservice_app/frontend/</code> execute the command,</p>

            <Code language='shell' text={`docker build -t frontend/latest .`} />

            <p>Then run the image in a container,</p>

            <Code language='shell' text={`docker run -p 3000:3000 -t frontend/latest`} />

            <p>Then open <code>localhost:3000</code> in a web brower or using <code>curl</code>.</p>

            <h3>Pushing the Docker image onto Docker Hub</h3>
            <p>If everything is okay with the Dockerfile the next step is to upload the image to Docker Hub or a private Docker repository server so that it can be used with Kubernetes. Setup an account on <a href="https://hub.docker.com/">Docker Hub</a> and setup security access tokens. Next to upload it to Docker Hub retag the image to link it to your Docker Hub account like so,</p>

            <Code language='shell' text={`docker tag frontend:latest dvoong/frontend:latest .`}/>

            <p>Then push the image to Docker Hub,</p>

            <Code language='shell' text={`docker push dvoong/frontend:latest`} />

            <h3>Deploying the frontend to the Kubernetes cluster</h3>
            <p>We will need to create a deployment script as we did for nginx,</p>

            <small>~/projects/kubernetes_microservice_app/frontend/deployment.yaml</small>
            <hr />

            <Code language='yaml' text={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: dvoong/frontend:latest
`} />

            <p>Then apply the deployment,</p>
            <Code language='shell' text={`kubectl apply -f frontend/deployment.yaml`} />

            <h3>Creating a frontend service</h3>
            <p>Define a frontend service config,</p>
            <small>~/projects/kubernetes_microservice_app/frontend/service.yaml</small>
            <hr />
            
            <Code language='yaml' text={`apiVersion: v1
kind: Service
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  ports:
    - port: 3000
  selector:
    app: frontend`} />

            <p>Apply the service config,</p>

            <Code language='shell' text={`kubectl apply -f frontend/service/yaml`} />
            <p>Check the service is running,</p>

            <Code language='shell' text={`kubectl get services`} />

            <p>output,</p>
            <Code copy={false} language='shell' text={`NAME                      TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)                      AGE
frontend-service          ClusterIP      10.96.82.215     <none>          3000/TCP                     4m10s
nginx                     LoadBalancer   10.106.1.4       10.106.1.4      80:30068/TCP                 2d7h
`} />
            <p>Check the service is working by logging into a shell within the cluster,</p>

            <Code language='shell' text={`kubectl get pods`} />

            <p>output,</p>

            <Code copy={false} language='shell' text={`NAME                                       READY   STATUS             RESTARTS   AGE
frontend-54fbd986f9-drvjj                  1/1     Running            0          11m
frontend-54fbd986f9-n85hm                  1/1     Running            0          11m
nginx-567fb4698-ltw8w                      1/1     Running   0         2d
nginx-567fb4698-zz9fl                      1/1     Running   0         47h
`} />
            <p>Log into one of the pods,</p>

            <Code language='shell' text={`kubectl exec --stdin --tty frontend-54fbd986f9-drvjj /bin/bash`} />

            <p>Make a http request to the service, taking the IP address of the service from above,</p>

            <Code language='shell' text={`curl 10.96.82.215:3000`} />

            <p>If the response is successful then everything is okay.</p>
          </div>

          <div>
            <h2>Creating the backend flask app</h2>
            <p>Flask is a lightweight python web application framework, if you're new to Flask you can find more information about it <a href="https://flask.palletsprojects.com/en/2.0.x/quickstart/">here</a>.</p>

            <Code language='shell' text={`cd ~/projects/kubernetes_microservice_app`} />
            <Code language='shell' text={`mkdir -p backend/backend`} />

            <Code language='shell' text={`cd backend`} />

            <p>Install virtualenv, <a href="https://virtualenv.pypa.io/en/latest/installation.html">here</a> then crete a new virtual environment,</p>
            <Code language='shell' text={`virtualenv venv --python=3`} />

            <p>Activate the environment,</p>
            <Code language='shell' text={`source venv/bin/activate`} />

            <p>Install Flask</p>
            <Code language='shell' text={`pip install flask`} />

            <p>Create a small Flask app</p>
            <small>~/projects/kubernetes_microservice_app/backend/backend/__init__.py</small>
            <hr />

            <Code language='python' text={`from flask import Flask


def create_app():
    app = Flask(__name__)

    @app.route('/status')
    def status():
        return {'status': 'OK'}
    
    return app
`} />

            <p>Start the Flask app locally</p>

            <Code language='shell' text={`FLASK_APP=backend FLASK_ENV=development FLASK_DEBUG=1 flask run`} />

            <p>Check it is running properly by opening <code>localhost:5000/status</code> in your web browser. You should receive,</p>

            <Code language='json' text={`{"status": "OK"}`} />

            <h3>Creating a Docker image</h3>
            <p>Next create a <code>Dockerfile</code> to build and serve the Flask app.</p>

            <small>~/projects/kubernetes_microservice_app/backend/Dockerfile</small>
            <hr />
            <Code language='python' text={`FROM python:3

COPY requirements.txt .
RUN pip install flask
RUN pip install gunicorn

COPY backend backend

CMD ["gunicorn", "-b", "0.0.0.0:5000", "backend:create_app()"]`} />

            <p>Test the docker file by building and running the image in a container. From the directory <code>~/projects/kubernetes_microservice_app/backend/</code> execute the command,</p>

            <Code language='shell' text={`docker build -t backend/latest .`} />

            <p>Then run the image in a container,</p>

            <Code language='shell' text={`docker run -p 5001:5000 -t backend/latest`} />

            <p>Then open <code>localhost:5001/status</code> in a web brower or using <code>curl</code>. You should receive the response,</p>

            <Code language='json' text={`{"status": "OK"}`} />

            <h3>Pushing the Docker image onto Docker Hub</h3>
            <p>If everything is okay with the Dockerfile the next step is to upload the image to Docker Hub or a private Docker repository server so that it can be used with Kubernetes. Setup an account on <a href="https://hub.docker.com/">Docker Hub</a> and setup security access tokens. Next to upload it to Docker Hub retag the image to link it to your Docker Hub account like so,</p>

            <Code language='shell' text={`docker tag backend:latest dvoong/backend:latest .`}/>

            <p>Then push the image to Docker Hub,</p>

            <Code language='shell' text={`docker push dvoong/backend:latest`} />

            <h3>Deploying the backend to the Kubernetes cluster</h3>
            <p>We will need to create a deployment script as we did for nginx,</p>

            <small>~/projects/kubernetes_microservice_app/backend/deployment.yaml</small>
            <hr />

            <Code language='yaml' text={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: dvoong/backend:latest`} />

            <p>Then apply the deployment,</p>
            <Code language='shell' text={`kubectl apply -f backend/deployment.yaml`} />

            <h3>Creating a backend service</h3>
            <p>Define a backend service config,</p>
            <small>~/projects/kubernetes_microservice_app/backend/service.yaml</small>
            <hr />
            
            <Code language='yaml' text={`apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  ports:
    - port: 5000
  selector:
    app: backend`} />

            <p>Apply the service config,</p>

            <Code language='shell' text={`kubectl apply -f backend/service/yaml`} />
            <p>Check the service is running,</p>

            <Code language='shell' text={`kubectl get services`} />

            <p>output,</p>
            <Code copy={false} language='shell' text={`NAME                      TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)                      AGE
backend                   ClusterIP      10.106.66.38     <none>          5000/TCP                     6m18s
frontend                  ClusterIP      10.109.97.149    <none>          3000/TCP                     2m59s
nginx                     LoadBalancer   10.106.1.4       10.106.1.4      80:30068/TCP                 2d9h
`} />
            <p>Check the service is working by logging into a shell within the cluster,</p>

            <Code language='shell' text={`kubectl get pods`} />

            <p>output,</p>

            <Code copy={false} language='shell' text={`NAME                                       READY   STATUS             RESTARTS   AGE
backend-5c896d7f45-66q7n                   1/1     Running            0          2m21s
backend-5c896d7f45-bs8gh                   1/1     Running            0          2m21s
frontend-54fbd986f9-drvjj                  1/1     Running            0          87m
frontend-54fbd986f9-n85hm                  1/1     Running            0          87m
nginx-567fb4698-ltw8w                      1/1     Running   0         2d2h
nginx-567fb4698-zz9fl                      1/1     Running   0         2d

`} />
            <p>Log into one of the pods,</p>

            <Code language='shell' text={`kubectl exec --stdin --tty /bin/bash`} />

            <p>Make a http request to the service, taking the IP address of the service from above,</p>

            <Code language='shell' text={`curl 10.106.66.38:5000/status`} />

            <p>If the response is successful then everything is okay.</p>
          </div>

          <div>
            <h2>Linking nginx to the frontend and backend</h2>
            <p>So far we have an nginx server, a react frontend and a flask backend but none of them are linked. If we make a request to the nginx service we still receive the default nginx response. To link the server to our apps we need to override the default nginx config found at <code>/etc/nginx/conf.d/default.conf</code> with our own custom config,</p>

            <small>~/projects/kubernetes_microservice_app/nginx/default.conf.template</small>
            <hr />

            <Code language='text' text={`server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    server_name localhost;

    location / {
        proxy_pass http://\${FRONTEND_SERVICE_HOST}:3000;
    }

    location /api/ {
        proxy_pass http://\${BACKEND_SERVICE_HOST}:5000/;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

}`}/>

            <p>Where <code>{`\${FRONTEND_SERVICE_HOST}`}</code> and <code>{`\${BACKEND_SERVICE_HOST}`}</code> correspond to the names of the services we defined in the <code>service.yaml</code> config scripts.</p>

            <p>To pass this custom config to the nginx Docker image we can mount this file using a volume to <code>/etc/nginx/templates</code> (which is where the nginx image expects to find these files). We can mount this volume using Kubernetes <code>configmaps</code>.</p>

            <Code language='shell' text={`kubectl create configmap --from-file=nginx/default.conf.template nginx`} />

            <p>Which creats a configmap with name <code>nginx</code>. Then update the <code>nginx/deployment.yaml</code> to use the configmap, </p>

            <Code language='yaml' text={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
          volumeMounts:
            - name: configmap
              mountPath: /etc/nginx/templates

      volumes:
        - name: configmap
          configMap:
            name: nginx
`} />

            <p>Reapply the deployment,</p>

            <Code language='shell' text={`kubectl apply -f nginx/deployment.yaml`} />

            <p>Now if you make a request to the nginx server you should be directed to the frontend app unless the path is prefixed with <code>/api</code>.</p>

            <Code language='shell' text={`kubectl get services`} />

            <Code language='shell' text={`NAME                      TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)                      AGE
backend                   ClusterIP      10.106.66.38     <none>          5000/TCP                     43m
frontend                  ClusterIP      10.109.97.149    <none>          3000/TCP                     40m
nginx                     LoadBalancer   10.106.1.4       10.106.1.4      80:30068/TCP                 2d9h
`} />

            <Code language='shell' text={`curl 10.106.1.4`} />

            <p>output,</p>

            <Code copy={false} language='html' text={`<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Web site created using create-react-app"/><link rel="apple-touch-icon" href="/logo192.png"/><link rel="manifest" href="/manifest.json"/><title>React App</title><link href="/static/css/main.9d5b29c0.chunk.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div><script>!function(e){function r(r){for(var n,i,a=r[0],c=r[1],f=r[2],s=0,p=[];s<a.length;s++)i=a[s],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&p.push(o[i][0]),o[i]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);for(l&&l(r);p.length;)p.shift()();return u.push.apply(u,f||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,a=1;a<t.length;a++){var c=t[a];0!==o[c]&&(n=!1)}n&&(u.splice(r--,1),e=i(i.s=t[0]))}return e}var n={},o={1:0},u=[];function i(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.e=function(e){var r=[],t=o[e];if(0!==t)if(t)r.push(t[2]);else{var n=new Promise((function(r,n){t=o[e]=[r,n]}));r.push(t[2]=n);var u,a=document.createElement("script");a.charset="utf-8",a.timeout=120,i.nc&&a.setAttribute("nonce",i.nc),a.src=function(e){return i.p+"static/js/"+({}[e]||e)+"."+{3:"c77f1f4c"}[e]+".chunk.js"}(e);var c=new Error;u=function(r){a.onerror=a.onload=null,clearTimeout(f);var t=o[e];if(0!==t){if(t){var n=r&&("load"===r.type?"missing":r.type),u=r&&r.target&&r.target.src;c.message="Loading chunk "+e+" failed.\n("+n+": "+u+")",c.name="ChunkLoadError",c.type=n,c.request=u,t[1](c)}o[e]=void 0}};var f=setTimeout((function(){u({type:"timeout",target:a})}),12e4);a.onerror=a.onload=u,document.head.appendChild(a)}return Promise.all(r)},i.m=e,i.c=n,i.d=function(e,r,t){i.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,r){if(1&r&&(e=i(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)i.d(t,n,function(r){return e[r]}.bind(null,n));return t},i.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(r,"a",r),r},i.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},i.p="/",i.oe=function(e){throw console.error(e),e};var a=this.webpackJsonpfrontend=this.webpackJsonpfrontend||[],c=a.push.bind(a);a.push=r,a=a.slice();for(var f=0;f<a.length;f++)r(a[f]);var l=c;t()}([])</script><script src="/static/js/2.16ce9e39.chunk.js"></script><script src="/static/js/main.e5606f27.chunk.js"></script></body></html>`} />

            <p>Which is the expected output from the react app,</p>

            <Code language='shell' text={`curl 10.106.1.4/api/status`} />

            <p>output,</p>

            <Code copy={false} language='html' text={`{"status":"OK"}`} />
            
          </div>

          <div>
            <h2>Adding postgres to our architecture</h2>
            
            <small>~/projects/kubernetes_microservice_app/postgres/deployment.yaml</small>
            <hr />

            <Code language='yaml' text={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres
                  key: POSTGRES_PASSWORD
                  
`} />

            <p>The postgres image requires a <code>POSTGRES_PASSWORD</code>, we can create a secret using <code>kubectl</code> and pass it to the deployment,</p>

            <Code language='shell' text={`kubectl create secret generic --from-literal=POSTGRES_PASSWORD=postgres_secret postgres`} />

            <p>Which creates a secret with name <code>postgres</code> with one field called <code>POSTGRES_PASSWORD</code>,</p>

            <Code language='shell' text={`kubectl get secrets`} />

            <p>output,</p>

            <Code copy={false} language='shell' text={`NAME                  TYPE                                  DATA   AGE
postgres              Opaque                                1      4s`} />

            <Code language='shell' text={`kubectl describe secret postgres`} />

            <p>output,</p>

            <Code copy={false} language='shell' text={`Name:         postgres
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
POSTGRES_PASSWORD:  15 bytes
`} />

            <p>Apply the deployment,</p>

            <Code language='shell' text={`kubectl apply -f postgres/deployment.yaml`} />

            <p>Check the pods,</p>

            <Code language='shell' text={`kubectl get pods`} />
            <Code copy={false} language='shell' text={`NAME                                       READY   STATUS    RESTARTS   AGE
backend-5c896d7f45-66q7n                   1/1     Running   0          65m
backend-5c896d7f45-bs8gh                   1/1     Running   0          65m
frontend-54fbd986f9-drvjj                  1/1     Running   0          150m
frontend-54fbd986f9-n85hm                  1/1     Running   0          150m
nginx-5cd79cbf99-9bzwg                     1/1     Running   0          16m
nginx-5cd79cbf99-gx48w                     1/1     Running   0          16m
postgres-688c8bf76c-qhn4x                  1/1     Running   0          3s`} />

          <p>Create a service for the postgres server,</p>

            <small>~/projects/kubernetes_microservice_app/postgres/service.yaml</small>
          <hr />
            <Code language='shell' text={`apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  ports:
    - port: 5432
  selector:
    app: postgres
`} />

          <p>Apply the service,</p>

          <Code language='shell' text={`kubectl apply -f postgres/service.yaml`} />

          <h3>Updating the backend app to link to postgres</h3>

          <small>~/projects/kubernetes_microservice_app/backend/deployment.yaml</small>
          <hr />
          <Code language='yaml' text={`apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: dvoong/backend:latest
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres
                  key: POSTGRES_PASSWORD
          
`} />

          <p>Where we have passed the <code>POSTGRES_PASSWORD</code> also to the backend app.</p>

          <small>~/projects/kubernetes_microservice_app/backend/backend/__init__.py</small>
          <hr />
          <Code language='python' text={`import os

from flask import Flask
import psycopg2


def create_app():
    app = Flask(__name__)

    connector = psycopg2.connect(
        'postgresql://postgres:{}@{}/postgres'.format(
            os.environ.get('POSTGRES_PASSWORD'),
            os.environ.get('POSTGRES_SERVICE_HOST'),
        )
    )

    @app.route('/status')
    def status():
        return {'status': 'OK'}

    @app.route('/postgres-status')
    def postgres_status():
        return {'connector': str(connector)}
    
    return app
`} />

          <p>Above we have created a connection to the postgres service and added a route to check the status of the connection.</p>
          
          <small>~/projects/kubernetes_microservice_app/backend/Dockerfile</small>
          <hr />
        <Code language='shell' text={`FROM python:3

COPY requirements.txt .
RUN pip install flask
RUN pip install gunicorn
RUN pip install psycopg2

COPY backend backend

CMD ["gunicorn", "-b", "0.0.0.0:5000", "backend:create_app()"]`} />

          <p>Above we have added <code>psycopg2</code> to the python requirements, this module is used to connect to a postgres database.</p>

          <p>Rebuild the docker image,</p>

        <Code language='shell' text={`cd ~/projects/kubernetes_microservice_app/backend`} />
          <Code language='shell' text={`docker build -t dvoong/backend:latest .`} />
          <Code language='shell' text={`docker push dvoong/backend:latest`} />

          <p>Then redeploy the backend app,</p>

        <Code language='shell' text={`cd ~/projects/kubernetes_microservice_app`} />
          <Code language='shell' text={`kubectl apply -f backend/deployment.yaml`} />

          <p>Now to test the new api endpoint to check the postgres connection </p>

            <Code language='shell' text={`curl 10.106.1.4/api/postgres-status`} />

          <p>output,</p>

          <Code copy={false} language='json' text={`{"connector":"<connection object at 0x7fb256803c20; dsn: 'user=postgres password=xxx dbname=postgres host=10.100.82.143', closed: 0>"}`} />

          <p>Congratulations we have successfully created a cluster with independent and scalable frontend and backend components together with a postgres database.</p>
          </div>

          <div>
            <h2>Conclusion</h2>
            <p>We have successfully built a scalable application with good separation between frontend, backend and database. This enables greater flexibility to develop an app, scale an app and to upgrade an app without any interruption to the service. So far we have been working locally using the <code>minikube</code> cluster tool, however moving our app to cloud based implementation of a Kubernetes is relatively simple. This involves configuring <code>kubectl</code> to point to a cluster on the cloud and then using the commands shown in this article (there maybe some additional tools to install depending on the provider. Example cloud providers include <a href="https://www.digitalocean.com/products/kubernetes/">Digitalocean</a> and <a href="https://aws.amazon.com/eks/?whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc&eks-blogs.sort-by=item.additionalFields.createdDate&eks-blogs.sort-order=desc">AWS</a>. Once you've built a cluster on a cloud provider you app will be accessible by the internet!</p>
          </div>
          
        </div>


    );
}

export default HowToCommentingWithDjangoComments;


