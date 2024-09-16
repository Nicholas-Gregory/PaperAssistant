import { useState, useEffect } from "react";
import { useAuth } from "../contexts/UserContext";
import { apiCall } from "../utils";

export default function useData(endpoint) {
    const { authorize } = useAuth();
    const token = authorize();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();

    useEffect(() => {
        if (token) {
            apiCall('GET', endpoint, null, token)
            .then(response => {
                setLoading(false);

                if (response.error) {
                    setError(response.type);
                    return;
                }

                setError(null);
                setData(response);
            });
        }
    }, [endpoint]);

    return {
        error, loading, data
    }
}