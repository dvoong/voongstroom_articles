import { Code, Equation, InlineEquation } from "../../Utilities";


function HowToBuildASparkClusterOnAws() {
    return (
        <div>
<h1 className="title">How to build a Spark cluster on AWS</h1>

<div>
  Published on <i>3rd September 2019</i>
</div>
<hr />

<div id="introduction">
  <h2>Introduction</h2>
  <p>In an earlier <a href="/articles/data-engineering/getting-started-with-pyspark">article</a> I showed how to get started with PySpark on your local machine, however in real world applications you'll want to make use of Spark's ability to parallel process data in a cluster of machines. In this article I'll go through how to set up Spark and PySpark on the AWS infrastructure.</p>
  
</div>

<div id="setup">
  <h2>Setup</h2>
  <p>First you'll need to setup an AWS account, goto <a href="https://aws.amazon.com">aws.amazon.com</a> and create an account or sign into an existing one. Next we need to create an access key, To do this go to,</p>

        <div style={{fontFamily: 'monospace', background: '#ededed', padding: '1em 1em 1em 1em', marginBottom: '1em'}}>
My Account &gt;&gt; My Security Credentials &gt;&gt; Access keys (access key ID and secret access key) &gt;&gt; Create New Access Key &gt;&gt; Download Key File
  </div>

  <p>Download the key file and keep it somewhere safe. <b>Note</b>: This will create an access key ID for the AWS <b>root</b> account which is against AWS best practises. In real world applications you  should create IAM users and then create access key IDs for those users. However since this is just a tutorial I'll skip that step.</p>
  <p>Next we'll need to get an EC2 Key Pair which will allow us to <code>ssh</code> into EC2 instances, instructions for doing this can be found <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair">here</a>.</p>
  <p>At this point we should have two keys,</p>

  <ul>
    <li><b>AWS Access Key</b>: Used to authenticate a user on AWS for making AWS CLI commands or using AWS API operations</li>
    <li><b>EC2 Key Pair</b>: Used to access an EC2 instance</li>
  </ul>

</div>

<div id="data-storage-with-s3">
  <h2>Data storage with s3</h2>
  <p>To analyse our data with PySpark on AWS we'll need to store it on s3 where our Spark cluster can access it. In this example we'll use the same <a href={`${process.env.PUBLIC_URL}/articles/data_engineering/getting_started_with_pyspark/README.md`}>README.md</a> file we used in <a href="/articles/data-engineering/getting-started-with-pyspark">Getting started with PySpark</a>. To store it in s3 you can either use the s3 <a href="https://s3.console.aws.amazon.com/s3/">web UI</a> or using the <code>boto3</code> package in Python. The web UI is much easier to get started with but if you plan on doing any automation you'll eventually need to learn to manage data programatically. Below is an example of how to upload files to s3 with <code>boto3</code>.</p>

  <p>In your bash shell, install <code>boto3</code> and setup your access key id credentials which we generated in the previous section.</p>
<Code text={`pip install boto3
export AWS_ACCESS_KEY_ID="<your access key id>"
export AWS_SECRET_ACCESS_KEY="<your secret access key>"`} />

  <p>You can then upload a file to an s3 bucket using this python script,</p>
<Code text={`import boto3, os

AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
bucket_name = 'voongstroom.how-to-build-a-spark-cluster-on-aws'
destination_filename = 'README.md'
location_constraint = 'eu-west-2'
source_filepath = 'README.md'

client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

print('client:', client)

try:
    bucket = client.create_bucket(
        Bucket=bucket_name,
        CreateBucketConfiguration={'LocationConstraint':location_constraint}
    )
    print('bucket:', bucket)
except client.exceptions.BucketAlreadyOwnedByYou as e:
    print('bucket already created')

client.upload_file(source_filepath, bucket_name, destination_filename)`} />
  
</div>

<div id="creating-a-spark-cluster-with-emr">
  <h2>Creating a Spark cluster with EMR</h2>
  <p>In this example we'll create a cluster using the AWS Elastic Map Reduce (EMR) service. This service helps to create a cluster of machines, manage the configuration of master and slave nodes and link all these machines together. It also comes with prebuilt images with Spark and other applications already installed. To build a cluster navigate to the <a href="https://eu-west-2.console.aws.amazon.com/elasticmapreduce/home?region=eu-west-2#">EMR</a> in the AWS console and click <b>Create cluster</b>. In the <b>Software configuration</b> section change the application to a Spark application.</p>

  <img style={{maxWidth: '100%'}} className="article-image" src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_spark_cluster_on_aws/fig1.png`} />

  <p>Set the <b>EC2 key pair</b> to the key pair you generated in the <a href="#setup">setup</a> section. This will allow you to access the machine via <code>ssh</code>.</p>

  <img style={{maxWidth: '100%'}} className="article-image" src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_spark_cluster_on_aws/fig2.png`} />

  <p>then click <b>Create cluster</b>. It will then take a few minutes to setup the cluster. When it is ready it will have the status waiting.</p>

  <img style={{maxWidth: '100%'}} className="article-image" src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_spark_cluster_on_aws/fig3.png`} />

</div>

<div id="how-to-ssh-into-the-emr-cluster">

  <h2>How to <code>ssh</code> into the EMR cluster</h2>
  <p>Next we'll <code>ssh</code> into the master node, from here we can execute the pyspark shell and also connect to the spark web interface, however, even though we have an EC2 key pair for authentication EMR requires additional security to authorise the IP address we'll <code>ssh</code> from. To do this  we'll have to configure the <b>security groups</b>.</p>

  <img style={{maxWidth: '100%'}} className="article-image" src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_spark_cluster_on_aws/fig4.png`} />

  <p>Edit the <b>inbound rules</b> for the security group to allow <code>ssh</code> access from all public IP addresses, <code>0.0.0.0/0</code> as shown below. <b>Note</b>: AWS does not recommend making your clusters accessible from all IP addresses but you can also add you own specific IP address for greater security.</p>

  <img style={{maxWidth: '100%'}} className="article-image" src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_spark_cluster_on_aws/fig5.png`} />

  <p>You'll also need to change the permissions on the EC2 key pair you downloaded to your local machine, again for greater security.</p>

<Code text={`chmod 400 <your EC2 pem file>`} />

  <p>Now you can <code>ssh</code> into the master node of your EMR cluster, you'll need the <b>Master public DNS</b> which is shown in the summary of your cluster.</p>

<Code text={`ssh -i <your EC2 pem file> hadoop@<Master public DNS>`} />

  <p>Where you'll be greeted with,</p>

<Code text={`Warning: Permanently added 'ec2-3-8-99-150.eu-west-2.compute.amazonaws.com,3.8.99.150' (ECDSA) to the list of known hosts.
Last login: Tue Sep  3 14:02:39 2019

       __|  __|_  )
       _|  (     /   Amazon Linux AMI
      ___|\___|___|

https://aws.amazon.com/amazon-linux-ami/2018.03-release-notes/
6 package(s) needed for security, out of 8 available
Run "sudo yum update" to apply all updates.
                                                                    
EEEEEEEEEEEEEEEEEEEE MMMMMMMM           MMMMMMMM RRRRRRRRRRRRRRR    
E::::::::::::::::::E M:::::::M         M:::::::M R::::::::::::::R   
EE:::::EEEEEEEEE:::E M::::::::M       M::::::::M R:::::RRRRRR:::::R 
  E::::E       EEEEE M:::::::::M     M:::::::::M RR::::R      R::::R
  E::::E             M::::::M:::M   M:::M::::::M   R:::R      R::::R
  E:::::EEEEEEEEEE   M:::::M M:::M M:::M M:::::M   R:::RRRRRR:::::R 
  E::::::::::::::E   M:::::M  M:::M:::M  M:::::M   R:::::::::::RR   
  E:::::EEEEEEEEEE   M:::::M   M:::::M   M:::::M   R:::RRRRRR::::R  
  E::::E             M:::::M    M:::M    M:::::M   R:::R      R::::R
  E::::E       EEEEE M:::::M     MMM     M:::::M   R:::R      R::::R
EE:::::EEEEEEEE::::E M:::::M             M:::::M   R:::R      R::::R
E::::::::::::::::::E M:::::M             M:::::M RR::::R      R::::R
EEEEEEEEEEEEEEEEEEEE MMMMMMM             MMMMMMM RRRRRRR      RRRRRR
                                                                    
[hadoop@ip-172-31-4-240 ~]$ 
      `} />

  <p>From here we can start our pyspark shell as we did before with the <code>pyspark</code> command. We can also load our input file and perform Spark actions and transformations, but instead of using a local file we use a file stored on s3. To get the s3 filepath we can navigate to the file in the s3 web interface and use the <b>Copy path</b> option, the path will look something like this.</p>

<Code text={`s3://voongstroom.how-to-build-a-spark-cluster-on-aws/README.md`} />

  <p>As in the previous article you can perform all the same actions and transformations.</p>
  
<Code text={`[hadoop@ip-172-31-4-240 ~]$ pyspark
Python 2.7.16 (default, Jul 19 2019, 22:59:28) 
[GCC 4.8.5 20150623 (Red Hat 4.8.5-28)] on linux2
Type "help", "copyright", "credits" or "license" for more information.
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
19/09/03 14:13:21 WARN Client: Neither spark.yarn.jars nor spark.yarn.archive is set, falling back to uploading libraries under SPARK_HOME.
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ \`/ __/  '_/
   /__ / .__/\_,_/_/ /_/\_\   version 2.4.3
      /_/

Using Python version 2.7.16 (default, Jul 19 2019 22:59:28)
SparkSession available as 'spark'.
>>> filepath = 's3://voongstroom.how-to-build-a-spark-cluster-on-aws/README.md'
>>> textFile = spark.read.text(filepath)
>>> textFile.head(3)
[Row(value=u'# Apache Spark'), Row(value=u''), Row(value=u'Spark is a unified analytics engine for large-scale data processing. It provides')]
>>> textFile.count()
109
>>> linesWithSpark = textFile.filter(textFile.value.contains("Spark"))
>>> linesWithSpark.count()
20
>>>`} />
  
</div>

<div id="conclusion">
  <h2>Conclusion</h2>
  <p>Though the line count example I've shown here is very simple and can be easily done on a local machine we've actually done quite a bit in the background. Instead of a locally stored file we now have a file stored on a distributed file system with high available, fault tolerance and all the other benefits of distributed file systems. We also have a cluster of Spark machines do perform analysis in parallel across several machines which we can quickly scale. Together this now allow us to process data in parallel across multiple machines as well as explore very large datasets interactively via the PySpark shell.</p>

  <p>In this article I've created shown how to create a simple Spark cluster for the purpose of interactive pyspark queries. In other use cases you may want to create a PySpark application which perform some ETL tasks on your data, store it and then shutdown cluster, or create a Spark streaming application. We'll have a look at some of these in the future.</p>

  <p>Finally, make sure to terminate your cluster once you're done with it, else charges will steadily stack up.</p>

</div>

<div id="further-reading">
  <h2>Further reading</h2>
  <ul>
    <li><a href="https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html">AWS: Understanding and Getting Your Security Credentials</a></li>
    <li><a href="https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-spark.html">https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-spark.html</a></li>
    <li><a href="https://aws.amazon.com/blogs/aws/new-apache-spark-on-amazon-emr/">https://aws.amazon.com/blogs/aws/new-apache-spark-on-amazon-emr/</a></li>
    <li><a href="https://towardsdatascience.com/getting-started-with-pyspark-on-amazon-emr-c85154b6b921">https://towardsdatascience.com/getting-started-with-pyspark-on-amazon-emr-c85154b6b921</a></li>
  </ul>
</div>
        </div>
    );
}

export default HowToBuildASparkClusterOnAws;

