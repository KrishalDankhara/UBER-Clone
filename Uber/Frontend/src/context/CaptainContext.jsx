import React, { createContext, useState, useEffect } from "react";

export const CaptainDataContext = createContext();

export const CaptainDataProvider = ({ children }) => {
    const [ captain, setCaptain ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        // Restore captain from localStorage if available
        const stored = localStorage.getItem("captain");
        if (stored) setCaptain(JSON.parse(stored));
    }, []);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainDataProvider;