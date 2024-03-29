import {useState} from "react";

const useStatus = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null); // Use null to represent no error
    const [success, setSuccess] = useState<boolean>(false);

    // Function to start a loading process
    const startLoading = (): void => {
        setLoading(true);
        setError(null);
        setSuccess(false);
    };

    // Function to set an error
    const setErrorState = (error: Error): void => {
        setLoading(false);
        setError(error);
        setSuccess(false);
    };

    // Function to set success
    const setSuccessState = (): void => {
        setLoading(false);
        setError(null);
        setSuccess(true);
    };

    // Reset all states
    const resetStatus = (): void => {
        setLoading(false);
        setError(null);
        setSuccess(false);
    };

    return {
        loading,
        error,
        success,
        startLoading,
        setErrorState,
        setSuccessState,
        resetStatus
    };
};

export default useStatus;
