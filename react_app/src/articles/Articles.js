import { Link, useRouteMatch, Route, Switch } from "react-router-dom";

import ArimaTimeSeriesModelling from "./data_science/ArimaTimeSeriesModelling";
import ConfidenceIntervals from "./data_science/ConfidenceIntervals";
import CondaEnvironments from "./data_science/CondaEnvironments";
import FTestsComparingTheVariancesOfMultipleSamples from "./data_science/FTestsComparingTheVariancesOfMultipleSamples";
import GoodnessOfFit from "./data_science/GoodnessOfFit";
import Index from "./Index";
import TTestsAndTheStudentsTDistribution from "./data_science/TTestsAndTheStudentsTDistribution";
import HowToBuildASimpleDataEngineeringPlatformWithAws from "./data_engineering/HowToBuildASimpleDataEngineeringPlatformWithAws";
import SchedulingTasksWithAirflow from "./data_engineering/SchedulingTasksWithAirflow";
import GettingStartedWithPyspark from "./data_engineering/GettingStartedWithPyspark";
import HowToBuildASparkClusterOnAws from "./data_engineering/HowToBuildASparkClusterOnAws";
import HowToFavicons from "./web_development/HowToFavicons";
import HowToCommentingWithDjangoComments from "./web_development/HowToCommentingWithDjangoComments";
import HowToSimpleBootstrapWebpageWithNavbarAndSidebar from "./web_development/HowToSimpleBootstrapWebpageWithNavbarAndSidebar";
import BemNamingConventionForCssClasses from "./web_development/BemNamingConventionForCssClasses";
import CssImportant from  "./web_development/CssImportant";
import DeployingADjangoApplicationWithDocker from "./web_development/DeployingADjangoApplicationWithDocker";
import StructuringYourDjangoProject from "./web_development/StructuringYourDjangoProject";
import HowToCreatingADomainForYourWebsite from "./web_development/HowToCreatingADomainForYourWebsite";
import HowToSimpleMicroservicesAppWithKubernetesFlaskandReact from "./web_development/HowToSimpleMicroservicesAppWithKubernetesFlaskandReact";
import FlaskApiTemplate from "./web_development/FlaskApiTemplate"


function Articles() {

    let match = useRouteMatch();
    
    return (
        <div className="container">

          <Switch>
            <Route path={`${match.path}/data-science/arima-time-series-modelling`}>
              <ArimaTimeSeriesModelling />
            </Route>
            <Route path={`${match.path}/data-science/confidence-intervals`}>
              <ConfidenceIntervals />
            </Route>
            <Route path={`${match.path}/data-science/goodness-of-fit`}>
              <GoodnessOfFit />
            </Route>
            <Route path={`${match.path}/data-science/f-tests-comparing-the-variances-of-multiple-samples`}>
              <FTestsComparingTheVariancesOfMultipleSamples />
            </Route>
            <Route path={`${match.path}/data-science/t-tests-and-the-students-t-distribution`}>
              <TTestsAndTheStudentsTDistribution />
            </Route>
            <Route path={`${match.path}/data-science/conda-environments`}>
              <CondaEnvironments />
            </Route>

            <Route path={`${match.path}/data-engineering/how-to-build-a-simple-data-engineering-platform-with-aws`}>
              <HowToBuildASimpleDataEngineeringPlatformWithAws />
            </Route>
            <Route path={`${match.path}/data-engineering/scheduling-tasks-with-airflow`}>
              <SchedulingTasksWithAirflow />
            </Route>
            <Route path={`${match.path}/data-engineering/getting-started-with-pyspark`}>
              <GettingStartedWithPyspark />
            </Route>
            <Route path={`${match.path}/data-engineering/how-to-build-a-spark-cluster-on-aws`}>
              <HowToBuildASparkClusterOnAws />
            </Route>

            <Route path={`${match.path}/web-development/how-to-favicons`}>
              <HowToFavicons />
            </Route>
            <Route path={`${match.path}/web-development/how-to-commenting-with-django-comments`}>
              <HowToCommentingWithDjangoComments />
            </Route>
            <Route path={`${match.path}/web-development/how-to-simple-bootstrap-webpage-with-navbar-and-sidebar`}>
              <HowToSimpleBootstrapWebpageWithNavbarAndSidebar />
            </Route>
            <Route path={`${match.path}/web-development/bem-naming-convention-for-css-classes`}>
              <BemNamingConventionForCssClasses />
            </Route>
            <Route path={`${match.path}/web-development/css-important`}>
              <CssImportant />
            </Route>
            <Route path={`${match.path}/web-development/deploying-a-django-application-with-docker`}>
              <DeployingADjangoApplicationWithDocker />
            </Route>
            <Route path={`${match.path}/web-development/structuring-your-django-project`}>
              <StructuringYourDjangoProject />
            </Route>
            <Route path={`${match.path}/web-development/how-to-creating-a-domain-for-your-website`}>
              <HowToCreatingADomainForYourWebsite />
            </Route>
            <Route path={`${match.path}/web-development/how-to-simple-microservices-app-with-kubernetes-flask-and-react`}>
              <HowToSimpleMicroservicesAppWithKubernetesFlaskandReact />
            </Route>

            <Route path={`${match.path}/web-development/flask-api-template`}>
              <FlaskApiTemplate />
            </Route>
            
            <Route path="/">
              <Index path={match.path}/>
            </Route>
          </Switch>

          
        </div>
    );
}

export default Articles;
