// memo.mdを確認 <- to me

import { useState } from "react";

const App = () => {
    const elements = ['ac', "+/-", "%", "÷", 7, 8, 9, "×", 4, 5, 6, "ー", 1, 2, 3, "+", 0, ".", "⌫", "="];
    const [calcData, setCalcData] = useState<(string | number)[]>([0]);
    const [clickCount, setClickCount] = useState<number>(0);

    const handleClick = (clickedElement: string | number) => {
        if (clickCount === 0 && calcData.length === 1 && calcData[0] === 0) {
            if (["ac", "+/-", "%", "÷", "×", 0, "⌫"].includes(clickedElement)) {
                return;
            } else {
                setClickCount(clickCount + 1);
                setCalcData(prev => {
                    const newCalcData = [...prev];
                    if (clickedElement === "ー") {
                        console.log('cccのclickCount', clickCount);
                        newCalcData.push("-");
                    } else {
                        newCalcData.push(clickedElement);
                    }
                    if (typeof(clickedElement) === "number") newCalcData.shift();
                    return newCalcData;
                });
                return;
            }
        }
        
        setClickCount(clickCount + 1);

        if (clickedElement === "ac") {
            setCalcData([0]);
            setClickCount(0);
        } else if (clickedElement === "+/-") {
            for (let i = clickCount - 1; i >= 0; i--) {
                if (typeof(calcData[i]) === "string") {
                    if (calcData[i] === "+") {
                        setCalcData(prev => {
                            const newCalcData = [...prev];
                            newCalcData[i] = "-";
                            return newCalcData;
                        });
                    } else {
                        setCalcData(prev => {
                            const newCalcData = [...prev];
                            newCalcData[i] = "+";
                            return newCalcData;
                        });
                    }
                }
            }
        } else if (clickedElement === "%") {
            if (typeof(calcData[calcData.length - 1]) === "number") {
                setCalcData(prev => {
                    const newCalcData = [...prev];
                    newCalcData.push(clickedElement);
                    return newCalcData;
                });
            }
        } else if (clickedElement === "⌫") {
            if (calcData.length === 1 && calcData[0] === 0) {
                return;
            } else {
                setCalcData(prev => {
                    const newCalcData = [...prev];
                    newCalcData.pop();
                    return newCalcData;
                });
            }
        } else if (clickedElement === "=") {
            // 計算可能な記号に変更
            for (let i = 0; i < calcData.length; i++) {
                switch (calcData[i]) {
                    case "÷":
                        calcData[i] = "/";
                        break;

                    case "×":
                        calcData[i] = "*";
                        break;
                }
            }

            /* これだと毎回calcDataが変わることで%のインデックスも毎回変わっていくので毎回取得しなおす必要がある。 */
            /* まず1%+1%+1%、次に11%+11%+11%, 最後に111%+111%+111%を想定してコードを確認していくか */

            // %があるかチェック
            const percentIndexes = [];
            for (let i = 0; i < calcData.length; i++) {
                if (calcData[i] === "%") {
                    percentIndexes.push(i);
                }
            }

            // [1, "%", "+", 1, "%", "+", 1, "%"]  <- calcData
            // [1, 4, 7]  <- percentIndexes
            // 3  <- percentIndexes.length

            const percentedNumbers: number[] = [];

            // %があった場合
            if (percentIndexes.length !== 0) {
                let toMinus = 0;

                for (let h = 0; h < percentIndexes.length; h++) { // h -> 2
                    let percentIndex = percentIndexes[h]; // percentIndex -> 7
                    percentIndex -= toMinus; // percentIndex -> 5

                    for (let i = percentIndex - 1; i >= 0; i--) {  // i -> 3

                        if (typeof(calcData[i]) !== "string") {
                            if (i === 0) {
                                // [1, "%", "+", 1, "%", "+", 1, "%"]  <- calcData
                                calcData.splice(percentIndex, 1);
                                // [1, "+", 1, "%", "+", 1, "%"]  <- calcData
                                let calcStrings = '';
                                for (let j = 0; j < percentIndex; j++) {
                                    calcStrings += calcData[j];
                                }
                                // calcStrings -> "1"
                                const calcNumbers = Number(calcStrings); // calcNumbers -> 1
                                const percentedNumber = calcNumbers / 100; // percentedNumber -> 0.01
                                percentedNumbers.push(percentedNumber);
                                // calcStrings.length -> 1
                                calcData.splice(0, calcStrings.length, percentedNumber);
                                // [0.01, "+", 1, "%", "+", 1, "%"]  <- calcData

                                toMinus = calcStrings.length; // toMinus -> 1
                            }
                        } else {  // %の前に他の記号もある状態での計算
                            // [0.01, "+", 0.01, "+", 1, "%"]  <- calcData
                            calcData.splice(percentIndex, 1);
                            // [0.01, "+", 0.01, "+", 1]  <- calcData
                            let calcStrings = '';
                            for (let k = i + 1; k < percentIndex; k++) { // i + 1で良さそうだね
                                calcStrings += calcData[k];
                            }
                            // calcStrings -> "1"
                            const calcNumbers = Number(calcStrings); // calcNumbers -> 1
                            const percentedNumber = calcNumbers / 100; // percentedNumber -> 0.01
                            percentedNumbers.push(percentedNumber);
                            // calcStrings.length -> 1
                            calcData.splice(i + 1, calcStrings.length, percentedNumber);  // i + 1で良さそうだね
                            // [0.01, "+", 0.01, "+", 0.01]  <- calcData

                            toMinus += calcStrings.length; // toMinus -> 3
                            break;
                        }

                    }
                    
                }

                let resultStrings = '';
                for (const element of calcData) {
                    resultStrings += element;
                }

                // 浮動小数点数への対処
                let maxDigits = 0;
                for (const percentedNumber of percentedNumbers) {
                    if (maxDigits < percentedNumber.toString().length - 2) {
                        maxDigits = percentedNumber.toString().length - 2;
                    }
                }
                resultStrings = eval(resultStrings).toFixed(maxDigits);
                const result = Number(resultStrings);
                setCalcData([result]);

            } else {  // %が無い場合。普通に計算するだけ
                let calcStrings = '';
                for (const element of calcData) {
                    calcStrings += element;
                }

                // 浮動小数点数への対処
                let maxDigits = 0;
                for (let i = 0; i < calcData.length; i++) {
                    if (calcData[i] === ".") {
                        for (let j = i + 1; j < calcData.length; j++) {
                            if (typeof(calcData[j]) === "string") {
                                const digits = j - i - 1;
                                if (maxDigits < digits) {
                                    maxDigits = digits;
                                }
                                break;
                            } else if (j === calcData.length - 1) {
                                const digits = j - i;
                                if (maxDigits < digits) {
                                    maxDigits = digits;
                                }
                                break;
                            }
                        }
                    }
                }

                const resultStrings = eval(calcStrings).toFixed(maxDigits);
                const result = Number(resultStrings);
                setCalcData([result]);
            }
        } else {
            if (clickedElement === ".") {  // . が押された時に
                if (calcData[calcData.length - 1] === ".") {  // 直前が%だったら(その%は末尾確定) 押せないようにする
                    return;
                }

                if (calcData[calcData.length - 1] === "%") {  // 直前が%だったら(その%は末尾確定) 0. のみにする
                    setCalcData(["0."]);
                    return;
                }

                if (typeof(calcData[clickCount - 1]) === "string") {  // 直前が記号(%以外)だったらその位置だけ 0. にする
                    setCalcData(prev => {
                        const newCalcData = [...prev];
                        newCalcData.push(0);
                        newCalcData.push(".");
                        return newCalcData;
                    });
                    return;
                }
            }

            if (typeof(clickedElement) === "string") {  // 記号を連続で打てないようにする
                if (typeof(calcData[clickCount - 1]) === "string" || typeof(calcData[1]) === "string") {
                    console.log('aのcalcData[clickCount - 1]は->', calcData[clickCount - 1]);
                    console.log('aのclickCount->', clickCount);
                    setClickCount(prev => prev - 1);
                    return;
                }
            }

            if (clickedElement === "ー") {  // ー をそのまま表示させるとでかくて違和感あるので - と表示する
                console.log('bのcalcData[clickCount - 1]は->', calcData[clickCount - 1]);
                console.log('bのclickCount->', clickCount);
                setCalcData(prev => {
                    const newCalcData = [...prev];
                    newCalcData.push("-");
                    return newCalcData;
                });
                return;
            }

            // 数字が押された時に直前が%だったら押された数字のみに戻す
            if (typeof(clickedElement) === "number" && calcData[calcData.length - 1] === "%") {
                setCalcData([clickedElement]);
                setClickCount(1);
                return;
            }

            // ただ末尾に追加
            setCalcData(prev => {
                const newCalcData = [...prev];
                newCalcData.push(clickedElement);
                return newCalcData;
            });
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="p-6 rounded-xl bg-white shadow-lg">
                <div className="text-right text-3xl font-bold text-gray-800 mr-4">
                    {calcData}
                    <span className="ml-1 mr-2 text-gray-800 animate-blink">|</span>
                </div>

                <div className="grid grid-cols-4 gap-1 p-6 rounded-xl">
                    {elements.map((element, index) => (
                        <button
                            key={index}
                            className={
                                element === '='
                                    ? "p-4 border border-slate-950 rounded-xl bg-orange-500 text-white hover:bg-orange-400"
                                    : "p-4 border border-slate-950 rounded-xl bg-gray-700 text-white hover:bg-slate-600"
                            }
                            onClick={() => handleClick(element)}
                        >
                            {element}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )   
}

export default App;
