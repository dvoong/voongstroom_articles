import { Code, Equation, InlineEquation } from "../../Utilities";


let styles = {
    "subscribe-button": {
        backgroundColor: 'LIGHTSTEELBLUE',
        color: 'WHITE',
    },
    "subscribe-button__price": {
        fontSize: '1.5em',
    },
    "subscribe-button__price--special-discount": {
        fontSize: '3em',
    },
    "subscribe-button__text": {
        fontSize: '1em',
    },
    "subscribe-button__text--special-discount": {
        fontSize: '2em',
    },
    "subscribe-button--special-discount": {
        backgroundColor: 'HOTPINK',
    }
};

function BemNamingConventionForCssClasses() {
    return (
        <div>
<h1 id="#" >BEM - Block Element Modifiers</h1>

<div>
  Created at <i>23rd July  2019</i>
</div>
<hr />

<div id="introduction">
  <h2>Introduction</h2>
  <p>BEM is a naming convention for CSS classes aimed at making HTML and CSS code more readable and therefore more understandable and maintainable. In this convention class names are made up of block, element and modifiers. Elements are separated by double underscores <code>__</code>, modifiers are separated with double dashes <code>--</code> and multiple words are separated by a single dash <code>-</code>, e.g.</p>
</div>

<div id="example-html">
  <h2>Example HTML</h2>
<Code text={String.raw`<!-- a block called "subscribe-button" -->	
<button class="subscribe-button">Subscribe</button>

<!-- a button with elements, "price" and "text"-->
<button class="subscribe-button">
<span class="subscribe-button__price">£9.99</span>
<span class="subscribe-button__text">Subscribe</span>
</button>

<!-- a button in a "special-discount" state i.e. modified -->
<button class="subscribe-button subscribe-button--special-discount">
<span class="subscribe-button__price subscribe-button__price--special-discount">£5.99</span>
<span class="subscribe-button__text subscribe-button__text--special-discount">Special Offer!</span>
</button>`} />
</div>

<div id="example-css">
  <h2>Example CSS</h2>
  <p>The corresponding CSS file might look something like this,</p>
<Code text={String.raw`.subscribe-button {
  background-color: LIGHTSTEELBLUE;
  color: WHITE;
}

.subscribe-button__price {
  font-size: 1.5em;
}

.subscribe-button__price--special-discount {
  font-size: 3em;
}

.subscribe-button__text {
  font-size: 1em;
}

.subscribe-button__text--special-discount {
  font-size: 2em;
}

.subscribe-button--special-discount {
  background-color: HOTPINK;
}`} />
  
</div>

<div id="example-result">
  <h2>Result</h2>
  <p style={{marginBottom: '2em'}}>Which would give the following result,</p>
  
  <button className="subscribe-button" style={styles["subscribe-button"]}>Subscribe</button>
  
  <button className="subscribe-button" style={styles["subscribe-button"]}>
    <span className="subscribe-button__price" style={styles["subscribe-button__price"]}>£9.99</span>
    <span className="subscribe-button__text" style={styles["subscribe-button__text"]}>Subscribe</span>
  </button>
  
  <button className="subscribe-button subscribe-button--special-discount"
          style={
              {
                  ...styles["subscribe-button"],
                  ...styles["subscribe-button--special-discount"],
              }
          }
  >
    <span className="subscribe-button__price subscribe-button__price--special-discount"
          style={
              {
                  ...styles["subscribe-button__price"],
                  ...styles["subscribe-button__price--special-discount"],
              }
          }
    >£5.99</span>
    <span className="subscribe-button__text subscribe-button__text--special-discount"
          style={
              {
                  ...styles["subscribe-button__text"],
                  ...styles["subscribe-button__text--special-discount"],
              }
          }
    >Special Offer!</span>
  </button>
  

        <p style={{marginTop: '2em'}}>Using this naming convention you or another developer arguably can better understand your styling. <code>subscribe-button__text--special-discount</code> corresponds to the <code>text</code> element of the <code>subscribe-button</code> block in the state <code>special-discount</code>.</p>

</div> 

<div id="further-reading">

  <h2>Further Reading</h2>

  <p>I've only given a very brief overview of the BEM naming convention but the main point to remember is that a block should correspond to reusable block of code, i.e. something that can be reused on multiple pages of your website like a comments form or a search field. Since blocks are reusable they should correspond to a class rather than an id (note we did not use any id attributes in our example), since there can be many instances of the same block across multiple web pages.</p>

  <p>For more information have a look at the following sites, they go into much deeper in detail,</p>
  
  <ul>
    <li><a href="https://en.bem.info">https://en.bem.info</a></li>
    <li><a href="http://getbem.com/">http://getbem.com/</a></li>
    <li><a href="https://css-tricks.com/bem-101/">CSS Tricks</a></li>
    <li><a href="https://www.smashingmagazine.com/2018/06/bem-for-beginners/">Smashing Magazine Article</a></li>
  </ul>
</div>
        </div>
    );
}

export default BemNamingConventionForCssClasses;

