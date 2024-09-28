import { useState } from "react";

const App = () => {
    const elements = ['ac', "+/-", "%", "÷", 7, 8, 9, "×", 4, 5, 6, "ー", 1, 2, 3, "+", 0, ".", "⌫", "="];
    const [sum, setSum] = useState(0); // ｢=｣を押された時にcalcDataをevalした結果
    const [calcData, setCalcData] = useState<string[]>([]); // 計算をどんどん入れていく/｢=｣を押されたら空に戻る

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="p-6 rounded-xl bg-white shadow-lg">
                <div className="text-right text-3xl font-bold text-gray-800 mr-4">
                    {sum}
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
