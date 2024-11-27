import React, { createContext, useRef, useState } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null); // Reference to the audio element
    const gainNodeRef = useRef(null); // Reference to the GainNode
    const [history, setHistory] = useState([]); // History of audio states
    const [currentIndex, setCurrentIndex] = useState(0); // Current history index
    const [mode, setMode] = useState("");
    const [audioUrl, setAudioUrl] = useState(null);
    const waveformRef = useRef(null); // Reference to waveform container
    const wavesurferRef = useRef(null); // Reference to WaveSurfer instance

    const undo = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    const redo = () => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    }

    // Get currentAudio from history or null if no audio
    const currentAudio =
        history.length > 0 && currentIndex !== -1 ? history[currentIndex] : null;

    // Function to set the initial audio
    const setInitialAudio = (audioFile) => {
        setHistory([audioFile]); // Initialize history with the new audio
        setCurrentIndex(0); // Set currentIndex to 0
    };

    return (
        <AudioContext.Provider
            value={{
                audioRef,
                gainNodeRef,
                currentIndex,
                mode,
                setMode,
                setInitialAudio,
                undo,
                redo,
                currentAudio,
                canUndo: currentIndex > 0,
                canRedo: currentIndex < history.length - 1,
                audioUrl,
                setAudioUrl,
                waveformRef,
                wavesurferRef,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
}
