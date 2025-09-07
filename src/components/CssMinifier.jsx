import { useEffect, useState } from "react";
import CodeOutput from './CodeOutput';

export function minifier(code){
    return code.replaceAll(" ","").replaceAll(/\/\*.*?\*\//g, "").replaceAll("\n", "")
}

const CssMinifier = () => {
  
    const [cssText, setCssText] = useState()
    const [minifiedCss, setMinifiedCss] = useState()

  return (
    <div className="container">
      <div className="card-body p-3">
        <h4 className="card-title mb-4">Css Minifier</h4>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-3">
              <div>
                <label htmlFor="inputCss" className="form-label">Input Css</label>
                <textarea className="form-control" id="inputCss" rows="3" placeholder="css code" value={cssText} onChange={e => setCssText(e.target.value)}></textarea>
                <button type="button" class="btn btn-primary mt-3" onClick={() => setMinifiedCss(minifier(cssText))}>Primary</button>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <CodeOutput code={minifiedCss}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssMinifier;
