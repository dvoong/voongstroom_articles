import { Code, Equation, InlineEquation } from "../../Utilities";


function SchedulingTasksWithAirflow() {
    return (
        <div>

          <h1 className="title">Scheduling tasks with Airflow</h1>

          <div>
            Published on <i>14th August 2019</i>
          </div>
          <hr />

          <div id="introduction">
            <h2>Introduction</h2>
            <p>Airflow is an application for scheduling tasks into workflows. Workflows are structured as Directed Acyclic Graphs (DAGs) where each task is represented as a node in the graph and dependencies are represented by vertices between nodes. When a workflow is started in Airflow nodes/tasks will only be executed when their dependencies have been executed and completed. This allows for complex workflows to be easily scheduled in an efficient way as possible. Furthermore Airflow provides a rich user interface which allows users to easily manage their workflows and identify bottlenecks in a workflow and how they might better optimise their workflows.</p>
          </div>

          <img className="article-image" src={`${process.env.PUBLIC_URL}/articles/data_engineering/scheduling_tasks_with_airflow/airflow_dag_example.png`} />

          <div id="installation">
            <h2>Installation</h2>
            <p>We'll begin by creating a <code>conda</code> environment.</p>

            <Code language='shell' text={String.raw`conda create -n &lt;environment name&gt; python=3`} />

            <p>And activating the environment</p>

            <Code language='shell' text={String.raw`source activate &lt;environment name&gt;`} />

            <p>Install the package with <code>pip</code>,</p>
            <Code language='shell' text={String.raw`pip install apache-airflow`} />

            <p>Then initialise Airflow, </p>

            <Code language='shell' text={String.raw`airflow initdb`} />

            <p>This will by default create configuration and database files in the directory <code>~/airflow</code>. If you want the files created elsewhere specify this with the environment variable, <code>AIRFLOW_HOME</code> before initilialising Airflow, e.g. <code>export AIRFLOW_HOME=&lt;filepath&gt;</code>.</p>

            <p>Next to start up the web server use the following command.</p>

            <Code language='shell' text={String.raw`airflow webserver -p 8080`} />

            <p>By default this will run on port 8080 but I've made it explicit in the above command. As well as the webserver you will also need to start the scheduler.</p>
            
            <Code language='shell' text={String.raw`airflow scheduler`} />

            <p>Airflow is now installed and running.</p>
            
          </div>

          <div id="example-task">
            <h2>Example Task</h2>

            <Code language='shell' text={String.raw`# run your first task instance
airflow run example_bash_operator runme_0 2015-01-01`} />

            <p>Where <code>airflow</code> is the core command of Airflow, <code>run</code> is the command for running a single task instance, <code>example_bash_operator</code> is the name of the DAG the task belongs to, <code>runme_0</code> is the task id, and <code>2015-01-01</code> is the <b>execution date</b>.</p>

            <p>Note the <code>example_bash_operator</code> DAG is an example DAG provided by Airflow, you can find the source code for it in your <code>conda</code> environment, e.g. at <code>anaconda3/envs/&lt;environment name&gt;/lib/python3.7/site-packages/airflow/example_dags/example_bash_operator.py</code></p>

            <p>If you've run the previous command you will be able to look at details of how the task ran in the Airflow web UI. You can find task instances at, <a href="http://localhost:8080/admin/taskinstance/">http://localhost:8080/admin/taskinstance/</a>.</p>

            <p>Note, if you run the same command again you will not create a new task instance, you will instead create a new Job instance. You can see the jobs that have been run here, <a href="http://localhost:8080/admin/basejob/">http://localhost:8080/admin/basejob/</a>. However if you run the task with a different date, e.g.</p>

            <Code language='shell' text={String.raw`# run your first task instance
airflow run example_bash_operator runme_0 2015-01-02`} />

            <p>Then this will create a new task instance. This is because a task instance is uniquely defined by the task id and the arguments passed to it.</p>
            
          </div>

          <div id="example-dag-run">
            <h2>Example DAG run</h2>

            <Code language='shell' text={String.raw`# run a backfill over 2 days
airflow backfill example_bash_operator -s 2015-01-01 -e 2015-01-02`} />

            <p>where <code>backfill</code> is a command to run subsections of a DAG for a specified date range, <code>-s</code> and <code>-e</code> are the start and end date arguments.</p>

            <p>In this case we're running a whole entire DAG and not just one of its tasks. You can see the progress of the backfilling here, <a href="http://localhost:8080/admin/airflow/tree?dag_id=example_bash_operator">http://localhost:8080/admin/airflow/tree?dag_id=example_bash_operator</a>.</p>

            <img className="article-image" src={`${process.env.PUBLIC_URL}/articles/data_engineering/scheduling_tasks_with_airflow/fig1.png`} />

            <p>On the left you can see the DAG structure laid out in a tree structure and on the right you can the status of each task within the DAG for the specified date range. If we backfill for even more dates we get,</p>

            <Code language='shell' text={String.raw`airflow backfill example_bash_operator -s 2015-01-3 -e 2015-01-13`} />

            <img className="article-image" src={`${process.env.PUBLIC_URL}/articles/data_engineering/scheduling_tasks_with_airflow/fig2.png`} />

            <p>You can see on the right more dates being executed. You can also see how the DAG view looks during backfilling opposed to after it has completed as is shown in the previous image.</p>
            
          </div>

          <div id="connecting-to-postgres">
            <h2>Connecting to Postgres</h2>
            <p>In the installation section we initialised Airflow with the command <code>airflow init</code>. This created a SQLite database in the <code>~/airflow</code> directory (or <code>$AIRFLOW_HOME</code> if you set it), you should see a file called <code>airflow.db</code>. However if you intend on putting your airflow job orchestrator into production you will probably want to upgrade to a different database technology since parallelisation is not possible with SQLite.</p>

            <p>In this section we'll look at installing postgres and connecting Airflow to it. I'm using Mac OS X for this example, but if you're using a different operating system it shouldn't be too different.</p>

            <p>To install Postgres I recommend using the <a href="https://brew.sh">Homebrew</a> package manager for Mac OS X. To install postgres with Homebrew use the following command,</p>

            <Code language='shell' text={String.raw`brew install postgresql`} />

            <p>and to start the postgres server use the command,</p>

            <Code language='shell' text={String.raw`brew services start postgresql;`} />

            <p>Once the postgres server has started you can open up the postgres shell with,</p>

            <Code language='shell' text={String.raw`psql postgres`} />

            <p>which logs into the <b>postgres</b> database using the current termianl user. Next create a user for airflow,</p>

            <Code language='shell' text={String.raw`create user airflow with password '&lt;your password&gt;';`} />

            <p>and create a database for airflow,</p>

            <Code language='shell' text={String.raw`create database airflow;`} />
            
            <p>To configure Airflow to work with your postgres database you'll need to update the <code>airflow.cfg</code> file. First you'll have to provide it with a connection string for connecting to the postgres database and second you should update the "executor" setting to use "LocalExecutor" so that you can parallelise tasks.</p>

            <Code language='shell' text={`# airflow.cfg
...


# The executor class that airflow should use. Choices include
# SequentialExecutor, LocalExecutor, CeleryExecutor, DaskExecutor, KubernetesExecutor
# executor = SequentialExecutor replace with
executor = LocalExecutor
  
# The SqlAlchemy connection string to the metadata database.
# SqlAlchemy supports many different database engine, more information
# their website
# sql_alchemy_conn = sqlite:///&lt;airflow home directory&gt;/airflow.db # replace with
# a postgres connection string takes the form, postgresql://&lt;user&gt;:&lt;password&gt;@&lt;host&gt;:&lt;port&gt;/&lt;database name&gt;
sql_alchemy_conn = postgresql+psycopg2://airflow:&lt;your password&gt;@localhost:5432/airflow  
...`} />

            <p>Lastly we'll need to install the <code>psycopg2</code> python package for interacting with Postgres through Python, we'll use <code>pip</code> to do this,</p>

            <Code language='shell' text={String.raw`pip install psycopg2`} />

            <p>Now shut down the webserver and scheduler services and rerun the <code>airflow initdb</code> command. Restart the webserver and scheduler services. I received a few errors when initialising the database but these were fixed when I reran the <code>initdb</code> command. Also you might find you get <code>ConnectionRefusedError</code> when running a task or DAG, in these cases retyring the task/DAG usually works.</p>
          </div>

          <div id="conclusion">
            <h2>Conclusion</h2>
            <p>In this article we've had a brief look at getting started with Airflow, we've installed, configured and ran a few examples provided by Airflow. The next step is to write our own DAGs and look at how to put our Airflow task scheduler into a robust production environment.</p>
          </div>

          <div id="reference">
            <h2>Reference</h2>

            <ul>
              <li><code>psql -U &lt;username&gt;</code>: log into the interactive shell</li>
              <li><code>\l</code>: list databases</li>
              <li><code>\c &lt;database name&gt;</code>: connect to database</li>
              <li><code>\dt</code>: list tables in the database</li>
              <li><code>\q</code>: quit the interactive terminal</li>
              <li>postgres connection string format: <code>postgresql://&lt;user&gt;:&lt;password&gt;@&lt;host&gt;:&lt;port&gt;/&lt;database name&gt;</code></li>
              <li>default postgres port: 5432</li>
            </ul>
            
          </div>

          <div id="further-reading">
            <h2>Further reading</h2>
            <ul>
              <li><a href="https://airflow.apache.org">https://airflow.apache.org</a></li>
              <li><a href="https://gist.github.com/rosiehoyem/9e111067fe4373eb701daf9e7abcc423">https://gist.github.com/rosiehoyem/9e111067fe4373eb701daf9e7abcc423</a></li>
            </ul>
          </div>
        </div>
    );
}

export default SchedulingTasksWithAirflow;

