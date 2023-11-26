import React, { useState } from 'react';

const WatcherForm = () => {
    const [address, setAddress] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/addAccount/${address}`, {
                method: 'POST',
            });
            const data = await response.text();
            console.log(data);
            setAddress(''); 
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 rounded-lg border border-gray-300 shadow-md p-4">
            <div className="tesxt-white">Add a new account to watcher list:</div>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Account Address"
                className="p-2 border border-gray-300 rounded"
            />
            <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add Account
            </button>
        </form>
    );
};

export default WatcherForm;
