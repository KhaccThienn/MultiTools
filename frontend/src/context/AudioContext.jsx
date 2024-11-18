import React, {createContext, useRef, useState} from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({children}) => {
    const audioRef = useRef(null);
    const [history, setHistory] = useState([]); // History of audio states
    const [currentIndex, setCurrentIndex] = useState(0); // Current history index

    return (
        <AudioContext.Provider
        value={{
            audioRef,
            currentIndex,
        }}
        >
            {children}
        </AudioContext.Provider>
    );
}
