import { useEffect, useState } from "react";
import CodeOutput from './CodeOutput';
import { minifier } from "./CssMinifier";

const JsMinifier = () => {
  
    const [jsText, setJsText] = useState()
    const [minifiedJs, setMinifiedJs] = useState()
    

  return (
    <div className="container">
      <div className="card-body p-3">
        <h4 className="card-title mb-4">Js Minifier</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <div>
                <label htmlFor="inputJs" className="form-label">Input Js</label>
                <textarea className="form-control" id="inputJs" rows="3" placeholder="js code" value={jsText} onChange={e => setJsText(e.target.value)}></textarea>
                <button type="button" class="btn btn-primary mt-3" onClick={() => setMinifiedJs(minifier(jsText))}>Primary</button>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <CodeOutput code={minifiedJs} codeLanguage="javascript"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsMinifier;
