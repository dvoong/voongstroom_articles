import { Code, Equation, InlineEquation } from "../../Utilities";


function HowToFavicons() {
    return (
        <div>
          <h1>How To: Favicons</h1>
          <p><i>Published on 1st June 2019</i></p>
          <hr />
          <p>A favicon is a small icon associated to a website or web page. They can typically be found in the in the tab, address bar, history and bookmarks section of web browser. They can vary in size from 16 x 16 to 512 x 512 pixels depending on the platform and device. For a regular website I find 48 x 48 pixels works fine.</p>
          <p>You can create your own favicon using any image editor or there are many websites available that you can use to generate a favicon, simply search "favicon generator". For this site I used <a href="https://favicon.io/favicon-generator/">https://favicon.io/favicon-generator/</a>.</p>
          <p>To add a favicon to a webpage include the following element inside the <code>&lthead&gt</code> tag.</p>
          <Code text={String.raw`<link rel="shortcut icon" href="<favicon filepath>">`} />
        </div>
    );
}

export default HowToFavicons;

