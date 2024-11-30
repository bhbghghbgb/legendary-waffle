import React, { useState } from "react";

import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

const btnValues = [
    ["C", "+-", "%", "/"],
    [7, 8, 9, "X"],
    [4, 5, 6, "-"],
    [1, 2, 3, "+"],
    [0, ".", "="],
];

const toLocaleString = (num) =>
    String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const math = (a, b, sign) =>
    sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b;

const zeroDivisionError = "Can't divide with 0";

const App = () => {
    let [calc, setCalc] = useState({
        sign: "",
        num: 0,
        res: 0,
    });

    let [currentSign, setCurrentSign] = useState("");

    const numClickHandler = (e) => {
        const value = e.target.innerHTML;

        if (calc.num === 0 && value === "0") {
            return;
        }

        if (lastOperation && lastNum !== null) {
            setCalc({
                ...calc,
                num: value,
                res: 0,
            });
            setLastOperation(null);
            setLastNum(null);
        } else {
            setCalc({
                ...calc,
                num: calc.num === 0 ? value : calc.num + value,
            });
        }
    };
    const comaClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc({
            ...calc,
            num: calc.num.toString().includes(".") ? calc.num : calc.num + value,
        });
    };


    const signClickHandler = (e) => {
        setCalc({
            ...calc,
            sign: e.target.innerHTML,
            res: !calc.num
                ? calc.res
                : !calc.res
                    ? calc.num
                    : toLocaleString(
                        math(
                            Number(removeSpaces(calc.res)),
                            Number(removeSpaces(calc.num)),
                            calc.sign
                        )
                    ),
            num: 0,
        });
    };

    const [lastOperation, setLastOperation] = useState(null);
    const [lastNum, setLastNum] = useState(null);

    const equalsClickHandler = () => {
        let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
        let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

        if (lastOperation && lastNum !== null) {
            num = lastNum;
            calc.sign = lastOperation;
        }

        switch (calc.sign) {
            case "+":
                res += num;
                break;
            case "-":
                res -= num;
                break;
            case "X":
                res *= num;
                break;
            case "/":
                res /= num;
                break;
            default:
                break;
        }

        setCalc({
            ...calc,
            res: res,
            num: 0,
            sign: "",
        });

        setLastOperation(calc.sign);
        setLastNum(num);
    };
    const invertClickHandler = () => {
        setCalc({
            ...calc,
            num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
            res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
            sign: "",
        });
    };

    const percentClickHandler = () => {
        let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
        let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
        setCalc({
            ...calc,
            num: (num /= Math.pow(100, 1)),
            res: (res /= Math.pow(100, 1)),
            sign: "",
        });
    };

    const resetClickHandler = () => {
        setCalc({
            ...calc,
            sign: "",
            num: 0,
            res: 0,
        });
        setCurrentSign("");
    };

    const buttonClickHandler = (e, btn) => {
        if (btn === "C" || calc.res === zeroDivisionError) {
            resetClickHandler();
        } else if (btn === "+-") {
            invertClickHandler();
        } else if (btn === "%") {
            percentClickHandler();
        } else if (btn === "=") {
            equalsClickHandler();
        } else if (btn === "/" || btn === "X" || btn === "-" || btn === "+") {
            signClickHandler(e);
            setCurrentSign(btn); // Cập nhật trạng thái nút phép tính hiện tại
        } else if (btn === ".") {
            comaClickHandler(e);
        } else {
            numClickHandler(e);
        }
    };

    return (
        <Wrapper>
            <Screen value={calc.num ? calc.num : calc.res} />
            <ButtonBox>
                {btnValues.flat().map((btn, i) => {
                    return (
                        <Button
                            key={i}
                            className={`${btn === "=" ? "equals" : ""} ${btn === currentSign ? "highlight" : ""}`}
                            value={btn}
                            onClick={(e) => buttonClickHandler(e, btn)}
                        />
                    );
                })}
            </ButtonBox>
        </Wrapper>
    );
};

export default App;