import React, { useState } from 'react';

const WatcherForm = () => {
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); 
        try {
            const response = await fetch(`http://localhost:8000/account-watcher/add/${address}`, {
                method: 'POST',
            });
            const data = await response.text();
            console.log(data);
            setAddress('');
        } catch (error) {
            console.error('Error:', error);
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 rounded-lg border border-gray-300 shadow-md p-4">
            <div className="text-white">Add a new account to watcher list:</div>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Account Address"
                className="p-2 bg-transparent border border-gray-300 rounded"
                disabled={isLoading} 
            />
            <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isLoading} 
            >
                {isLoading ? 'Adding Address...' : 'Add Account'}
            </button>
        </form>
    );
};

export default WatcherForm;
