import { Code, Equation, InlineEquation } from "../../Utilities";


let content = (
    <div>

      <h1 class="title"><code>conda</code> environments</h1>

      <div>
        Published on <i>8th August 2019</i>
      </div>
      <hr />

      <div>
        <h2>Introduction</h2>
        <p><code>conda</code> environments are virtual environments in which your code can run. The benefit of building your code to run in a virtual environment is that it helps to keep your projects separated and keeping your python libraries cleaner. When it comes to putting your code on a different machine, e.g. when deploying into production or when another developer is working on the same code base, a virtual environment can help ensure that the code is running in as similar an environment as possible so that there are no unexpected errors.</p>

        <p>In this article we'll be covering <code>conda</code> virtual environments (there are alternatives, notably <a href="https://virtualenv.pypa.io/en/latest/"><code>virtualenv</code></a>). <code>conda</code> itself is a package manager for software libraries and belongs to the larger <a href="https://www.anaconda.com">Anaconda</a> platform. Instructions on installing Anaconda can be found <a href="https://docs.anaconda.com/anaconda/install/">here</a>.</p>
      </div>

      <div id="creating-a-conda-environment">
        <h2>Creating a conda environment</h2>
        <p>creating an environment is fairly simple, use the command,</p>

        <Code text={String.raw`conda create -n <environment name> python=3`} />
        <p>where <code>&lt;environment name&gt;</code> is the name of your environment, e.g. <code>my_environment</code>. Follow the prompts (you will need to have a connection to the internet).</p>
      </div>

      <div id="activating-and-deactivating-a-conda-environment">
        <h2>Activating and deactivating a <code>conda</code> environment</h2>
        <p>Once you've created the environment you'll need to activate it before being able to use it.</p>


        <Code text={`source activate <environment name>`} />

        <p>Note the shell prompt will now be prefixed by the name of your environment, it may look something like this.</p>

        <Code text={`(<environment name>) $`} />

        <p>To deactivate the environment and return to the previous state, use the command.</p>

        <Code text={`source deactivate`} />
        
      </div>


      <div id="installing-packages">
        <h2>Installing packages</h2>
        <p>To install a pack use the <code>conda install</code> command, e.g.</p>

        <Code language='bash' text={`conda install pandas`} />
        
        <p>by default <code>conda</code> installs software packages from the <a href="https://repo.continuum.io/pkgs">Anaconda repository</a>. In some cases the Anaconda repository will not have a python package you want to install, in that case you should try installing it with <code>pip</code> which installs python packages from the <a href="https://pypi.org/">PyPI repository</a>. Though both are package managers the general rule of thumb is to try to install a package with <code>conda</code> first, if it can't find the package, try <code>pip</code>. For more information on the difference between the two see <a href="https://www.anaconda.com/understanding-conda-and-pip/">here</a>.</p>
      </div>

      <div id="setting-environment-variables">
        <h2>Setting environment variables</h2>
        <p>If you are working on a project which involve custom python libraries, it is common to want to add those libraries to the <code>PYTHONPATH</code> environment variable. To do this you will need to add a shell script into the config directory of your environment variable. e.g.</p>

        <Code language='bash' text={`# create directories for the shell scripts
mkdir -p ~/<anaconda root directory>/envs/<environment name>/etc/conda/activate.d
mkdir -p ~/<anaconda root directory>/envs/<environment name>/etc/conda/deactivate.d

# create script files
touch ~/<anaconda root directory>/envs/<environment name>/etc/conda/activate.d/env_vars.sh
touch ~/<anaconda root directory>/envs/<environment name>/etc/conda/deactivate.d/env_vars.sh`} />

        <p>Then edit those bash files to set and unset your environment variables.</p>

        <Code language='bash' text={`# activate.d/env_vars
export PYTHONPATH=<project root>/lib

# deactivate.d/env_vars
unset PYTHONPATH`} />

      </div>
      

      <div id="common-conda-commands">
        <h2>Common <code>conda</code> commands</h2>
        <ul>
          <li><code>conda info --envs</code>: list the <code>conda</code> environments on you machine</li>
          <li><code>conda create -n &lt;environment name&gt; python=&lt;python version&gt;</code>: create a <code>conda</code> environment with the name <code>&lt;environment name&gt;</code></li>
          <li><code>conda remove --name &lt;environment name&gt; --all</code>: remove the <code>conda</code> environment</li>
        </ul>
      </div>

      <div id="further-reading">
        <h2>Further reading</h2>
        <ul>
          <li><a href="https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#">https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#</a></li>
        </ul>
      </div>
    </div>
);

function CondaEnvironments() {
    return content;
}

export default CondaEnvironments;
