import { MathComponent } from "mathjax-react";
import { CopyBlock } from "react-code-blocks";


function InlineEquation({tex}) {
    return <MathComponent display={false} tex={tex} />;
}

function Equation({tex}) {
    return <MathComponent tex={tex} />;
}

function Code({text, language='python'}) {
    return <CopyBlock text={text} theme='dracula' language={language} />;
}

export {Code, Equation, InlineEquation};
