import { Code, Equation, InlineEquation } from "../../Utilities";


function GettingStartedWithPyspark() {
    return (
        <div>

<h1 className="title">Getting started with PySpark</h1>

<div>
  Published on <i>17th August 2019</i>
</div>
<hr />

<div id="introduction">
  <h2>Introduction</h2>

  <p><a href="https://spark.apache.org/">Apache Spark</a> is a unified analytics engine specialised in analysing data distributed on a network of machines, i.e. a cluster. Such as in the case where the amount of data is too large to be stored in only one machine or the data is replicated across multiple machines for the the purpose of fault tolerance or high availability. Spark is especially useful for data analytics processes which are parallelisable, so that each machine/node in the cluster can calculate the data on that node independently, the result of which is then combined with the results from the rest of the nodes in the cluster.</p>

  <p>Spark extends the popular MapReduce model to efficiently support more types of computations such as processing interactive queries and realtime streaming data. In addition to this, Spark is fast when compared against Hadoop MapReduce. The speed improvement can be up to 100x and this is put down to,</p>

  <ul>
    <li>the ability to run computations in memory, meaning expensive disk read and write operations are avoided (especially relevant in iterative processes commonly found in machine learning algorithms)</li>
    <li>state-of-the-art</li>
    <ul style={{marginTop: '0.50em'}}>
      <li>DAG scheduler</li>
      <li>query optimizer</li>
      <li>physical execution engine</li>
    </ul>
  </ul>

  <p>Spark also is available in several programming languages, including Scala, Java, Python, R and SQL. In this tutorial we will be using Python which requires the PySpark package.</p>
</div>

<div id="installation">
  <h2>Installation</h2>

  <p>Let's first create a <code>conda</code> environment.</p>

<Code text={String.raw`conda create -n getting_started_with_pyspark python=3`} />

  <p>Activate the environment.</p>

<Code text={String.raw`source activate getting_started_with_pyspark`} />

  <p>And install the python package with <code>pip</code>.</p>
  
<Code text={String.raw`pip install pyspark`} />

  <p>I used version 2.4.3 for this article. Now let's start a <code>PySpark</code> interactive shell with the following command.</p>

<Code text={String.raw`pyspark`} />
  
  <p>You may receive the error <b>No Java runtime present, requesting install when running this command.</b> Which means you need to install the Java Development Kit (JDK). If like me you're working on Mac OS X you need to be a little careful here. Installing the correct Java dependencies for PySpark can be a bit finicky, my recipe is to,</p>

  <ul>
    <li>Install Java using <a href="https://brew.sh">Homebrew</a></li>
    <li>Install Java version 8</li>
  </ul>

  <p>Since Java 8 is an old version of Java, installing it with Homebrew also requires a little bit of extra work to search the correct repositories,</p>

<Code text={String.raw`brew tap caskroom/versions # adds the "versions" repo to the search path`} />

  <p>Then install Java 8 using the command,</p>

<Code text={String.raw`brew cask install java8`} />
  
  <p>After Java 8 is installed starting the interactive shell you should give you something like this,</p>

  <Code text={String.raw`...	
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ \`/ __/  '_/
   /__ / .__/\_,_/_/ /_/\_\   version 2.4.3
      /_/

Using Python version 3.7.4 (default, Aug 13 2019 15:17:50)
SparkSession available as 'spark'.
>>>`} />

</div>

<div id="text-example">
  <h2>Text example</h2>
  <p>We'll start off by analysing the text in the Spark <a href="{% static 'articles/data_engineering/getting_started_with_pyspark/README.md' %}">README.md</a> file which I took from the public <a href="https://github.com/apache/spark#apache-spark">github repository</a> for Spark.</p>
  
<Code text={String.raw`>>> textFile = spark.read.text("README.md")

# read first three lines of the file
>>> textFile.head(3)
[Row(value='# Apache Spark'), Row(value=''), Row(value='Spark is a unified analytics engine for large-scale data processing. It provides')]

# line count
>>> textFile.count()
109

# filtering
>>> linesWithSpark = textFile.filter(textFile.value.contains("Spark"))
>>> linesWithSpark.count()
20

# words per line
from pyspark.sql.functions import size, split, mean, col
>>> df = textFile.select(size(split(textFile.value, "\s+")).name("numWords"))
>>> df.agg(mean(col("numWords"))).collect()
[Row(avg(numWords)=5.192660550458716)]`} />
  
</div>

<div id="spark-sql">
  <h2>Spark SQL</h2>
  <p>The above example demonstrates analysing data using <code>Spark SQL</code> which is a Spark package designed to work with analysing <b>structured data</b>. Structured data is data that can be represented in the form of a table made up of rows and columns, like a relational database. There are two ways to interact with Spark SQL, firstly though the <code>DataFrame</code> API as we did in the previous example or with SQL expressions which I will show later.</p>  
</div>

<div id="dataframes">
  <h2><code>DataFrames</code></h2>
  <p>In the example above we instantiate a <code>DataFrame</code> object from a textfile on our local machine with,</p>

<Code text={String.raw`textfile = spark.read.text('README.md')`} />

  <p>There are two types of operations which can be applied to a  <code>DataFrame</code>, an <b>action</b> and a <b>transformation</b>. An action calculates and returns something with values, a number, string, a sample or the whole data frame. For example we called the actions <code>count</code> and <code>head</code> in the previous example, to return a value and a sample of the <code>DataFrame</code>. The second type of operation is a transformation, which in general will return another <code>DataFrame</code>, for example we used the <code>filter</code> transformation to create a <code>DataFrame</code> of lines which have "Spark" mentioned in them.</p>

  <p>Note: the returned <code>DataFrame</code> object is not a "physical" <code>DataFrame</code> in that we do not see the data stored in the <code>DataFrame</code>, you can think of this <code>DataFrame</code> more as a set of instructions on how to produce it. To get the physical <code>DataFrame</code> you need to operate with the action <code>collect</code>, but beware that your local machine will need to be able to store the entire <code>DataFrame</code>. </p>

</div>

<div id="analysing-dataframes-with-sql-expressions">
  <h2>Analysing <code>DataFrames</code> with SQL expressions</h2>

  <p>As an alternative to using the <code>DataFrame</code> API you can analyse your data using SQL experssions. For example to filter lines which contain the word "Spark" you could do,</p>
<Code text={String.raw`>>> textfile.createOrReplaceTempView("lines")
>>> df = spark.sql("""
  select value from lines where value like "%Spark%"
""")
>>> df.count()
20`} />

  <p>The first statement, <code>textfile.createOrReplaceTempView("lines")</code>, creates a view which is used later by the function <code>spark.sql</code> to access the data. To calculate the average words per line as we did in the previous example we would use the following SQL expression.</p>
<Code text={String.raw`>>> textFile.createOrReplaceTempView('lines')  	
>>> df = spark.sql(''' select mean(size(split(value, "\\\s+"))) as mean_words from lines ''')
>>> df.show()
+-----------------+
|       mean_words|
+-----------------+
|5.192660550458716|
+-----------------+`} />

  <p>Note in this case we had to escape the <code>\s+</code> regular expression with two backslashes, <code>\\\s+</code>.</p>
</div>

<div id="conclusion">
  <h2>Conclusion</h2>
  <p>In this article I've outlined how to install and run <code>PySpark</code>. I've given a brief example of how to analyse, filter and aggregate data using <code>PySpark</code> and <code>Spark SQL</code>. So far we've only run on one local machine and not on a cluster and we have yet to play with Resilient Distributed Datasets (RDDs) which are the fundamental dataset object in Spark. We will cover these another time.</p>
</div>

<div id="reference">
  <h2>Reference</h2>
  <ul>
    <li>convert to <code>pandas DataFrame</code>: <code>df.toPandas()</code></li>
    <li>create a temporary view for use with Spark SQL: <code>df.createOrReplaceTempView("lines")</code></li>
    <li>read csv file: <code>df = spark.read.format("csv").load(&ltfilepath&gt)</code></li>
    <li>read text file: <code>df = spark.read.text(&ltfilepath&gt)</code></li>
    <li>write file: <code>df.write.save(&ltfilepath&gt)</code></li>
  </ul>

</div>

<div id="further-reading">
  <h2>Further reading</h2>
  <ul>
    <li><a href="https://spark.apache.org/docs/latest/quick-start.html">Quick start guide</a></li>
    <li><a href="https://data-flair.training/blogs/apache-spark-rdd-vs-dataframe-vs-dataset/">RDD vs DataFrame vs Dataset</a></li>
  </ul>
</div>
        </div>
    );
}

export default GettingStartedWithPyspark;

