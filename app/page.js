"use client";
import { useState, useEffect } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [events, setEvents] = useState(null);
  const [grades, setGrades] = useState(null);
  const [inputDate, setInputDate] = useState(''); // State to hold the input date  (e.g., "2025-04-16")
  const [isClicked, setIsClicked] = useState(false); // State to track button click (Events)
  const [isClicked2, setIsClicked2] = useState(false); // State to track button click (Grades)
  const [coursePrefix, setCoursePrefix] = useState(''); // State to hold the course code (e.g., "CS")
  const [courseNumber, setCourseNumber] = useState(''); // State to hold the course number (e.g., "1200")
  const [customInput, setCustomInput] = useState(''); /* These 3 states are for the "Make Your Own Call" section */
  const [customOutput, setCustomOutput] = useState('');
  const [customIsClicked, setCustomIsClicked] = useState(false); 
  const gradeLabels = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];   // used for grades distribution table

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

  const fetchGradesForCourse = async (prefix, number) => {
    try {
      const res = await fetch(`http://localhost:4000/api/grades/overall?prefix=${prefix}&number=${number}`);
      if (!res.ok) {
        const errorData = await res.json(); // Extract the error message from the response
        throw new Error(errorData.error || 'Unknown error occurred');
      }

      const data = await res.json();
      console.log(data.data);
      setGrades(data); // Update the grades state with the fetched data
      setIsClicked2(false);
    } catch (error) {
      console.error('Error fetching grades:', error.message); // Log the error message
      alert(`Error: ${error.message}`); // Optionally, show the error to the user
    }
  };

  const handleFetchGrades = () => {
    if (!coursePrefix || !courseNumber) {
      alert('Please enter both a course prefix and course number.');
      return;
    }
    fetchGradesForCourse(coursePrefix, courseNumber); // Call the API with user-provided parameters
    setIsClicked2(true); // Set the button as clicked
  };

  const handleCustomCall = async () => {
    setCustomIsClicked(true);
    // Example: fetch from Nebula API, or let users modify this logic
    try {
      // Replace with any endpoint or logic
      const res = await fetch(`http://localhost:4000/api/events/${customInput}`);
      const data = await res.json();
      setCustomOutput(JSON.stringify(data, null, 2));
    } catch (error) {
      setCustomOutput(`Error: ${error.message}`);
    }
    setCustomIsClicked(false);
  };

  // ---Frontend Design---
  return (
    <div className={inter.className}>
    <div className=" flex flex-col items-center ">
      {/* Header */}
      <div className="bg-white backdrop-blur-sm border-2 border-black border-b-4 rounded-xl p-7 m-10 mb-0 shadow-lg w-1/2">
      <div className="flex items-center justify-between">
        <a href="https://www.acmutd.co/" target="_blank" rel="noopener noreferrer">
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
      
      <div className=" flex items-center justify-between rounded-xl p-7 m-10  w-screen h-screen overflow-hidden">
        {/* Events Section */}
        <div className=" border-4 border-dashed border-black rounded-lg p-6 w-1/2 h-full shadow-lg backdrop-blur-sm">
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
          {/* Events Table */}
          {events && events.data && events.data.buildings ? (
            <table className="table-fixed w-full bg-neutral-100 rounded mt-4 text-sm text-black ">
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
        {/* Grades Section */}
        <div className=" border-4 border-dashed border-black rounded-lg shadow-md p-6 w-1/3 h-full ">
          <div className="flex items-center justify-center mb-4 w-full">
            <h2 className="text-xl text-black font-bold mr-20 ">/grades/overall</h2>
            <input
              type="text"
              placeholder="CS"
              value={coursePrefix}
              onChange={(e) => setCoursePrefix(e.target.value)} // Update state on input change
              className="bg-neutral-100 p-2 border-2 border-neutral-800 border-b-4 text-black rounded mr-1 w-1/5"/>
              <input
              type="text"
              placeholder="1200"
              value={courseNumber}
              onChange={(e) => setCourseNumber(e.target.value)} // Update state on input change
              className="bg-neutral-100 p-2 border-2 border-neutral-800 border-b-4 text-black rounded mr-3 w-2/6"/>
              <button
              className={`bg-green-300 text-white center font-bold py-2 px-4 w-1/6 rounded border-2 border-neutral-800 ${
                isClicked2 ? 'border-b-2' : 'border-b-4'
              } hover:border-green-950 hover:text-black transition duration-300 ease-in-out`}
              onClick={handleFetchGrades}
              >
              GET
              </button>
          </div>
          <p className="text-gray-700">Grade Distribution for the selected Class:</p>
          <div className="h-1/2 overflow-y-auto">
          {/* Grades Table */}
          {grades && grades.data ? (
            <table className="table-fixed w-full bg-neutral-100 rounded mt-4 text-sm text-black ">
              <thead>
                <tr className="bg-gray-300 border border-b-3">
                  <th className="px-4 py-2 border">Grade</th>
                  <th className="px-4 py-2 border">Grade Distribution</th>
                </tr>
              </thead>
              <tbody>
                {grades && grades.data && gradeLabels.map((label, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{label}</td>
                    <td className="px-4 py-2 border">{grades.data[index] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No data fetched yet.</p>
          )}
          </div>
        </div>
      </div>
      {/* Make Your Own Call */}
      <div className=" flex items-center w-screen overflow-hidden">
      <div className="border-4 border-dashed border-black rounded-lg p-6 w-full h-full shadow-lg backdrop-blur-sm mx-7">
          <div className="flex items-center justify-center mb-4 w-full">
            <h2 className="text-xl text-black font-bold mr-20 ">Tinker Area (Sandbox)</h2>
            <input
              type="text"
              placeholder="Enter any input or endpoint"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="bg-neutral-100 p-2 border-2 border-neutral-800 border-b-4 text-black rounded mr-3 w-3/6"/>
            <button
              className={`bg-green-300 text-white center font-bold py-2 px-4 w-1/6 rounded border-2 border-neutral-800 ${
                customIsClicked ? 'border-b-2' : 'border-b-4'
              } hover:border-green-950 hover:text-black transition duration-300 ease-in-out`}
              onClick={handleCustomCall}
            >
              SEND
            </button>
          </div>
          <p className="text-gray-700">Output:</p>
          <pre className="bg-gray-100 rounded p-4 text-xs overflow-x-auto">{customOutput}</pre>
        </div>
      </div>
    </div>
    </div>
  );
}