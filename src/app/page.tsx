"use client"
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import WatcherForm from './components/WatcherForm';
import { IoTrashBinOutline } from 'react-icons/io5';

export default function Home() {
  const [accountState, setAccountState] = useState({});
  const prevAccountStateRef = useRef({});
  const webSocketRef = useRef<null | WebSocket>(null);

  webSocketRef.current = new WebSocket('ws://localhost:8000');

  useEffect(() => {
    // Initialize WebSocket connection only if it's not already established
    if (!webSocketRef.current) {
      webSocketRef.current = new WebSocket('ws://localhost:8000');

      webSocketRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };

      webSocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'balanceChange') {
          console.log(event.data)
          setAccountState(prevState => ({
            ...prevState,
            [data.data.account]: data.data.newState
          }));
        }
      };

      webSocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      webSocketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }

    return () => {
      // Close the WebSocket only when the component is unmounted
      if (webSocketRef.current) {
        webSocketRef.current.close();
        webSocketRef.current = null;
      }
    };
  }, []); // Empty dependency array to ensure this runs only once

  function fetchAccountState() {
    fetch('http://localhost:8000/account-watcher/')
      .then((response) => response.json())
      .then((data) => {
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

  function handleDelete(address: string) {
    fetch(`http://localhost:8000/account-watcher/remove/${address}`, {
      method: 'DELETE',
    })
      .then(() => {
        console.log(`Deleted account: ${address}`);
        fetchAccountState(); // Refresh account state
        toast(`Removed Account`)
      })
      .catch(error => console.error('Error deleting account:', error));
  }

  return (
    <main className="flex gap-12 flex-col items-center justify-between p-24">
      <Toaster />
      <WatcherForm />
      <h1>Watched Accounts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(accountState).map(([account, data]) => {
          const prevValue = prevAccountStateRef.current[account] || 0;
          const valueChanged = prevValue !== data;

          return (
            <motion.div
              key={account}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }} className="relative  border border-dashed border-2 border-gray-300 shadow-md p-8">
              <button
                className="absolute top-2 right-2 hover:scale-110 transition-transform"
                onClick={() => handleDelete(account)}
              >
                <IoTrashBinOutline className="text-red-600 hover:text-red-800" size="1em" />
              </button>

              <h2 className="font-semibold truncate">{account}</h2>
              <p className="text-lg text-gray-600">
                {valueChanged ? (
                  <motion.span
                    key={data.amount}
                    className='glowing-box'
                  >
                    {data.amount.toFixed(2)}
                  </motion.span>
                ) : (
                  data.amount.toFixed(2)
                )}
              </p>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
