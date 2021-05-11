import { Link } from "react-router-dom";


let styles = {
    signature: {
        fontFamily: 'Caveat',
        fontSize: '1.5em',
        textAlign: 'right'
    }
};

let welcomeSection = (
    <div id="welcome">
      <h1>Welcome</h1>
      <img alt="cover"
           className="cover-image"
           src="bike_cropped.jpg" />
      <p>Data science and data engineering are some of the fastest growing and most exciting industries today. Many companies are trying to figure out how to leverage the large quantities of their data to gain a deeper insight into their businesses and gain an edge in today’s competitive markets.</p>
      <p>
        Developments in machine learning and neural networks are in some cases leading to the creation of completely new markets such as in Artificial Intelligence (AI), robotics and autonomous vehicles to name a few. With this rapid growth comes a constantly changing landscape of technologies and methodologies. On this site I aim to present some of these core ideas from fundamental theory to real world implementation on devices ranging from the humble laptop to cloud computing platforms.</p>

      <p>
        <span style={styles.signature}>David Voong</span></p>
    </div>
);

let whatIsDataScienceSection = (
    <div id="what-is-data-science">
      <h2>What is Data Science and Data Engineering? The Data Trinity</h2>
      <hr />

      <p>Data Science can be represented as the interaction between a trinity of the following disciplines,</p>
      <img className="centeredImage" src="data_science_trinity.png" />

      <h3>Business</h3>
      <p>The most important of which is <b>Business</b>, this encompasses what the objective of a piece of work and the value it creates. A good data scientist should be able to analyse a problem and propose solutions which create real value. This not to say that data scientists should be slaves to business plans and strict criteria but a data scientist should be able to demonstrate the progress of a project and communicate what the project expectations are. Getting the balance can be difficult for stakeholders and data scientists alike. This is because the business problems data scientists face are typically unstructured and exploratory in nature, how rigid the business objectives of a project is should be determined on a case by case basis.</p>

      <p>This requires good communication skills, something which the stereotypical data scientist is not known for! A data scientist should be able to clearly explain to stake holders and non technical persons the state of a project and its likely outcomes in a way that is relevant to the other party and in language that is appropriate. This requires that a data scientist not only be able to put themselves into the shoes of others but also to have significant knowledge in the business and its objectives and challenges.</p>      

      <h3>Statistics, Problem Solving and Modelling</h3>

      <p><b>Statistics</b> is the cornerstone of any analytical study involving data, a data scientist should have a deep understanding of these fundamentals which serve as the foundation for more "Advanced" analytical methods such as Machine Learning and Neural Networks. These are very powerful tools which are driving some of today's most exciting technology, however they are to be used in specific situations and are not appropriate for all business problems.</p>

      <p>Understanding when and where to use a specific technique requires a deep understanding of the strengths, weaknesses and assumptions of each analytical method. In addition to this problems that are more complex than trivial textbook problems require a degree of "intuition" which is developed through experience. Ironically it can more of an art than a science in many cases and it is not uncommon to see less experienced data scientists attempting to use machine learning and neural networks as panaceas for all problems.</p>

      <p><b>Problem solving</b> spans across all disciplines but is especially important when trying to understand a business problem. A good data scientist should be able to take a problem, quantify it and break it down into its main components. Real world problems are often very messy with many influencing factors and a data scientist should be able to identify the key issues through exploration and their business knowledge. In other words it is the ability of a data scientist to develop and constantly adapt a strategy to solving a business problem. This is one the key skills of a data scientist and  often one that can be overlooked.</p>

      <p>There in general two types of <b>Models</b> used in the context of data science, Regression models and Classification models. Regression models are used to make predictions for continuous variables while classification models are use to classify objects. Combining these two types of models with algorithms can give rise to incredibly rich applications. There are many types of models based on different algorithms or statistical principles, each with their strengths, weaknesses and use cases; I hope to cover many of these on this site.</p>

      <h3>Engineering</h3>
      <p>With the volume of data being generated today computer programming has become an absolute necessity for facilitating data scientists to put theory into practice. The engineering skills a data scientist is exhaustive, including knowledge of,</p>
      <ul>
        <li>databases technologies - SQL and noSQL</li>
        <li>data cleaning, filtering, enrichment and aggregation. Sometimes collectively known as data munging</li>
        <li>knowledge of data structures</li>
        <li>knowledge of common algorithms, e.g. sorting algorithms and big O notation</li>
        <li>knowledge of programming paradigms, e.g. object orientated and functional programming</li>
        <li>knowledge of shell environments</li>
        <li>frameworks, e.g. web application frameworks</li>
        <li>data analysis platforms, e.g. the Anaconda and Jupyter platform</li>
        <li>data visualisation tools</li>
        <li>model implementation, e.g. machine learning through libraries like scikit learn</li>
        <li>memory management</li>
        <li>pipelines</li>
        <li>code versioning</li>
        <li>testing</li>
        <li>and probably most difficult of all is doing this all in a way that is readable, maintainable, efficient and does what it suppose to do!</li>
      </ul>

      <p>A special mention should be made for specialised area of Data Engineering. There is a lot of overlap between Data Science and Data Engineering and it is not always obvious where one remit ends and another begins. The responsibilities of a data engineer are,</p>
      <ul>
        <li><b>Data Curation and Processing</b> - A data engineer import data from internal data sources and external data partners and store this in a format appropriate for data analytics.</li>
        <li><b>The Data Analytics Platform</b> - implement and maintain the core data analytics platform, ensuring required libraries are installed.</li>
        <li><b>Data Product Integration</b> - For a project than involves an output that is more than an analytics report, a few charts or a spreadsheet a more engineered product may be required. This can take the form of a forecasting tool, API or a web application. </li>
      </ul>

      <p>I've only really barely scratched the surface of the skills and knowledge that encompasses data engineering here. Real time analytics, spark streaming, SQL databases, noSQL databases, columnar data stores, data warehouses, cloud computing, machine clusters, containerised applications, the list goes on. In my defence I did intentionally leave the three main responsibilities vague enough so that any of these technologies and their use cases could be included within one of these three.</p>

      <h3>Summary</h3>
      <p>With today's world becoming more orientated around technology, the amount of data being generated each year is growing exponentially. As a result, demand for data analytics is growing rapidly. However the supply of skilled data analysts/scientists is struggling to meet this demand. Partly this is because as discussed above data scientists require a broad range of cross discipline skills and knowledge. They need the business acumen of a product/marketing role, the analytical skills of a research scientist and the programming proficiency of a software/data engineer. This is not an easy combination of skills to come across but as the industry grows and matures, libraries, standards and best practices will be developed. It will be today's data scientists that set the foundation for the next generation.</p>
    </div>
    
);

let aboutMeSection = (
    <div id="about-me">
      <h2>About Me</h2>
      <hr />
      <p>I have been working in the field of data science since 2016 working in the trading, gaming and Internet of Things (IoT) industries. Currently I work as a data science consultant but prior to this I was leading a team of data scientists and engineers at a gaming company. Before this I worked on a couple of start ups achieving some success which you can read about this in the <Link to="articles">articles</Link> section.</p>
      
      <p>I completed a PhD in Particles Physics from the University of Bristol in 2014 where I was researching Monte Carlo simulation models which were used to model pQCD particle production rates of proton-proton collisions occuring at the Large Hadron Collider located at the international research laboratory CERN based in Geneva. I studied a Masters in Particle Physics at the University College of London and a Bachelors in Physics with Space Science at the University of Leicester. Also working with Monte Carlo simulators as final projects.</p>
      
      <p>In my spare time I enjoy travelling, I have travelled Central America, Eastern Europe, China, Australia and New Zealand. I speak Spanish, converted my own campervan from an old Ford Transit and am working on building a house in Bulgaria!</p>
    </div>
);

function Home() {
    return (
        <div className="container">
          {welcomeSection}
          {whatIsDataScienceSection}
          {aboutMeSection}
        </div>
    );
}

export default Home;
