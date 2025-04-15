"use client";

import { useState, useEffect } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [overallGrades, setOverallGrades] = useState(null);
  const [events, setEvents] = useState(null);
  const [inputDate, setInputDate] = useState(''); // State to hold the input date
  const [isClicked, setIsClicked] = useState(false); // State to track button click
  
  // Fetch overall grades from the API
  useEffect(() => {
    fetch('http://localhost:4000/api/grades/overall')
      .then((res) => res.json())
      .then((data) => {
        setOverallGrades(data);
      })
      .catch((error) => {
        console.error('Error fetching overall grades:', error);
      });
  }, []);

  // Fetch events from the API
  const fetchEventsForDate = async (date) => {
    try {
      const res = await fetch(`http://localhost:4000/api/events/${date}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      console.log(data);
      console.log(data.data.buildings);
      setEvents(data);
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsClicked(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleFetchEvents = () => {
    if (!inputDate) {
      alert('Please enter a valid date.');
      return;
    }
    setIsClicked(true); // Set the button as clicked
    fetchEventsForDate(inputDate); // Use the user-provided date
    
  };

  // Frontend Design
  return (
    <div className={inter.className}>
    <div className=" flex flex-col items-center ">
      {/* Header */}
      <div className="bg-white backdrop-blur-sm border-2 border-black border-b-4 rounded-xl p-7 m-10 mb-0 shadow-lg w-1/2">
      <div className="flex items-center justify-between">
        <a href="https://www.acmutd.org/" target="_blank" rel="noopener noreferrer">
          <img src={'/ACM_Education_Logo.svg'} alt="ACM Logo" className="w-12 h-auto"/>
        </a>
        <h1 className="text-5xl text-black font-bold text-center">API Workshop</h1>
        <a href="https://api.utdnebula.com/swagger/index.html#/" target="_blank" rel="noopener noreferrer">
          <img src={'/Swagger_Logo.svg'} alt="ACM Logo" className="w-12 h-auto" />
        </a>
        </div>
    </div>
      <p className="text-gray-600 text-center mb-4 p-1">The public Nebula Labs API for access to pertinent UT Dallas data.</p>
      {/* Body */}
      
      <div className=" flex items-center justify-between backdrop-blur-sm rounded-xl p-7 m-10 shadow-lg w-screen h-screen overflow-hidden">
        <div className=" border-4 border-dashed border-black rounded-lg shadow-md p-6 w-1/2 h-full ">
          <div className="flex items-center justify-center mb-4 w-full">
            <h2 className="text-xl text-black font-bold mr-20 ">/events/{"{date}"}</h2>
            <input
              type="text"
              placeholder="Enter date (e.g., 2025-04-16)"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)} // Update state on input change
              className="bg-neutral-100 p-2 border-2 border-neutral-800 border-b-4 text-black rounded mr-3 w-3/6"/>
              <button
              className={`bg-green-300 text-white center font-bold py-2 px-4 w-1/6 rounded border-2 border-neutral-800 ${
                isClicked ? 'border-b-2' : 'border-b-4'
              } hover:border-green-950 hover:text-black transition duration-300 ease-in-out`}
              onClick={handleFetchEvents}
              >
              GET
              </button>
          </div>
          <p className="text-gray-700">Events for the selected date:</p>
          <div className="h-1/2 overflow-y-auto">
          {events && events.data && events.data.buildings ? (
            <table className="table-fixed w-full bg-gray-200 rounded mt-4 text-sm text-black ">
              <thead>
                <tr className="bg-gray-300 border border-b-3">
                  <th className="px-4 py-2 border">Building</th>
                  <th className="px-4 py-2 border">Room</th>
                  <th className="px-4 py-2 border">Start Time</th>
                  <th className="px-4 py-2 border">End Time</th>
                </tr>
              </thead>
              <tbody>
                {events.data.buildings.map((building, buildingIndex) =>
                  building.rooms.map((room, roomIndex) =>
                    room.events.map((event, eventIndex) => (
                      <tr key={`${buildingIndex}-${roomIndex}-${eventIndex}`} className="text-center">
                        <td className="px-4 py-2 border">{building.building}</td>
                        <td className="px-4 py-2 border">{room.room}</td>
                        <td className="px-4 py-2 border">{event.start_time}</td>
                        <td className="px-4 py-2 border">{event.end_time}</td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No data fetched yet.</p>
          )}
          </div>
        </div>
        <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md p-6 w-1/3">
          <h2 className="text-2xl text-black font-bold mb-4">/grades/overall</h2>
          <p className="text-gray-700">This is the content of the second card. Add any relevant information here.</p>
        </div>
      </div>
    </div>
    </div>
  );
}