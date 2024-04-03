import { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";

export default function Home(){
    const editorRef = useRef(null);
    const [awarenessStates, setAwarenessStates] = useState({});

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        // Initialize YJS
        const doc = new Y.Doc();
        // Connect to peers with WebRTC
        const provider = new WebrtcProvider("test-room", doc);
        // Initialize awareness instance
        const awareness = new Awareness(provider.awareness);
        
        // Track changes in awareness state
        awareness.on("change", () => {
            setAwarenessStates(awareness.getStates());
        });

        // Initialize YJS text type
        const type = doc.getText("monaco");
        // Bind YJS to Monaco 
        const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
    }

    return (
        <div>
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                {/* Display user cursors */}
                {Object.keys(awarenessStates).map(userId => (
                    <div key={userId} style={{ color: awarenessStates[userId].color, position: 'absolute', left: `${awarenessStates[userId].cursor.position}px`, top: '0', borderLeft: '2px solid', height: '100%' }}>
                        {awarenessStates[userId].name}
                    </div>
                ))}
            </div>
            <Editor
                height="100vh"
                width="100vw"
                theme="vs-dark"
                onMount={handleEditorDidMount}
            />
        </div>
    );
}
