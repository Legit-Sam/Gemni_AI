import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBase64 } from '../components/helpers/imageHelper';
import './image.css';

const AiwithImage = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const [image, setImage] = useState('');
    const [imageInlineData, setImageInlineData] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [userPrompt, setUserPrompt] = useState(''); // State for user input

    /**
     * Generative AI Call to fetch image insights
     */
    async function aiImageRun() {
        setLoading(true);
        setResponse('');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
            userPrompt, imageInlineData // Using user input here
        ]);
        const response = await result.response;
        const text = await response.text();
        setResponse(text);
        setLoading(false);
    }

    const handleClick = () => {
        if (userPrompt) {
            aiImageRun();
        } else {
            alert("Please enter a prompt before searching.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // getting base64 from file to render in DOM
        getBase64(file)
            .then((result) => {
                setImage(result);
            })
            .catch(e => console.log(e));

        // generating content model for Gemini Google AI
        fileToGenerativePart(file).then((image) => {
            setImageInlineData(image);
        });
    };

    // Converts a File object to a GoogleGenerativeAI.Part object.
    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    }

    return (
        <div className="container">
            <div>
                <div className="choose" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        placeholder="Enter your prompt here..." 
                        value={userPrompt} 
                        onChange={(e) => setUserPrompt(e.target.value)} 
                        style={{ marginBottom: '10px', padding: '8px', width: '100%' }} 
                    />
                    <input type='file' onChange={(e) => handleImageChange(e)} />
                    <button style={{ marginTop: '20px' }} onClick={() => handleClick()}>Search</button>
                </div>
                {image && <img className="upload" src={image} style={{ width: '30%', marginTop: 30 }} />}
            </div>

            {
                loading && !aiResponse ?
                    <p className="loadings">Loading ...</p>
                    :
                    <div style={{ margin: '30px 0' }}>
                        <p className="response">{aiResponse}</p>
                    </div>
            }
        </div>
    );
};

export default AiwithImage;
