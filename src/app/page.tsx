"use client"
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import WatcherForm from './components/WatcherForm';
import { IoTrashBinOutline } from 'react-icons/io5'; // Import the icon for the delete button

export default function Home() {
  const [accountState, setAccountState] = useState({});
  const prevAccountStateRef = useRef({}); // Ref to store previous state

  function fetchAccountState() {
    fetch('http://localhost:8000/account-watcher/')
      .then((response) => response.json())
      .then((data) => {
        console.log('Account state:', data);
        prevAccountStateRef.current = accountState;
        setAccountState(data);
      })
      .catch((error) =>
        console.error('Error fetching account state:', error)
      );
  }

  useEffect(() => {
    fetchAccountState();
    const interval = setInterval(fetchAccountState, 6000);

    return () => clearInterval(interval);
  }, []);

  function handleDelete(address:string) {
    fetch(`http://localhost:8000/account-watcher/remove/${address}`, {
      method: 'DELETE',
    })
      .then(() => {
        console.log(`Deleted account: ${address}`);
        fetchAccountState(); // Refresh account state
      })
      .catch(error => console.error('Error deleting account:', error));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Toaster />
      <WatcherForm />
      <h1>Watched Accounts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(accountState).map(([title, balance]) => {
          const prevValue = prevAccountStateRef.current[title] || 0;
          const valueChanged = prevValue !== balance;

          return (
            <motion.div key={title} className="relative rounded-lg border border-gray-300 shadow-md p-8">
              <button
                className="absolute top-2 right-2 hover:scale-110 transition-transform"
                onClick={() => handleDelete(title)}
              >
                <IoTrashBinOutline className="text-red-600 hover:text-red-800" size="1.5em" />
              </button>

              <h2 className="font-semibold truncate">{title}</h2>
              <p className="text-lg text-gray-600">
                {valueChanged ? (
                  <motion.span
                    key={balance}
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    {balance.toFixed(2)}
                  </motion.span>
                ) : (
                  balance.toFixed(2)
                )}
              </p>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
