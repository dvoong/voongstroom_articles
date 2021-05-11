import { Code, Equation, InlineEquation } from "../../Utilities";


function HowToBuildASimpleDataEngineeringPlatformWithAws() {
    return (
        <div>
          <h1 className="title">How to build a simple data pipeline with AWS</h1>

          <div>
            Published on <i>1st August 2019</i>
          </div>
          <hr />

          <div id="introduction">
            <h2>Introduction</h2>
            <p>Having a stable and reliable pipeline is a core criterion for an effective data science function. In this article I'll cover some of the key concepts and components or a data pipeline and how to build in using the AWS environment.</p>
            <p>In this article we will start from upstream (our initial data source) and work our way downstream through the data pipeline (to the final storage of processed data in a data warehouse). In this example we are building a data pipeline for a mobile gaming company that wants to store and process user's interaction data with a game.</p>

            <img src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_simple_data_pipeline_with_aws/fig1.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px'}} />
          </div>

          <div id="creating-an-aws-kinesis-stream">
            <h2>Creating an AWS Kinesis Stream</h2>
            <p>To begin we will stream data from our game's backend server to an <a href="https://aws.amazon.com/kinesis/?nc2=h_m1">AWS Kinesis</a> data stream. A Kinesis data stream consists of a resource that manages what to do with the data that is streaming in, there are four types of resources.</p>

            <h3>Resource Types</h3>
            <ul>
              <li><b>Data stream</b>: low level interface, custom applications</li>
              <li><b>Delivery stream</b>: stream data into storage locations such as the s3 filestore or Redshift data warehouse</li>
              <li><b>Analytics application</b>: run sql on stream data to generate realtime data insights</li>
              <li><b>Video stream</b>: build applications to process or analyse streaming media</li>
            </ul>

            <p>In this case we will look at using a <b>Data stream</b> to first store our raw data into s3. <a href="https://aws.amazon.com/s3/">s3</a> is Amazon's cloud data storage platform, one of the core components of AWS services. Our architecture will now look something like this.</p>

            <img src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_simple_data_pipeline_with_aws/fig2.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px'}} />

            <p>Now let's put this into practise. First you will need to create an AWS account, you can do so <a href="https://aws.amazon.com/">here</a>. Next you want to sign into the console and navigate to the <a href="https://eu-west-2.console.aws.amazon.com/kinesis/home?region=eu-west-2#/dashboard">Amazon Kinesis dashboard</a>. I have my region set to EU-West but you might want to change it to somewhere more local, for the purpose of this tutorial it is not too important.</p>

            <p>Now create a Kinesis stream giving it a name and configuring the number of shards you require, for this example I will use only one shard.</p>

            <img src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_simple_data_pipeline_with_aws/fig3.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px', paddingBottom: '1em'}} />

            <p>And you now have a Kinesis data stream. The details for your stream should look something like this,</p>

            <img src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_simple_data_pipeline_with_aws/fig4.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px', paddingBottom: '1em'}} />

            <p>You have a stream ARN (Amazon Resource Name) which is the address to which your data source should send data and below that are some instructions on how to send/receive data to/from the data stream.</p>

            <p>Let's first try and send data to our stream. For this we'll use the <a href="https://boto3.amazonaws.com/v1/documentation/api/latest/index.html?id=docs_gateway"><code>boto3</code></a> Python package. Install the package using <code>pip</code></p>

            <Code text={String.raw`pip install boto3`} />

            <p>Then follow the instructions on their <a href="https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html#configuration">quickstart</a> guide for configuring the credentials.</p>

            <p>Once you're configured we can move onto using <code>boto3</code> with Kinesis. Documentation for connecting to Kinesis with <code>boto3</code> can be found <a href="https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/kinesis.html">here</a>. Let's check everything is working by getting some information about the data streams we've created in Kinesis.</p>

            <Code text={String.raw`import boto3
from pprint import pprint

client = boto3.client('kinesis')
pprint(client.list_streams())

>>> {'HasMoreStreams': False,
 'ResponseMetadata': {'HTTPHeaders': {'content-length': '58',
                                      'content-type': 'application/x-amz-json-1.1',
                                      'date': 'Wed, 31 Jul 2019 12:46:14 GMT',
                                      'x-amz-id-2': 'mYMjZHF3rRLobHoy10/OsAYS4zWSZywRwpRqBEnN486tOMto4xHVaZPtuLax87ASiHuC2NA7amB7oMT6zr3EwcWGYa+zJ3Tx',
                                      'x-amzn-requestid': 'dbec7469-0c2e-33f1-8e57-fbbf481e6fa6'},
                      'HTTPStatusCode': 200,
                      'RequestId': 'dbec7469-0c2e-33f1-8e57-fbbf481e6fa6',
                      'RetryAttempts': 0},
 'StreamNames': ['how_to_pipeline']}`} />

            <p>And some specific information about the <code>how_to_pipeline</code> data stream we created,</p>
            
            <Code text={String.raw`response = client.describe_stream(StreamName='how_to_pipeline')
pprint(response)

>>> {'ResponseMetadata': {'HTTPHeaders': {'content-length': '565',
                                      'content-type': 'application/x-amz-json-1.1',
                                      'date': 'Wed, 31 Jul 2019 12:45:28 GMT',
                                      'x-amz-id-2': 'fsWP2Eu5UDuTcNzBBE0/vpmgkaTbF3bmm0EwUXeHCgFoLBklBQ2u4WxLJI7XMhr/qGUnvE/FC4s2h+i9/cX+k61DZDWu//Ti',
                                      'x-amzn-requestid': 'f4ba0a5e-21d0-f426-a101-85f6890b6cf3'},
                      'HTTPStatusCode': 200,
                      'RequestId': 'f4ba0a5e-21d0-f426-a101-85f6890b6cf3',
                      'RetryAttempts': 0},
 'StreamDescription': {'EncryptionType': 'NONE',
                       'EnhancedMonitoring': [{'ShardLevelMetrics': []}],
                       'HasMoreShards': False,
                       'RetentionPeriodHours': 24,
                       'Shards': [{'HashKeyRange': {'EndingHashKey': '340282366920938463463374607431768211455',
                                                    'StartingHashKey': '0'},
                                   'SequenceNumberRange': {'StartingSequenceNumber': '49598094200429875243492130378304799971751435486598529026'},
                                   'ShardId': 'shardId-000000000000'}],
                       'StreamARN': 'arn:aws:kinesis:eu-west-2:668852944753:stream/how_to_pipeline',
                       'StreamCreationTimestamp': datetime.datetime(2019, 7, 30, 19, 56, 44, tzinfo=tzlocal()),
                       'StreamName': 'how_to_pipeline',
'StreamStatus': 'ACTIVE'}}`} />

            <p>Let's try putting some data into our data stream,</p>
            
            <Code text={String.raw`import json

record = {
    'ts': '2019-07-31 13:22:59',
    'action_type': 'purchase',
    'userid': 0
}

record = json.dumps(record)
pprint(record)

>>> '{"ts": "2019-07-31 13:22:59", "action_type": "purchase", "userid": 0}'`} /> <Code text={String.raw`response = client.put_record(
    StreamName='how_to_pipeline',
    Data=record,
    PartitionKey='0'
)

pprint(response)

>>> {'ResponseMetadata': {'HTTPHeaders': {'content-length': '110',
                                      'content-type': 'application/x-amz-json-1.1',
                                      'date': 'Wed, 31 Jul 2019 12:56:57 GMT',
                                      'x-amz-id-2': 'btSphGTGw/venm1tq5TFFWnP1T/hJTCWBfjMKfMZESHP8AP1eCTW9LnVEB1Ip0zi6q6PuBi4bozQOZBv9v8QG1AeIkAfrfxd',
                                      'x-amzn-requestid': 'e8fb6bd6-c12d-e626-bd40-f98fda2420d4'},
                      'HTTPStatusCode': 200,
                      'RequestId': 'e8fb6bd6-c12d-e626-bd40-f98fda2420d4',
                      'RetryAttempts': 0},
 'SequenceNumber': '49598101988206910493562992627272383723007875539380731906',
 'ShardId': 'shardId-000000000000'}`} />

            <p>We've now successfully input data into our Kinesis data stream! In a typical infrastructure you would not be inserting data manually into your Kinesis data stream, instead it would be coming from your backend server but the principle would be the same. There is room for optimising this data transfer from your backend, see <a href="https://docs.aws.amazon.com/streams/latest/dev/building-producers.html">here</a> for more detail.</p>

            <p>In the language of AWS Kinesis, we've created a <b>Producer</b> which is an application that feeds data into your Kinesis data stream, next we need to create a <b>Consumer</b> which as the name suggests, extracts data from your data stream.</p>
          </div>

          <div id="reading-from-an-aws-kinesis-stream">
            <h2>Reading from an AWS Kinesis stream</h2>
            <p>Let's try consuming the data we just put into our data stream. Again we will use <code>boto3</code> to access our data stream and retrieve our data. First we need to create a <code>shard_iterator</code>, we'll then read our records by iterating through the shard. In this example we iterate through the shard using a <code>AT_SEQUENCE_NUMBER</code> type iterator (see <a href="https://docs.aws.amazon.com/kinesis/latest/APIReference/API_GetShardIterator.html">here</a> for other types of iterators), for this we need to specify the <code>StartingSequenceNumber</code> which I took from the example above. When we insert data into the stream the response returns the <code>sequence_number</code> of the data we just input.</p>

            <Code text={String.raw`stream_name = 'how_to_pipeline'
shard_id = 'shardId-000000000000'
shard_iterator_type = 'AT_SEQUENCE_NUMBER'
sequence_number = '49598101988206910493562992627272383723007875539380731906'
response = client.get_shard_iterator(
    StreamName=stream_name, 
    ShardId=shard_id, 
    ShardIteratorType=shard_iterator_type,
    StartingSequenceNumber=sequence_number
)
shard_iterator = response['ShardIterator']
response = client.get_records(ShardIterator=shard_iterator, Limit=1)
records = response['Records']
pprint(records)
	
>>> [{'ApproximateArrivalTimestamp': datetime.datetime(2019, 7, 31, 14, 18, 13, 449000, tzinfo=tzlocal()),
  'Data': b'"{\\"ts\\": \\"2019-07-31 13:22:59\\", \\"action_type\\": \\"purcha'
          b'se\\", \\"userid\\": 0}"',
  'PartitionKey': '0',
  'SequenceNumber': '49598101988206910493562992627272383723007875539380731906'}]`} />
            
          </div>

          <div id="storing-data-with-kinesis-firehose">
            <h2>Storing data with Kinesis Firehose</h2>
            <p>In the previous example we saw that we could access data from our data stream using Python and the <code>boto3</code> package. From here we have freedom to store and process the data in almost anyway we see fit. However AWS has the functionality to store data from a data stream into s3 or Redshift using Kinesis Firehose, this simplifies the architecture and reduces the need for custom code.</p>

            <img src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_simple_data_pipeline_with_aws/fig5.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px', paddingBottom: '1em'}} />

            <p>To create a Kinesis Firehose <b>delivery stream</b> (note in the prior examples we created a <b>data stream</b> as a opposed to a <b>delivery</b> stream) go to your Kinesis dashboard and click "Create delivery stream".</p>

            <img src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_simple_data_pipeline_with_aws/fig6.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px', paddingBottom: '1em'}} />

            <p>and to link it to your data stream set the source to "Kinesis stream" and select your data stream from the dropdown menu.</p>

            <img src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_simple_data_pipeline_with_aws/fig7.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px', paddingBottom: '1em'}} />

            <p>Follow the prompts, you can use most of the defaults but set your output destination to s3 and create an s3 bucket to store your data. Once you've created your delivery stream you should see the data from the queue is stored in the s3 bucket you created (it may take a few minutes to store the data since by default the storage of the data occurs once every 300 seconds/5 minutes but this is configurable).</p>

          </div>

          <div id="storing-data-in-redshift">
            <h2>Storing data in Redshift</h2>
            <p>Now create a second delivery stream and set the destination to <b>Redshift</b> instead. You will need to create a cluster if you have not already. You may be eligible for a free trial with Redshift, if not you will be charged to use this service so read carefully.</p>

            <p>When setting up your Redshift cluster ensure you create a <b>role</b> to allow Redshift to copy data from s3, instructions no how to do this can be found <a href="https://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-create-an-iam-role.html">here</a>. Redshift copies data from Kinesis Firehose through an intermediate step involving storing and then reading data from s3 so if Redshift does not have access to s3 then your delivery stream will fail.</p>

            <p>By default, when copying data from s3, Redshift expects the data to be in the comma separated format. However in this example I've stored the data as a json object. This means we will have to edit the copy command so that it can read JSON. When setting up the delivery system there is an option called "COPY options", here we need to add,</p>

            <Code text={String.raw`format as json 'auto'`} />

            <img src={`${process.env.PUBLIC_URL}/articles/data_engineering/how_to_build_a_simple_data_pipeline_with_aws/fig8.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px', paddingBottom: '1em'}} />

            <p>Now you should have to delivery streams, one to s3 and one to Redshift! But before data can be copied to Redshift the table needs to be created, we can do this manually. Go to the Redshift console and navigate to the <b>Query Editor</b>. In the editor insert,</p>

            <Code text={String.raw`create table user_events (
  ts timestamp,
  action_type varchar(10),
  userid integer
);`} />

            <p>which should create the table in the <code>public</code> schema. Now let's check the <code>COPY</code> command works as intended. Copy and paste the <code>COPY</code> command from the Redshift delivery stream config (see image above) into the <b>Query Editor</b>, it should look something like this.</p>

            <Code text={String.raw`COPY user_events (ts, action_type, userid) FROM 's3://how-to-pipeline/&ltmanifest&gt'
CREDENTIALS 'aws_iam_role=arn:aws:iam::&ltaws-account-id&gt:role/&ltrole-name&gt'
MANIFEST format as json 'auto';	`} />

            <p>Goto the s3 console and navigate to the s3 object or manifest (which is a list of s3 objects) that you want to copy into the Redshift table. Copy its path and replace <code>'s3://how-to-pipeline/&ltmanifest&gt</code> with it. Navigate to your AWS account area and copy the account id (it should be a 12 digit number) and replace <code>&ltaws-account-id&gt</code> with it. Next navigate to the Redshift console and copy the name of the IAM role associated to it (make sure that role has access to s3) and replace <code>&ltrole-name&gt</code> with it, you should end up with something like this.</p>

            <Code text={String.raw`COPY user_events (ts, action_type, userid) FROM 's3://how-to-pipeline/manifests/2019/07/31/17/how_to_data_pipeline_firehose_redshift-2019-07-31-17-34-46-4bdc8071-0750-40b0-9c36-451e45b9767b' 
CREDENTIALS 'aws_iam_role=arn:aws:iam::012345678910:role/myRedshiftRole' 
MANIFEST format as json 'auto';	`} />

            <p>Now run that query, if all goes well you'll get a success message. Finally we can double check that the data has been copied. In the query editor insert (make sure you've selected the public schema),</p>

            <Code text={String.raw`select * from user_events limit 10;`} />

            <p>and run it. You should find you have successfully copied the data from the intermediary s3 objects. This is just a very brief look into setting up data streams to s3 and Redshift, AWS provides many other services to perform additional processing, ETL and real time analytics but they all build on the foundation laid out here.</p>
          </div>

          <div id="further-reading">
            <h2>Further Reading</h2>
            <ul>
              <li><b>AWS AIM</b>: <a href="https://aws.amazon.com/iam/">https://aws.amazon.com/iam/</a></li>
              <li><b>AIM Identifiers</b>: <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html">https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html</a></li>
              <li><b>Amazon Kinesis</b>: <a href="https://aws.amazon.com/kinesis/">https://aws.amazon.com/kinesis/</a></li>
              <li><b>Amazon Kinesis Firehose</b>: <a href="https://aws.amazon.com/kinesis/data-firehose/">https://aws.amazon.com/kinesis/data-firehose/</a></li>
              <li><b>s3</b>: <a href="https://aws.amazon.com/s3/">https://aws.amazon.com/s3/</a></li>
              <li><b>Redshift</b>: <a href="https://aws.amazon.com/redshift/">https://aws.amazon.com/redshift/</a></li>
              <li><b>Create a Kinesis Data Firehose Delivery Stream</b>: <a href="https://docs.aws.amazon.com/ses/latest/DeveloperGuide/event-publishing-redshift-firehose-stream.html">https://docs.aws.amazon.com/ses/latest/DeveloperGuide/event-publishing-redshift-firehose-stream.html</a></li>
              <li><b>COPY from JSON Format</b>: <a href="https://docs.aws.amazon.com/redshift/latest/dg/copy-usage_notes-copy-from-json.html">https://docs.aws.amazon.com/redshift/latest/dg/copy-usage_notes-copy-from-json.html</a></li>
              <li><b>Redshift Data Types</b>: <a href="https://docs.aws.amazon.com/redshift/latest/dg/c_Supported_data_types.html">https://docs.aws.amazon.com/redshift/latest/dg/c_Supported_data_types.html</a></li>
              <li><b>Creating an IAM role for Redshift</b>: <a href="https://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-create-an-iam-role.html">https://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-create-an-iam-role.html</a></li>
              <li><b>Redshift CREATE TABE</b>: <a href="https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_TABLE_NEW.html">https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_TABLE_NEW.html</a></li>
            </ul>
          </div>          
          
          
        </div>
    );
}

export default HowToBuildASimpleDataEngineeringPlatformWithAws;

