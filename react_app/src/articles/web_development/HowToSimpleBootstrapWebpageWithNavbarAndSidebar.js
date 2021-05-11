import { Code, Equation, InlineEquation } from "../../Utilities";


function HowToSimpleBootstrapWebpageWithNavbarAndSidebar() {
    return (
	<div>
<h1>How To: Simple Bootstrap Webpage with Nav Bar and Side Bar</h1>

<div>
  Published on <i>15th July 2019</i>
</div>
<hr />

<div id="introduction">
  <h2>Introduction</h2>
  <p>Bootstrap is a framework for creating responsive web pages. A responsive web page is a web page that changes its layout depending on the size and shape of the device it is being viewed on, e.g. desktop computers or smart phones. One of the advantages of this is that it is easier to maintain, any change to a web page need only be made in one document rather than multiple documents where each document corresponds to a different size/shape configuration.</p>

  <p>For this how to you will need a web browser, a connection to the internet and a text editor. This is a very basic setup but it has the advantage of being free of any non essential components. In the real world you would generally be working with web frameworks and IDEs.</p>
</div>

<div id="a-basic-page-with-navbar">
  <h2>A Basic Page with a Nav Bar</h2>
  <p>A basic page might look something like,</p>
  <Code text={`String.raw<html>
  <head>
    <title>Basic Page with Nav Bar</title>
  </head>
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	<span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
	<ul class="navbar-nav mr-auto">
	  <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
	  </li>
	  <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
	  </li>
	  <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
	  </li>
	  <li class="nav-item">
            <a class="nav-link disabled" href="#">Disabled</a>
	  </li>
	</ul>
	<form class="form-inline my-2 my-lg-0">
	  <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
	  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
	</form>
      </div>
    </nav>
  </body>
</html>`} />

  <p>If you create a file with the contents as shown above and open it in your web browser you should get something like this,</p>

  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <a className="navbar-brand" href="#">Navbar</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
	<li className="nav-item active">
          <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
	</li>
	<li className="nav-item">
          <a className="nav-link" href="#">Link</a>
	</li>
	<li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">Something else here</a>
          </div>
	</li>
	<li className="nav-item">
          <a className="nav-link disabled" href="#">Disabled</a>
	</li>
      </ul>
      <form className="form-inline my-2 my-lg-0">
	<input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
	<button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>


  <p>The code above is from the navbar example from the <a href="https://getbootstrap.com/docs/4.0/components/navbar/">Bootstrap website</a>, it can be a bit intimidating at first but I'll go through the example and highlight some of the important parts.</p>

        <Code text={`String.raw<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">`} />

  <p>This element is how you essentially "install" bootstrap into your webpage. When your webpage initially loads the above code will load the libraries required by Bootstrap. In this example I'm using Bootstrap version 4.3.1, if you want to use the most up to date version you can get the link through Bootstrap's website <a href="https://www.bootstrapcdn.com/">here</a> (Note I am only using the CSS library in this example).</p>

    <Code text={`String.raw<nav class="navbar navbar-expand-lg navbar-light bg-light">
...      
</nav>`} />

        <p>The <a href="https://www.w3schools.com/tags/tag_nav.asp">&lt;nav&gt;</a> element is an HTML element used to group a block of navigation links. Bootstrap adds its functionality via classifying it as a <code>.nav</code> object. The <code>navbar-expand-lg</code> class defines how the navbar changes depending on the dimensions of the device. The other classes determine the color of the navbar. See <a href="https://getbootstrap.com/docs/4.0/components/navbar/#color-schemes">here</a> for more details.</p>
    
    <Code text={String.raw`<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
<span class="navbar-toggler-icon"></span>
</button>`} />

<p>When the width of the device gets smaller than a certain width, the links on the navbar will collapse into a single menu button. You can see this yourself by resizing this webpage into a more narrow format (assuming you are viewing this page on a wide enough device to see the full sized navbar). The attribute <code>data-target="#navbarSupportedContent"</code> determines the target element to show when the menu button is clicked.</p>
</div>

<Code text={String.raw`<div class="collapse navbar-collapse" id="navbarSupportedContent">
...
</div>`} />

<p>This is where you will actually put your navigation links. Note they are wrapped in a <code>div</code> with the id  <code>navbarSupportedContent</code> which is associated to the menu button described previously. From here it is a simple case of adding different types of navigation links which are well documented on the Bootstrap website.</p>

<div id="adding-a-sidebar">
  <h2>Adding a Sidebar</h2>
  <p>Navbars are great for site navigation, but adding a sidebar can also be useful for navigation within a page. Below is an example of sidebar with intrapage links.</p>

  <Code text={String.raw`<html>
  <head>
    <title>Basic Page with Nav Bar</title>
  </head>
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	<span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
	<ul class="navbar-nav mr-auto">
	  <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
	  </li>
	  <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
	  </li>
	  <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
	  </li>
	  <li class="nav-item">
            <a class="nav-link disabled" href="#">Disabled</a>
	  </li>
	</ul>
	<form class="form-inline my-2 my-lg-0">
	  <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
	  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
	</form>
      </div>
    </nav>

    <div class="row">

      <nav class="col-md-2 d-none d-md-block">
          <div class="sticky-top">
            <ul class="nav">
              <li class="nav-item">
                <a class="nav-link active" href="#section1">
                  Section 1
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#section2">
                  Section 2
                </a>
              </li>
            </ul>
          </div>
        </nav>
      
      <div class="col-md-7">
	<div id="section1">
	  <h2>section 1</h2>
	  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat et justo vel scelerisque. Etiam accumsan nulla neque, eget dapibus massa aliquet eget. Nulla nec dapibus odio. In a erat iaculis arcu mollis pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque faucibus, justo vel scelerisque commodo, eros justo porta augue, id volutpat ante orci ultrices odio. Mauris tempus quis augue imperdiet sollicitudin. Integer ac dictum nulla, at consequat magna. Fusce gravida, tellus ut blandit suscipit, lectus lectus auctor lorem, non ultrices urna libero a nunc. Pellentesque feugiat, massa eu aliquam malesuada, ipsum justo lacinia mauris, id imperdiet risus felis sodales velit. Praesent fermentum nisi purus, eget dictum ex placerat in.</p>
	  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat et justo vel scelerisque. Etiam accumsan nulla neque, eget dapibus massa aliquet eget. Nulla nec dapibus odio. In a erat iaculis arcu mollis pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque faucibus, justo vel scelerisque commodo, eros justo porta augue, id volutpat ante orci ultrices odio. Mauris tempus quis augue imperdiet sollicitudin. Integer ac dictum nulla, at consequat magna. Fusce gravida, tellus ut blandit suscipit, lectus lectus auctor lorem, non ultrices urna libero a nunc. Pellentesque feugiat, massa eu aliquam malesuada, ipsum justo lacinia mauris, id imperdiet risus felis sodales velit. Praesent fermentum nisi purus, eget dictum ex placerat in.</p>
	  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat et justo vel scelerisque. Etiam accumsan nulla neque, eget dapibus massa aliquet eget. Nulla nec dapibus odio. In a erat iaculis arcu mollis pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque faucibus, justo vel scelerisque commodo, eros justo porta augue, id volutpat ante orci ultrices odio. Mauris tempus quis augue imperdiet sollicitudin. Integer ac dictum nulla, at consequat magna. Fusce gravida, tellus ut blandit suscipit, lectus lectus auctor lorem, non ultrices urna libero a nunc. Pellentesque feugiat, massa eu aliquam malesuada, ipsum justo lacinia mauris, id imperdiet risus felis sodales velit. Praesent fermentum nisi purus, eget dictum ex placerat in.</p>
	  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat et justo vel scelerisque. Etiam accumsan nulla neque, eget dapibus massa aliquet eget. Nulla nec dapibus odio. In a erat iaculis arcu mollis pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque faucibus, justo vel scelerisque commodo, eros justo porta augue, id volutpat ante orci ultrices odio. Mauris tempus quis augue imperdiet sollicitudin. Integer ac dictum nulla, at consequat magna. Fusce gravida, tellus ut blandit suscipit, lectus lectus auctor lorem, non ultrices urna libero a nunc. Pellentesque feugiat, massa eu aliquam malesuada, ipsum justo lacinia mauris, id imperdiet risus felis sodales velit. Praesent fermentum nisi purus, eget dictum ex placerat in.</p>
	</div>
	<div id="section2">
	  <h2>section 2</h2>
	  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam volutpat et justo vel scelerisque. Etiam accumsan nulla neque, eget dapibus massa aliquet eget. Nulla nec dapibus odio. In a erat iaculis arcu mollis pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque faucibus, justo vel scelerisque commodo, eros justo porta augue, id volutpat ante orci ultrices odio. Mauris tempus quis augue imperdiet sollicitudin. Integer ac dictum nulla, at consequat magna. Fusce gravida, tellus ut blandit suscipit, lectus lectus auctor lorem, non ultrices urna libero a nunc. Pellentesque feugiat, massa eu aliquam malesuada, ipsum justo lacinia mauris, id imperdiet risus felis sodales velit. Praesent fermentum nisi purus, eget dictum ex placerat in.</p>

	</div>
      </div>
    </div>
    
  </body>
</html>`} />

        <p>After the navbar there is now a <code>&lt;row&gt;</code> element. In that element are two <code>&lt;div&gt;</code> elements with the <code>col</code> class, the first corresponds to the sidebar,</p>

        <p><code>&lt;nav class="col-md-2 d-none d-md-block"&gt;</code></p>

  <p>and the other to the main content of the webpage,</p>

  <p><code>&lt;div class="col-md-7"&gt;</code></p>

        <p><code>d-none</code> ensures that the sidebar is hidden when the viewport is too small. Inside the sidebar element is a <code>&lt;div&gt;</code> element with class <code>sticky-top</code>,</p>

        <p><code>&lt;div class="sticky-top"&gt;</code></p>

  <p>this helps to keep the sidebar fixed when scrolling through the webpage. <code>sticky-top</code> is a Bootstrap <a href="https://getbootstrap.com/docs/4.0/utilities/position/">class</a> which uses the CSS styling <a href="https://www.w3schools.com/css/css_positioning.asp">sticky</a> positioning feature. Note you can also used <code>fixed-top</code> but this will remove the element from the document flow meaning its contents will overlap with other elements if its contents is long enough. This is not the case when using <code>sticky</code> positioning.</p>
  
</div>
        </div>
    );
}

export default HowToSimpleBootstrapWebpageWithNavbarAndSidebar;
