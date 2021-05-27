import "./Calculator.css";

import { Fragment, useState } from "react";

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

  const mulRegex = /×/g;
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
  const [value, setValue] = useState("");

  const calculate = () => {
    const results = calculateExpression(value);
    setValue(results);
  };

  const clearValue = () => setValue("0");

  return (
    <div className="calculator">
      <h1>Calculator</h1>
      <input
        type="text"
        defaultValue={value}
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
                  {row.map((n) => (
                    <button
                      key={n}
                      onClick={() => setValue(value.concat(n.toString()))}
                    >
                      {n}
                    </button>
                  ))}
                  {i === 3 && <button onClick={calculate}>{equalSign}</button>}
                </div>
              </Fragment>
            );
          })}
        </div>
        <div className="calculator-operators">
          {calcOperators.map((c) => (
            <button key={c} onClick={() => setValue(value.concat(c))}>
              {c.toString()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;