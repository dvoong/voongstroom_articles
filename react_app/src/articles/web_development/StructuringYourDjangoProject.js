import { Code, Equation, InlineEquation } from "../../Utilities";


function StructuringYourDjangoProject() {
    return (
        <div>
<h1 className="title">Structuring your django project</h1>

<div>
  Published on <i>8th August 2019</i>
</div>
<hr />

<div>
  <p>Structuring your <code>django</code> project in a consistent a appropriate way can help to speed up development and make maintenance easier. I generally structure my projects as shown below.</p>

<Code text={String.raw`project root directory
  my_app # optional, if you're just making a basic website you may not need to create an app
    static
      my_app # static files should be namespaced by the app name
    templates
      my_app # template files should be namespaced by the app name
    admin.py
    apps.py
    models.py
    tests.py # when there are many tests this can be structured into directories
    urls.py
    views.py

  project_name
    __init__.py
    settings.py # when there are many settings, e.g. prod, dev, staging this can be structured into directories
    urls.py
    wsgi.py
    static # you will need to add your project_name to the INSTALLED_APPS for it to find these static files
      project_name # static files should be namespaced by the project name
    templates # you will need to add your project_name to the INSTALLED_APPS for it to find these templates
      project_name # templates should be namespaced by the project name

  functional_tests # e.g. if you're practising TDD

  .git
  .gitignore
  Dockerfile
  docker-entrypoint.sh
  docker-compose.yml
  gulpfile.js # for building javascript libraries
  manage.py
  node_modules # if using node modules
  package-lock.json # if using node modules
  package.json # if using node modules
  README.md
  requirements.txt # if you have many different environments that have different requirements this may be structured into directories, e.g. requirements/prod.txt, requirements/dev.txt, requirements.base.txt`} />

  <p>Other conventions are used, but I don't think there is any strict rule. As with most things in programming, as long as you are consistent you will reap the benefits of structuring your projects.</p>
</div>

<div id="further-reading">
  <h2>Further reading</h2>
  <ul>
    <li><a href="https://www.revsys.com/tidbits/recommended-django-project-layout">https://www.revsys.com/tidbits/recommended-django-project-layout/</a></li>
    <li><a href="https://stackoverflow.com/questions/22841764/best-practice-for-django-project-working-directory-structure">https://stackoverflow.com/questions/22841764/best-practice-for-django-project-working-directory-structure</a></li>
    <li><a href="https://django-project-skeleton.readthedocs.io/en/latest/structure.html">https://django-project-skeleton.readthedocs.io/en/latest/structure.html</a></li>
  </ul>
</div>
        </div>
    );
}

export default StructuringYourDjangoProject;

