import { Link, useRouteMatch } from "react-router-dom";


function Index({path}) {

    return (
        <div>
          <h1>Articles</h1>
          <hr />

          <h2>Data science</h2>
          <ul>
            <li>
              <Link to={`${path}/data-science/arima-time-series-modelling`}>ARIMA time series modelling</Link>
            </li>
            <li>
              <Link to={`${path}/data-science/confidence-intervals`}>
                Confidence intervals
              </Link>
            </li>
            <li>
              <Link to={`${path}/data-science/goodness-of-fit`}>
                Goodness of fit
              </Link>
            </li>
            <li>
              <Link to={`${path}/data-science/f-tests-comparing-the-variances-of-multiple-samples`}>
                F tests: Comparing the variances of multiple samples
              </Link>
            </li>
            <li>
              <Link to={`${path}/data-science/t-tests-and-the-students-t-distribution`}>
                T tests and the students t distribution
              </Link>
            </li>
            <li>
              <Link to={`${path}/data-science/conda-environments`}>
                Conda environments
              </Link>
            </li>
          </ul>

          <h2>Data engineering</h2>
          <ul>
            <li>
              <Link to={`${path}/data-engineering/how-to-build-a-simple-data-engineering-platform-with-aws`}>How to build a simple data engineering platform with AWS</Link>
            </li>
            <li>
              <Link to={`${path}/data-engineering/scheduling-tasks-with-airflow`}>Scheduling tasks with Airflow</Link>
            </li>
            <li>
              <Link to={`${path}/data-engineering/getting-started-with-pyspark`}>Getting started with PySpark</Link>
            </li>
            <li>
              <Link to={`${path}/data-engineering/how-to-build-a-spark-cluster-on-aws`}>How to build a Spark cluster on AWS</Link>
            </li>
          </ul>

          <h2>Web development</h2>
          <ul>
            <li>
              <Link to={`${path}/web-development/how-to-simple-microservices-app-with-kubernetes-flask-and-react`}>
                How to: Simple microservices app with Kubernetes, Flask and React
              </Link>
            </li>
            <li>
              <Link to={`${path}/web-development/how-to-favicons`}>
                How to: Favicons
              </Link>
            </li>
            <li>
              <Link to={`${path}/web-development/how-to-commenting-with-django-comments`}>
                How To: Commenting with Django Comments
              </Link>
            </li>
            <li>
              <Link to={`${path}/web-development/how-to-simple-bootstrap-webpage-with-navbar-and-sidebar`}>
                How To: Simple Bootstrap webpage with navbar and sidebar
              </Link>
            </li>
            <li>
              <Link to={`${path}/web-development/bem-naming-convention-for-css-classes`}>
                BEM Naming convention for CSS classes
              </Link>
            </li>
            <li>
              <Link to={`${path}/web-development/css-important`}>
                CSS: !important
              </Link>
            </li>
            <li>
              <Link to={`${path}/web-development/deploying-a-django-application-with-docker`}>
                Deploying a django application with docker
              </Link>
            </li>
            <li>
              <Link to={`${path}/web-development/structuring-your-django-project`}>
                Structuring your django project
              </Link>
            </li>            
            <li>
              <Link to={`${path}/web-development/how-to-creating-a-domain-for-your-website`}>
                How to: Creating a domain for your website
              </Link>
            </li>            

          </ul>

        </div>
    );
}

export default Index;
