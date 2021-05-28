import Calculator, { calculateExpression } from './Calculator';
import { fireEvent, render, screen } from '@testing-library/react';

import App from './App';
import React from 'react';

test('renders calculator', () => {
  render(<App />);
  const linkElement = screen.getByText(/calculator/i);
  expect(linkElement).toBeInTheDocument();
});

describe("<Calculator />", () => {
  it("shows numbers", () => {
    render(<Calculator/>);
    const numbers = [0 ,1, 2, 3, 4, 5, 6, 7, 8, 9];
    numbers.forEach(n=> {
      expect(screen.getByText(n.toString())).toBeInTheDocument();
    })
  })
  it("shows 4 rows", ()=> {
    render(<Calculator/>);
    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(4);
  })
  it("shows calculation operators", () => {
    render(<Calculator />);
    const calcOperators = ["+", "-", "×", "÷"];

    calcOperators.forEach((operator) => {
      expect(screen.getAllByText(operator.toString())[0]).toBeInTheDocument();
    });
  });
  it("renders equal", () => {
    render(<Calculator />);
    const equalSign = "=";
    expect(screen.getAllByText(equalSign.toString())[0]).toBeInTheDocument();
  });
  it("renders clear sign", () => {
    render(<Calculator />);
    const clear = "C";
    expect(screen.getByText(clear)).toBeInTheDocument();
  });
  it("renders an input", () => {
    render(<Calculator />);
    expect(screen.getByPlaceholderText("0")).toBeInTheDocument();
  });
  it("renders an input disabled", () => {
    render(<Calculator />);
    expect(screen.getByPlaceholderText("0")).toBeDisabled();
  });
  it("displays users inputs", async () => {
    render(<Calculator />);
    const one = screen.getByText("1");
    const two = screen.getByText("2");
    const plus = screen.getAllByText("+")[0];
    fireEvent.click(one);
    fireEvent.click(plus);
    fireEvent.click(two);

    const result = await screen.findByPlaceholderText("0");
    // @ts-ignore
    expect(result.value).toBe("1+2");
  });
  it("displays multiple users inputs", async () => {
    render(<Calculator />);
    const one = screen.getByText("1");
    const two = screen.getByText("2");
    const three = screen.getByText("3");
    const five = screen.getByText("5");
    const divide = screen.getByText("÷");
    const mul = screen.getAllByText("×")[0];
    const minus = screen.getAllByText("-")[0];
    fireEvent.click(three);
    fireEvent.click(mul);
    fireEvent.click(two);
    fireEvent.click(minus);
    fireEvent.click(one);
    fireEvent.click(divide);
    fireEvent.click(five);

    const result = await screen.findByPlaceholderText("0");
    // @ts-ignore
    expect(result.value).toBe("3×2-1÷5");
  });
  it("calculate based on users inputs", async () => {
    render(<Calculator />);
    const one = screen.getByText("1");
    const two = screen.getByText("2");
    const plus = screen.getAllByText("+")[0];
    const equal = screen.getAllByText("=")[0];
    fireEvent.click(one);
    fireEvent.click(plus);
    fireEvent.click(two);
    fireEvent.click(equal);

    const result = await screen.findByPlaceholderText("0");

    expect(
      (result as HTMLElement & {
        value: string;
      }).value
    ).toBe("3");
  });
  it("calculate based on multiple users inputs", async () => {
    render(<Calculator />);
    const one = screen.getByText("1");
    const two = screen.getByText("2");
    const three = screen.getByText("3");
    const five = screen.getByText("5");
    const divide = screen.getByText("÷");
    const mul = screen.getAllByText("×")[0];
    const minus = screen.getAllByText("-")[0];
    const equal = screen.getAllByText("=")[0];

    fireEvent.click(three);
    fireEvent.click(mul);
    fireEvent.click(two);
    fireEvent.click(minus);
    fireEvent.click(one);
    fireEvent.click(divide);
    fireEvent.click(five);
    fireEvent.click(equal);

    const result = await screen.findByPlaceholderText("0");
    expect(
      (result as HTMLElement & {
        value: string;
      }).value
    ).toBe("5.8");
  });
  it("can clear results", async () => {
    render(<Calculator />);
    const one = screen.getByText("1");
    const two = screen.getByText("2");
    const plus = screen.getAllByText("+")[0];
    const clear = screen.getAllByText("C")[0];
    fireEvent.click(one);
    fireEvent.click(plus);
    fireEvent.click(two);

    fireEvent.click(clear);

    const result = await screen.findByPlaceholderText("0");
    expect(
      (result as HTMLElement & {
        value: string;
      }).value
    ).toBe("");
  });

})
describe("calculateExpression", () => {
  it("correctly computes for 2 numbers with +", () => {
    expect(calculateExpression("1+1")).toBe(2);
    expect(calculateExpression("10+10")).toBe(20);
    expect(calculateExpression("11+345")).toBe(356);
  });

  it("correctly subtracts 2 numbers", () => {
    expect(calculateExpression("1-1")).toBe(0);
    expect(calculateExpression("10-1")).toBe(9);
    expect(calculateExpression("11-12")).toBe(-1);
  });

  it("correctly multiples 2 numbers", () => {
    expect(calculateExpression("1×1")).toBe(1);
    expect(calculateExpression("10×0")).toBe(0);
    expect(calculateExpression("11×-12")).toBe(-132);
  });

  it("correctly divides 2 numbers", () => {
    expect(calculateExpression("1÷1")).toBe(1);
    expect(calculateExpression("10÷2")).toBe(5);
    expect(calculateExpression("144÷12")).toBe(12);
  });

  it("division by 0 returns 0 and logs exception", () => {
    const errorSpy = jest.spyOn(console, "error");
    expect(calculateExpression("1÷0")).toBe(undefined);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
  it("handles multiple operations", () => {
    expect(calculateExpression("1÷1×2×2+3×22")).toBe(70);
  });

  it("handles trailing operator", () => {
    expect(calculateExpression("1÷1×2×2+3×22+")).toBe(70);
  });

  it("handles empty expression", () => {
    expect(calculateExpression("")).toBe(undefined);
  });

});
describe("keyboard input", () => {
  const buildKeyObject = (key: string) => ({key});
  const five = "5";
  const minus = "-";
  const plus = "+";
  const multiply = "x";
  const divide = "/"
  const three = "3";
  const enter = "Enter";
  const clearWithC = 'c';
  const clearWithEscape = 'Escape';
  const clearWithBackspace = 'Backspace';
  const equals = "="

  it("correctly shows operators", async () => {
    render(<Calculator/>);
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(plus));
    expect(input).toHaveValue(plus);
  });
  it("correctly shows numbers", async () => {
    render(<Calculator/>);
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(three));
    fireEvent.keyDown(input, buildKeyObject(five));
    expect(input).toHaveValue(`${three}${five}`);
  });
  it("correctly adds", async () => {
    render(<Calculator/>);
    const result = "8";
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(five));
    fireEvent.keyDown(input, buildKeyObject(plus));
    fireEvent.keyDown(input, buildKeyObject(three));
    fireEvent.keyDown(input, buildKeyObject(enter));
    expect(input).toHaveValue(result);
  });
  it("correctly subtracts", async () => {
    render(<Calculator/>);
    const result = "2";
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(five));
    fireEvent.keyDown(input, buildKeyObject(minus));
    fireEvent.keyDown(input, buildKeyObject(three));
    fireEvent.keyDown(input, buildKeyObject(enter));
    expect(input).toHaveValue(result);
  });
  it("correctly multiplies", async () => {
    render(<Calculator/>);
    const result = "15";
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(five));
    fireEvent.keyDown(input, buildKeyObject(multiply));
    fireEvent.keyDown(input, buildKeyObject(three));
    fireEvent.keyDown(input, buildKeyObject(enter));
    expect(input).toHaveValue(result);
  });
  it("correctly divides", async () => {
    render(<Calculator/>);
    const result = "1.6666666666666667";
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(five));
    fireEvent.keyDown(input, buildKeyObject(divide));
    fireEvent.keyDown(input, buildKeyObject(three));
    fireEvent.keyDown(input, buildKeyObject(enter));
    expect(input).toHaveValue(result);
  });
  it("correctly operates with equals key", async () => {
    render(<Calculator/>);
    const result = "15";
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(five));
    fireEvent.keyDown(input, buildKeyObject(multiply));
    fireEvent.keyDown(input, buildKeyObject(three));
    fireEvent.keyDown(input, buildKeyObject(equals));
    expect(input).toHaveValue(result);
  });
  it("can clear results with c", async () => {
    render(<Calculator />);
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(five));
    fireEvent.keyDown(input, buildKeyObject(divide));
    fireEvent.keyDown(input, buildKeyObject(three));
    fireEvent.keyDown(input, buildKeyObject(clearWithC));

    const result = await screen.findByPlaceholderText("0");
    expect(
      (result as HTMLElement & {
        value: string;
      }).value
    ).toBe("");
  });
  it("can clear results with escape", async () => {
    render(<Calculator />);
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(five));
    fireEvent.keyDown(input, buildKeyObject(divide));
    fireEvent.keyDown(input, buildKeyObject(three));
    fireEvent.keyDown(input, buildKeyObject(clearWithEscape));

    const result = await screen.findByPlaceholderText("0");
    expect(
      (result as HTMLElement & {
        value: string;
      }).value
    ).toBe("");
  });
  it("can clear results with backspace", async () => {
    render(<Calculator />);
    const input = screen.getByPlaceholderText('0');
    fireEvent.keyDown(input, buildKeyObject(five));
    fireEvent.keyDown(input, buildKeyObject(divide));
    fireEvent.keyDown(input, buildKeyObject(three));
    fireEvent.keyDown(input, buildKeyObject(clearWithBackspace));

    const result = await screen.findByPlaceholderText("0");
    expect(
      (result as HTMLElement & {
        value: string;
      }).value
    ).toBe("");
  });

});