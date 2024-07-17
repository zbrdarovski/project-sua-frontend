import './StatsBrdarovski.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatsBrdarovski = () => {
    const [lastCalledEndpoint, setLastCalledEndpoint] = useState("");
    const [mostFrequentEndpoint, setMostFrequentEndpoint] = useState("");
    const [callsPerEndpoint, setCallsPerEndpoint] = useState({});

    useEffect(() => {
        fetchLastCalledEndpoint();
        fetchMostFrequentlyCalledEndpoint();
        fetchCallsPerEndpoint();
    }, []);

    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1187' : 'http://statsbrdarovski';

    const fetchLastCalledEndpoint = async () => {
        try {
            const response = await axios.get(`${baseUrl}/StatsBrdarovski/GetLastEndpoint`);
            setLastCalledEndpoint(response.data);
        } catch (error) {
            console.error('Error fetching last called endpoint:', error);
        }
    };

    const fetchMostFrequentlyCalledEndpoint = async () => {
        try {
            const response = await axios.get(`${baseUrl}/StatsBrdarovski/GetMostCalledEndpoint`);
            setMostFrequentEndpoint(response.data);
        } catch (error) {
            console.error('Error fetching most frequently called endpoint:', error);
        }
    };

    const fetchCallsPerEndpoint = async () => {
        try {
            const response = await axios.get(`${baseUrl}/StatsBrdarovski/GetCallsPerEndpoint`);
            setCallsPerEndpoint(response.data);
        } catch (error) {
            console.error('Error fetching calls per endpoint:', error);
        }
    };

    const updateData = async (service) => {
        try {
            await axios.post(`${baseUrl}/StatsBrdarovski/PostUpdate`, { klicanaStoritev: service });
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className="brdarovskistats">
            <p>Last Called Endpoint: {lastCalledEndpoint}</p>
            <p>Most Frequently Called Endpoint: {mostFrequentEndpoint}</p>
            <p>Calls Per Endpoint:</p>
            {Object.entries(callsPerEndpoint).map(([endpoint, count]) => (
                <p key={endpoint}>{endpoint}: {count}</p>
            ))}
            <button onClick={() => {
                fetchLastCalledEndpoint();
                fetchMostFrequentlyCalledEndpoint();
                fetchCallsPerEndpoint();
            }}>Refresh Statistics</button>
            <button onClick={() => updateData("/CommentsRatings/comments")}>Update Data</button>
        </div>
    );
};

export default StatsBrdarovski;
