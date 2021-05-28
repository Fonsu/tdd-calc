import "./Calculator.css";

import { Fragment, useEffect, useReducer } from "react";

import { evaluate } from "mathjs";

const rows = [[7, 8, 9], [4, 5, 6], [1, 2, 3], [0]];
const calcOperators = ["+", "-", "×", "÷"];
const equalSign = "=";
const clear = "C";

const getLastChar = (str: string) => (str.length ? str[str.length - 1] : "");
const isNumber = (str: string) => !isNaN(Number(str));

export const calculateExpression = (expression: string) => {
  if (!expression || expression.length === 0) {
    return;
  }

  const mulRegex = /×|x/g;
  const divRegex = /÷/g;
  const divideByZero = /\/0/g;

  let toEvaluate = expression.replace(mulRegex, "*").replace(divRegex, "/");

  try {
    if (divideByZero.test(toEvaluate)) {
      throw new Error("Can not divide by 0!");
    }

    const lastCharacterIsNumber = isNumber(getLastChar(toEvaluate));

    if (!lastCharacterIsNumber) {
      toEvaluate = toEvaluate.slice(0, -1);
    }

    const result = evaluate(toEvaluate);

    return result;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

const Calculator = () => {
  const [{value}, dispatch] = useReducer(reducer, {
    value: "",
  })

  useEffect(() => { 
    // console.log(`value changed to ${value}`)
  }, [value])
  
  useEffect(() => {
    const downHandler = (event: any) => {
      event.preventDefault();
      const regex = new RegExp('[x0-9+-/]');
      const clearRegex = new RegExp('Escape|Backspace|c')
      const calculateRegex = new RegExp('Enter|=')
      if (regex.test(event.key)) {
        dispatch({ type: 'KEY_PRESSED', value: event.key })
      } else if(clearRegex.test(event.key)) {
        dispatch({ type: 'CLEAR'})
      } else if(calculateRegex.test(event.key)) {
        dispatch({type: 'EQUALS_PRESSED'});
      }
    } 
    window.addEventListener("keydown", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []);

  const clearValue = () => dispatch({ type: 'CLEAR'})
  return (
    <div className="calculator">
      <h1>Calculator</h1>
      <input
        type="text"
        value={value}
        placeholder="0"
        disabled
      />
      <div className="calculator-buttons-container">
        <div role="grid">
          {rows.map((row, i) => {
            return (
              <Fragment key={row.toString()}>
                <div role="row">
                  {i === 3 && <button onClick={clearValue}>{clear}</button>}
                  {row.map((n: number) => (
                    <button
                      key={n}
                      onClick={() => dispatch({ type: 'KEY_PRESSED', value: n.toString() })}>
                      {n}
                    </button>
                  ))}
                  {i === 3 && <button onClick={() => dispatch({type: 'EQUALS_PRESSED'})}>{equalSign}</button>}
                </div>
              </Fragment>
            );
          })}
        </div>
        <div className="calculator-operators">
          {calcOperators.map((c) => (
            <button key={c} onClick={()=> dispatch({ type: 'KEY_PRESSED', value: c })}>
              {c.toString()}
            </button>
          ))}
        </div>
      </div>
      <div id="keyboard-hints-container">
        <p> ⌨️ </p>
        <div id="keyboard-hints">
            <p>
              <small>Press</small>
              {calcOperators.slice(0, calcOperators.length-1).map((operator, i)=> (
                <kbd key={i}>{operator}</kbd>
              ))}
              <kbd>/</kbd>
              <small> to Operate. </small>
            </p>
          <p>
            <small>Press </small>
            <kbd>c</kbd><kbd>Escape</kbd><kbd>Backspace</kbd>
             <small> to Clear. </small>
          </p>
          <p>
            <small>Press </small>
            <kbd>Enter</kbd><kbd>=</kbd>
            <small> to Calculate. </small>
          </p>
        </div>
      </div>
    </div>
  );
};

type Action = {
  type: string,
  value?: string;
}

 type State = {
  value?: string;
 }

function  reducer(state: State, action: Action): State {  
  action.value = action.value ?? '';
  state.value = state.value ?? '';

  switch (action.type) {
    case 'KEY_PRESSED':
      return {
        value: `${state.value}${action.value}`,
      }
    case 'EQUALS_PRESSED':
    return {
        value: calculateExpression(state.value),
    }
    case 'CLEAR':
      return {
        value: "",
      }
    default:
      return state
  }
}

export default Calculator;