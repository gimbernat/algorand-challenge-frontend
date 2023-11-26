"use client"
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [accountState, setAccountState] = useState({});
  const prevAccountStateRef = useRef({}); // Ref to store previous state

  function fetchAccountState() {
    fetch('http://localhost:8000/account-watcher/') //TODO: CHANGE TO ENV VARIABLE 
      .then((response) => response.json())
      .then((data) => {
        console.log('Account state:', data);

        // Check for changes and show toast if there's any change
        Object.entries(data).forEach(([title, balance]) => {
          const prevBalance = prevAccountStateRef.current[title];
          if (prevBalance !== undefined && prevBalance !== balance) {
            toast(`${title} balance updated: ${prevBalance.toFixed(2)} → ${balance.toFixed(2)}`, {
              duration: 4000,
              position: "top-right",
            });
          }
        });

        // Store the previous state
        prevAccountStateRef.current = accountState;
        setAccountState(data);
      })
      .catch((error) =>
        console.error('Error fetching account state:', error)
      );
  }

  // Poll the server every 60 seconds
  useEffect(() => {
    fetchAccountState();
    const interval = setInterval(fetchAccountState, 60000); // Corrected to 60 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Toaster />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(accountState).map(([title, balance]) => {
          // Compare the new value with the previous value
          const prevValue = prevAccountStateRef.current[title] || 0;
          const valueChanged = prevValue !== balance;

          return (
            <motion.div
              key={title} // Changed to title for unique key
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border border-gray-300 shadow-md p-4"
            >
              <h2 className="font-semibold truncate">{title}</h2>
              <p className="text-lg text-gray-600">
                {valueChanged ? (
                  <motion.span
                    key={balance}
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
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
