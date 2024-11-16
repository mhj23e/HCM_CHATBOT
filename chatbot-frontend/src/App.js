import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Chatbot from './components/Chatbot';

function App() {
    const [isChatActive, setIsChatActive] = useState(false);

    const handleUploadSuccess = () => {
        setIsChatActive(true);
    };

    return (
        <div className="App">
            <h1>401K Chatbot</h1>
            {!isChatActive && <p>Please upload a document to start the chatbot.</p>}
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <Chatbot isActive={isChatActive} />
        </div>
    );
}

export default App;
