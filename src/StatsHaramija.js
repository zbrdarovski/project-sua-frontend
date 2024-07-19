import './StatsHaramija.css';
import Dashboard from './Dashboard';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatsHaramija = () => {
    const [lastCalledEndpoint, setLastCalledEndpoint] = useState("");
    const [mostFrequentEndpoint, setMostFrequentEndpoint] = useState("");
    const [callsPerEndpoint, setCallsPerEndpoint] = useState({});

    const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:1188' 
        : 'http://statsharamija';

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                fetchLastCalledEndpoint(),
                fetchMostFrequentlyCalledEndpoint(),
                fetchCallsPerEndpoint()
            ]);
        };

        fetchData();
    }, []);

    const fetchLastCalledEndpoint = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/StatsHaramija/GetLastEndpoint`);
            setLastCalledEndpoint(data);
        } catch (error) {
            console.error('Error fetching last called endpoint:', error);
        }
    };

    const fetchMostFrequentlyCalledEndpoint = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/StatsHaramija/GetMostCalledEndpoint`);
            setMostFrequentEndpoint(data);
        } catch (error) {
            console.error('Error fetching most frequently called endpoint:', error);
        }
    };

    const fetchCallsPerEndpoint = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/StatsHaramija/GetCallsPerEndpoint`);
            setCallsPerEndpoint(data);
        } catch (error) {
            console.error('Error fetching calls per endpoint:', error);
        }
    };

    const updateData = async (service) => {
        try {
            await axios.post(`${baseUrl}/StatsHaramija/PostUpdate`, { klicanaStoritev: service });
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const refreshStatistics = () => {
        fetchLastCalledEndpoint();
        fetchMostFrequentlyCalledEndpoint();
        fetchCallsPerEndpoint();
    };

    return (
        <div className="haramija">
            <Dashboard />
            <p>Last Called Endpoint: {lastCalledEndpoint}</p>
            <p>Most Frequently Called Endpoint: {mostFrequentEndpoint}</p>
            <p>Calls Per Endpoint:</p>
            {Object.entries(callsPerEndpoint).map(([endpoint, count]) => (
                <p key={endpoint}>{endpoint}: {count}</p>
            ))}
            <div className="buttons">
                <button onClick={refreshStatistics}>Refresh Statistics</button>
                <button onClick={() => updateData("/CommentsRatings/comments")}>Update Data</button>
            </div>
        </div>
    );
};

export default StatsHaramija;
