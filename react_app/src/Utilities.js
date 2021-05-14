import { MathComponent } from "mathjax-react";
import { CodeBlock, CopyBlock } from "react-code-blocks";


function InlineEquation({tex}) {
    return <MathComponent display={false} tex={tex} />;
}

function Equation({tex}) {
    return <MathComponent tex={tex} />;
}

function Code({copy=true, text, language='python', showLineNumbers=false}) {
    if(copy === false)
	return <CodeBlock text={text} theme='dracula' language={language} showLineNumbers={showLineNumbers} />;
    else
	return <CopyBlock text={text} theme='dracula' language={language} showLineNumbers={showLineNumbers} />;
}

export {Code, Equation, InlineEquation};
