import { Code, Equation, InlineEquation } from "../../Utilities";


function CssImportant() {
    return (
        <div>

<h1 className="title">CSS <code>!important</code></h1>

<div>
  Published on <i>24th July  2019</i>
</div>
<hr />

<div id="introduction">
  <h2>Introduction</h2>
  <p>In CSS the <code>!important</code> flag is a way of overriding the default CSS styling behaviour. By putting the term <code>!important</code> after a CSS attribute value it instructs your browser to prioritise this particular style and override other styles. Here is a slightly contrived example,</p>

<Code text={String.raw`<!-- my_page.html -->	
<p className="html-example">I am an example of importance!</p>`} />

<Code text={String.raw`# styles.css
.html-example {
  color: red !important;
  color: green;
}`} />

  <p>Results in,</p>
        <div style={{backgroundColor:'rgba(0, 0, 0, 0.025)', padding: '1em 1em 1em 1em'}}>
          <p className="html-example" style={{marginBottom: 0, color: 'red'}}>I am an example of importance!</p>
  </div>

</div> 

<div id="priority-overriding-and-specifity">
  <h2>Priority and Specifity</h2>

  <p>The priority of a style is primarily determined by its <b>specifity</b> which can be calculated from the following rules,</p>

  <ol>
    <li>Is the style <code>!important</code>?</li>
    <li><b>Inline styling</b>, i.e. the style is applied through the element's <code>style</code> attribute, e.g. <code>&lt;p style="color: red"&gt;some red text&lt;/p&gt;</code></li>
    <li>The number of <b>ID</b>s used by the style's selector</li>
    <li>The number of <b>class</b> used by the style's selector</li>
    <li>The number of <b>element</b> used by the style's selector</li>
  </ol>

  <p>Where rules higher in the list have a greater weight, e.g. a style with class selector will have higher priority thatn a style with an element selector, regardless of how elements there are in the selector. See <a href="https://css-tricks.com/specifics-on-css-specificity/#article-header-id-0">here</a> for more in depth look into how the specifity score is calculated.</p>

  <p>In situations where css styles have the <b>same specifity</b> (as in my contrived example above) the style that is applied last in the document the style is applied. In your normal document the order of styles will follow where the style is defined, e.g.</p>
  
  <ol>
    <li><b>External Stylesheets</b>: a separate css file which is normally loaded in the <code>&lt;head&gt;</code> tag. e.g. <code>&lt;link rel="stylesheet" type="text/css" href="static/styles.css"&gt;</code></li>
    <li><b>Internal Stylesheets</b>: a <code>&lt;style&gt;</code> tag found inside the <code>&lt;head&gt;</code> tag of a webpage, e.g. <code>{`<style>p {color: red}</style>`}</code></li>
    <li><b>Inline Styling</b>: found inside the tag element, e.g. </li>
  </ol>

<p>In general the items further down the list will be applied later.</p>
  
</div> 

<div id="when-to-use-important">
  <h2>When to use <code>!important</code>?</h2>
        <p style={{paddingTop: '1em'}}>The use of the <code>!important</code> tag is quite controversial, it can lead to code that is hard to understand, debug and maintain. What can typically occur is that someone tries to apply a style but finds that it is not being applied (since there is another style that has higher specifity than it), instead of finding the other style and the selector is uses, then modifying their style to an appropriate higher level of specifity, it is tempting sometimes to simply apply the <code>!important</code> tag. This fixes the current issue but leaves <code>!important</code> styles for future developers (or the original author themselves) as a future cause of frustration.</p>

  <p>But do whatever you want.</p>
</div>

<div id="further-reading">

  <h2>Further Reading</h2>

  <p></p>

  <ul>
    <li><a href="https://css-tricks.com/when-using-important-is-the-right-choice/">CSS Tricks</a></li>
    <li><a href="https://www.geeksforgeeks.org/how-to-apply-important-in-css/">Geeks for Geeks</a></li>
    <li><a href="https://css-tricks.com/specifics-on-css-specificity/">CSS Tricks - Specifity</a></li>
  </ul>
</div>
          
        </div>
    );
}

export default CssImportant;

