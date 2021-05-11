import { Code, Equation, InlineEquation } from "../../Utilities";


function HowToCommentingWithDjangoComments() {
    return (
	<div>
          <h1>How To: Commenting with <code>django-comments</code></h1>

          <div>
            Published on <i>13th July 2019</i>
          </div>
          <hr />
          <div id="introduction">
            <p>Commenting allows other people to give feedback on your website, Django use to come with a commenting framework but this was separted into its own project called <a href="https://github.com/django/django-contrib-comments">django-comments</a> the documentation for which can be found <a href="https://django-contrib-comments.readthedocs.io/en/latest/quickstart.html">here</a>. Commenting requires your website to have a system inplace for identifying users and storing persistent data, this article will use the inbuilt Django user framework and persistent storage through Djangos model framework which stores persistent data in a database.</p>

            <p>
              This example with be for a website that contains several articles. Each article will have a comments section and show comments from users for that particular article. We will have to install the <code>django-comments</code> framework, then display a comments form for each article, then create an Article model so that the comment can associate itself to the relevant article then finally display a list of comments for the article.
            </p>
          </div>

          <div id="installing-the-comments-framework">
            <h2>Installing the <code>django-comments</code> Framework</h2>
            <p>Install the python package with your preferred package manager, I used <code>conda</code> for this example but <code>pip</code> would work fine too.</p>
            <Code text={String.raw`conda install django-comments`} />
            <p>Include the django comments in your projects <code>settings.py</code> file</p>

            <Code text={String.raw`...
INSTALLED_APPS = [
  ...,
  django_comments,
]
...`} />

            <p>To link the URLs insert the following into your project's <code>urls.py</code> file.</p>

            <Code text={String.raw`...

urlpatterns = [
  ...,
  url(r'^comments/', include('django_comments.urls')),
]	
...`} />
          </div>

          <div id="displaying-the-comments-form">
            <h2>Displaying the Comments Form</h2>
            <p>In your article template you will need to load the <code>django-comments</code> tags, in your template insert,</p>
            <Code text={String.raw`...
{% verbatim %}{% load comments %}{% endverbatim %}
...`} />

            <p>next add,</p>
            <Code text={String.raw`{% verbatim %}{% render_comment_form for article %}{% endverbatim %}`} />
            <p>The <code>render_comment_form</code> is a tag from the <code>django-comments</code> framework and article is an object that we need to create and pass to the template, this is how a comment is linked to a particular article.</p>
          </div>

          <div id="creating-the-article-model">
            <h2>Creating the Article Model</h2>
            <p>In your <code>models.py</code> file of your django application add a new Article model,</p>
            <Code text={String.raw`from django.db import models
...
class Article(models.Model):
  name = models.CharField(max_length=255)
...`} />

            <p>and migrate the changes to your database.</p>

            <Code text={String.raw`python manage.py migrate`} />
          </div>

          <div id="passing-the-article-to-the-view">
            <h2>Passing the Article to the View</h2>
            <p>In the view for your article you will now to need to pass an object with the name "article" to the template, for example your <code>views.py</code> file in your application might look something like, </p>
            <Code text={String.raw`...

def my_awesome_article(request):
  article = Article.objects.get(name="My Awesome Article")
  return render(request, "article_app/my_awesome_article.html", {"article": article})

...`} />
            <p>The article object needs to be created or you will get an error. You can do this in several ways, e.g. manually create it or use some conditional logic to create the article if it does not already exist, e.g,
            </p>

            <Code text={String.raw`...

try:
  article = Article.objects.get(name="My Awesome Article")
except Article.DoesNotExist:
  article = Article.objects.create(name="My Awesome Article")

...`} />
            <p>However in practise for a website with dynamic number of articles you'll probably want to create a more generic view which can be reused for all articles, so the above is really just for the purpose of this tutorial.</p>
          </div>

          <div id="displaying-comments">
            <h2>Displaying Comments</h2>
            <p>Finally to display your comments you can use another helper tag from the <code>django-comments</code> framework, in your template insert,</p>
            <Code text={String.raw`...
{% verbatim %}{% render_comment_list for article %}{% endverbatim %}
...`} />
          </div>

          <div id="summary">
            <h2>Summary</h2>
            <p>This how to really just scratches the surface of the <code>django-comments</code> framework. If you use this framework for a "real" website you'll find you'll want to do a lot of your own customisation, fortunately the <a href="https://django-contrib-comments.readthedocs.io/en/latest/quickstart.html">documentation</a> is quite good but I hope this how to serves as a good introduction and puts across some of the main concepts of how to build commenting into your website.</p>
          </div>
          
        </div>
    );
}

export default HowToCommentingWithDjangoComments;
