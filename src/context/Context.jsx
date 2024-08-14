import { createContext, useState, useEffect } from "react";
import run from "../config/gemini";

export const Context = createContext();


const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    useEffect(() => {
        // Retrieve data from localStorage when the component mounts
        const storedInput = localStorage.getItem("input");
        const storedRecentPrompt = localStorage.getItem("recentPrompt");
        const storedPrevPrompts = JSON.parse(localStorage.getItem("prevPrompts") || "[]");
        const storedResultData = localStorage.getItem("resultData");

        if (storedInput) setInput(storedInput);
        if (storedRecentPrompt) setRecentPrompt(storedRecentPrompt);
        if (storedPrevPrompts) setPrevPrompts(storedPrevPrompts);
        if (storedResultData) setResultData(storedResultData);
    }, []);

    useEffect(() => {
        // Save data to localStorage whenever it changes
        localStorage.setItem("input", input);
        localStorage.setItem("recentPrompt", recentPrompt);
        localStorage.setItem("prevPrompts", JSON.stringify(prevPrompts));
        localStorage.setItem("resultData", resultData);
    }, [input, recentPrompt, prevPrompts, resultData]);

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData(""); // Clear resultData when starting a new chat
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        try {
            if (prompt !== undefined) {
                response = await run(prompt);
                setRecentPrompt(prompt);
            } else {
                response = await run(input);
                setPrevPrompts(prev => [...prev, input]);
                setRecentPrompt(input);
            }

            // Handle bold text and formatting
            let responseWithBold = response.split("**").map((part, index) => 
                index % 2 === 1 ? `<b>${part}</b>` : part
            ).join("");

            let finalResponse = responseWithBold
                .split("*")
                .map((part, index) => 
                    index % 2 === 0 ? part : `<br/>${part}`
                )
                .join("")
                .split("\n")
                .map((part) => `<p>${part.trim()}</p>`)
                .join("");

            // Append text progressively with delay
            let newResponseArray = finalResponse.split(" ");
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i] + " ";
                delayPara(i, nextWord);
            }

        } catch (error) {
            console.error("Error in run function:", error);
        } finally {
            setLoading(false);
            setInput(""); // Clear input after the process
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
