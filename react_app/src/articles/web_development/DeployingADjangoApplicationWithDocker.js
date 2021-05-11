import { Code, Equation, InlineEquation } from "../../Utilities";


function DeployingADjangoApplicationWithDocker() {
    return (
        <div>
<h1 className="title">Deploying a <code>django</code> application with <code>docker</code></h1>

<div>
  Published on <i>7th August 2019</i>
</div>
<hr />

<div id="introduction">
  <h2>Introduction</h2>
  <p><code>django</code> is a Python web application framework and <code>docker</code> is a lightweight virtual machine which provides a controlled and reproducible environment for deploying software. Some of the advantages of this is easier scalability and simplified deployment. In this article we'll look at how to build a simple <code>django</code> application and then deploy it in a <code>docker</code> container onto a cloud based host service (<a href="www.digitalocean">Digitalocean</a> in this case).</p>
</div>

<div id="building-a-conda-environment">
  <h2>Building a <code>conda</code> environment</h2>
  <p>In this tutorial I'll first start off by creating a virtual environment. This is an optional step but it is useful for keeping your projects separated which keeps your python libraries cleaner. To do this I'll be using <code>conda</code> which is a package manager belonging to the Anaconda data science platform. There are other options, notably <a href="https://virtualenv.pypa.io/en/latest/">virtualenv</a> but the choice is yours.</p>

  <p>First install the Anaconda platform, you can find a link to it <a href="https://www.anaconda.com/">here</a>. After you've installed it you can check it's installed with the shell command,</p>

<Code text={String.raw`which conda`} />

  <p>Now to create an environment, use the command,</p>

<Code text={String.raw`conda create -n <environment name> python=3`} />

  <p>where <code>&lt;environment name&gt;</code> is the name of your environment, e.g. <code>my_environment</code>. Follow the prompts (you will need to have a connection to the internet). Once you've created the environment activate your virtual environment,</p>

<Code text={String.raw`source activate <environment name>`} />

</div>

<div id="building-a-simple-django-application">
  <h2>Building a simple <code>django</code> application</h2>

  <p>Then install <code>django</code> with <code>conda</code>.</p>

<Code text={String.raw`conda install django`} />
  
  <p>Once <code>django</code> is installed we can create our <code>django</code> project. Navigate to where you want your project to live and run the following command.</p>

<Code text={String.raw`django-admin startproject <project name>`} />

  <p>Navigate to the root directory of your project, e.g.</p>

<Code text={String.raw`cd ~/projects/my_project`} />

  <p>and then start your web server with the command,</p>

<Code text={String.raw`python manage.py runserver`} />

  <p>You may receive and error like this,</p>

<Code text={String.raw`...	
  File "/Users/dvoong/anaconda3/envs/test/lib/python3.7/site-packages/django/db/backends/sqlite3/introspection.py", line 4, in <module>
    import sqlparse
ModuleNotFoundError: No module named 'sqlparse'	`} />

  <p>if so, install the missing module,</p>

<Code text={String.raw`conda install sqlparse`} />

  <p>rerun the command to run the server and then open your web browser and navigate to the url <a href="localhost:8000">localhost:8000</a> or whichever port it ran on (check the output from the <code>runserver</code> command). You should see the <code>django</code> "install worked successfully" page. Since what the application does is not important for this tutorial we'll be using this as our application to deploy with <code>docker</code>.</p>
  
</div>

<div id="installing-docker">
  <h2>Installing docker</h2>
  <p>Docker is an opensource library but the Docker organisation have recently started making it more and more difficult to find the community edition, hiding it behind enterprise offerings on their main website. But you can find it on Docker Hub, <a href="https://hub.docker.com/search/?type=edition&offering=community">https://hub.docker.com/search/?type=edition&offering=community</a> or searching for "Docker Community Edition", you may need to create an account to download it though. After you've installed it check it's installed with the shell command,</p>

<Code text={String.raw`which docker`} />
  
</div>

<div id="mod_wsgi">
  <h2><code>mod_wsgi</code></h2>
  <p>Previously we deployed our <code>django</code> application locally using the <code>runserver</code> command. However it is not a good idea to use this when deploying in production, the official <code>django</code> tutorial states fairly early on that,</p>

  <blockquote className="blockquote">
    <p className="mb-0">... <b>don’t</b> use this server in anything resembling a production environment. It’s intended only for use while developing.</p>
  </blockquote>

  <p>However it doesn't give any hint on how to deploy an application in production but if you dig around a bit in the official documentation you'll find a <a href="https://docs.djangoproject.com/en/2.2/howto/deployment/">how to</a> on how to actually deploy an app in production. There you'll find a few options for deploying an app, <code>gunicorn</code>, <code>uWSGI</code>, <code>mod_wsgi</code>. In this tutorial we'll use the latter, simply because it's the last one I experimented with and have most recent exeprience with.</p>

  <p>To install <code>mod_wsgi</code> use the command,</p>

<Code text={String.raw`pip install mod_wsgi`} />

  <p>and test that it is working with the command,</p>

<Code text={String.raw`mod_wsgi-express start-server --port <optional port number>`} />

  <p>again if you navigate to your localhost through your web browser you will see <code>mod_wsgi</code>'s installation success page. Next, to make <code>mod_wsgi</code> work with <code>django</code>'s <code>manage.py</code> script you will need to add <code>mod_wsgi.server</code> to the list of installed apps. Edit the file located at <code>&lt;project root directory&gt;/&lt;project name&gt;/settings.py</code> and add it to the list of <code>INSTALLED_APPS</code>.</p>

<Code text={String.raw`...
	  
# Application definition                                                                                                                                                                                    

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'mod_wsgi.server'
]
...`} />

  <p>We can test this worked by running the command,</p>

<Code text={String.raw`python manage.py runmodwsgi`} />
  
</div>

<div id="building-a-docker-image" className="section">
  <h2>Building a <code>docker</code> image</h2>
  <p>So far we've been running our app in a Python virtual environment, now it's time to step up the virtualisation and run our app in a virtual machine. This further separates your personal working environment from the running environment of your application. This makes it easier when running your application on a different environment, e.g. running on a cloud environment or when other people are trying to run your code on their machine. To do this first we'll build a <code>docker</code> image, then create an instance of that image, i.e. a <code>docker</code> container and run our application on it.</p>

  <p>A <code>docker</code> image is like a recipe describing how to build the environment which your application will run in. It manifests itself as a list of instructions on how to setup the environment saved in a file generally named <code>Dockerfile</code> and located in the project root directory.</p>

<Code text={String.raw`# Dockerfile
FROM debian:latest

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y apache2
RUN apt-get install -y apache2-dev
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN pip3 install django==2.*
RUN pip3 install mod_wsgi==4.*

ADD . /code/
WORKDIR /code

CMD python3 manage.py runmodwsgi --user=www-data --group=www-data --port 8000`} />

  <p>The <code>FROM</code> command sets the starting point for our <code>docker</code> image. In this case we start from a pre-existing image named <code>debian</code> with the tag <code>latest</code>. This pre-existing image can be found in the <a href="https://hub.docker.com/">Docker Hub</a> repository. If you are familiar with Linux you may recognise that <a href="https://www.debian.org/">Debian</a> is the name of a Linux operating system, you can see more details about this image <a href="https://hub.docker.com/_/debian">here</a>.</p>

  <p><code>apt-get</code> is the install command for the <a href="https://en.wikipedia.org/wiki/APT_(Package_Manager)">APT</a> package manager used in Debian. <code>mod_wsgi</code> is dependent on the <a href="https://httpd.apache.org/">Apache</a> server so we'll install those dependencies with <code>apt-get</code>. If you want to use a different operating system you may need different dependencies, see <a href="https://pypi.org/project/mod-wsgi/">here</a> for more details.</p>

  <p>After that we install <code>django</code> and <code>mod_wsgi</code> using <code>pip</code>.</p>

  <p>the <code>ADD . /code/</code> command copies the code from the current directory (<code>.</code>) to a directory called <code>/code</code>. Then it navigates to this directory with the <code>WORKDIR</code> command. Finally we run our application as before with the <code>runmodwsgi</code> but we need to add a few extra options because when running our application through <code>docker</code> we assume the role of the <b>root</b> user which results in the following error.</p>

<blockquote className="blockquote">  
  WARNING: When running as the 'root' user, it is required that the options
'--user' and '--group' be specified to mod_wsgi-express. These should
define a non 'root' user and group under which the Apache child worker
processes and mod_wsgi daemon processes should be run. Failure to specify
these options will result in Apache and/or the mod_wsgi daemon processes
failing to start. See the mod_wsgi-express documentation for further
information on this restriction.
</blockquote>

  <p>Hence we need to set a different user and group when running our application.</p>

  <p>To build the <code>docker</code> image, from the project directory we use the command,</p>

<Code text={String.raw`docker build . -t latest`} />

  <p>which builds the container and tags it with the tag "latest". This should take a few minutes while <code>docker</code> downloads and installs the necessary requirements. Once it is done you should be able to see your new image with the command,</p>

<Code text={String.raw`docker image ls`} />
  
</div>

<div id="running-a-docker-container">
  <h2>Running a <code>docker</code> container</h2>
  <p>To create an instance (i.e. container) of your <code>docker</code> image and run it use the command,</p>

<Code text={String.raw`docker run -d -p 8001:8000 -t latest`} />

  <p>where the <code>-d</code> option runs the container in daemon mode meaning it will not block the terminal your running in and <code>-p</code> is an option mapping the port from the <code>docker</code> (e.g. your computer) to the container, (<code>&lt;docker host&gt;:&lt;docker container&gt;</code>). Before you run this command make sure that the port on your computer is available. Now go to your web browser and go to <a href="localhost:8001">localhost:8001</a> (or whichever port you chose) to check everything is working.</p>
  
</div>

<div id="common-docker-commands">
  <h2>Common <code>docker</code> commands</h2>
  <ul>
    <li><code>docker kill &lt;container id&gt;</code>: stops but does not remove a container</li>
    <li><code>docker rm &lt;container id&gt;</code>: removes a stopped container</li>
    <li><code>docker ps</code>: lists running containers</li>
    <li><code>docker container ls</code>: lists running containers</li>
    <li><code>docker ps -a</code>: lists all containers, including stopped/killed containers</li>
    <li><code>docker image rm &lt;image id&gt;</code>: remove a <code>docker</code> image</li>
    <li><code>docker image ls</code>: lists all docker images</li>
    <li><code>docker rm $(docker ps -aq)</code>: remove all containers, including stopped/killed containers</li>
    <li><code>docker image rm $(docker image ls -q)</code>: remove all <code>docker</code> images</li>
    <li><code>docker logs &lt;container id&gt;</code>: read the log files of a <code>docker</code> container. Useful for debugging issues</li>
  </ul>
</div>

<div id="provisioning-with-docker-machine">
  <h2>Provisioning with <code>docker-machine</code></h2>
  <p>So far we have managed to run our <code>django</code> application in a <code>docker</code> container but an application that just runs on your own machine is great for development but not too useful when deploying to the public realm. Now we need to provision a machine that will be available to the internet at all times and deploy our application there. First we'll provision a machine with <code>docker-machine</code> and then deploy it after that. From this point on we'll be working with external cloud services so you may need to have your wallet ready, hosting a site however is not too expensive (~$10 a month), sometimes free provided certain requirements are met.</p>

  <p>I'll be using the cloud service provider, <a href="www.digitalocean.com">Digital Ocean</a> in this tutorial, it's a pretty lightweight service which means you'll have to do a lot more of the work yourself but on the other hand you are less restricted by their more lightweight framework. Create an account and then create an <b>access token</b>. The access token enables you to spin up machines through the terminal instead of using the web interface. To create the access token go to the API section of the web interface and click "Generate New Token" and copy the token, it will be a random string of characters.</p>

  <p>I find it helpful to save the token at, <code>~/.digitalocean/access_tokens/&lt;token name&gt;</code> for future reference.</p>

  <p>To create the mahine, use the following command.</p>

<Code text={String.raw`docker-machine create --driver digitalocean --digitalocean-access-token <access token> <machine name>`} />

  <p>For more information on other options available when creating a machine on Digitalocean with <code>docker-machine</code> see <a href="https://docs.docker.com/machine/drivers/digital-ocean/">here</a>. Now use the following command to get information about the machine you just created.</p>

<Code text={String.raw`docker-machine env <machine name>`} />
  
  <p>then set up <code>docker</code> to point to your remote machine with the following command.</p>

<Code text={String.raw`eval $(docker-machine env <machine name>)`} />

  <p>Now when you list the <code>docker</code> images with the command <code>docker image ls</code> you are looking at the <code>docker</code> images on the remote machine and not your own machine. As a result you should now see an empty list. Repeat the command to build your <code>docker</code> container.</p>

<Code text={String.raw`docker build . -t latest`} />

  <p>and run it again, now this time on the remote machine.</p>

<Code text={String.raw`docker run -d -p 80:8000 -t latest`} />

  <p>Note I've changed the <code>docker</code> host port from 8001 in the previous example to port 80, this is the default port your web browser will make requests to, so you wont need to specify the port number to the remote machine. Now navigate to the IP address of your remote machine (this can be found using the <code>docker-machine env &lt;machine name&gt;</code> command).</p>

  <p>You should see an error saying you need to add the IP address of the remote machine to the <code>ALLOWED_HOSTS</code>. This is a secuirity measure to prevent <a href="https://docs.djangoproject.com/en/2.2/topics/security/#host-headers-virtual-hosting">Host header attacks</a>. To do this edit the <code>settings.py</code> file of your <code>django</code> project.</p>

<Code text={String.raw`...	

ALLOWED_HOSTS = [<remote machine IP address>]

...`} />

  <p>In future you'll probably want to use a domain name, to do that you'll need to first register a domain name from a registrar and then link that domain name to your remote machine. Then you'll want to update your <code>ALLOWED_HOSTS</code> to something like,</p>

<Code text={String.raw`...

ALLOWED_HOSTS = ['*.my_domain.co.uk']

...`} />

  <p>but we'll save that for another time.</p>

  <p>After you've updated the <code>settings.py</code> file, rebuild the image and redeploy it</p>

</div>

<div id="conclusion">
  <h2>Conclusion</h2>
  <p>Success! You should now have a website available on the internet that you can share with friends and family! But we've only really scratched the surface of deploying an actual production ready application to the web. We still need think about debugging, security keys, settings management, staticfiles, database management, multiple docker containers (i.e. <code>docker-compose</code>), etc. One step at a time.</p>
  
</div>
        </div>
    );
}

export default DeployingADjangoApplicationWithDocker;
