"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // Events state
  const [events, setEvents] = useState(null);
  const [inputDate, setInputDate] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  // Grades state
  const [grades, setGrades] = useState(null);
  const [coursePrefix, setCoursePrefix] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [isClicked2, setIsClicked2] = useState(false);

  // Probability state
  const gradeLabels = [
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "D-",
    "F",
  ];
  const [gradeForProb, setGradeForProb] = useState("A");
  const [probResult, setProbResult] = useState(null);

  // Fetch events
  const fetchEventsForDate = async (date) => {
    try {
      const res = await fetch(`http://localhost:4000/api/events/${date}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setEvents(data);
      setIsClicked(false);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleFetchEvents = () => {
    if (!inputDate) {
      alert("Please enter a valid date.");
      return;
    }
    setIsClicked(true);
    fetchEventsForDate(inputDate);
  };

  // Fetch grades
  const fetchGradesForCourse = async (prefix, number) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/grades/overall?prefix=${encodeURIComponent(
          prefix
        )}&number=${encodeURIComponent(number)}`
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unknown error occurred");
      }
      const data = await res.json();
      setGrades(data);
      setIsClicked2(false);
    } catch (error) {
      console.error("Error fetching grades:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleFetchGrades = () => {
    if (!coursePrefix || !courseNumber) {
      alert("Please enter both a course prefix and course number.");
      return;
    }
    setIsClicked2(true);
    fetchGradesForCourse(coursePrefix, courseNumber);
  };

  // Calculate probability
  const handleCalcProbability = async () => {
    if (!coursePrefix || !courseNumber) {
      alert("Please fetch the grades distribution first.");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:4000/api/grades/probability",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prefix: coursePrefix,
            number: courseNumber,
            grade: gradeForProb,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to calculate probability");
      }
      const json = await res.json();
      setProbResult(json);
    } catch (error) {
      console.error("Error calculating probability:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className={inter.className}>
      <div className="flex flex-col items-center">
        {/* Header */}
        <div className="bg-white backdrop-blur-sm border-2 border-black border-b-4 rounded-xl p-7 m-10 mb-0 shadow-lg w-1/2">
          <div className="flex items-center justify-between">
            <a
              href="https://www.acmutd.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={"/ACM_Education_Logo.svg"}
                alt="ACM Logo"
                className="w-12 h-auto"
              />
            </a>
            <h1 className="text-5xl text-black font-bold text-center">
              API Workshop
            </h1>
            <a
              href="https://api.utdnebula.com/swagger/index.html#/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={"/Swagger_Logo.svg"}
                alt="Swagger Logo"
                className="w-12 h-auto"
              />
            </a>
          </div>
        </div>
        <p className="text-gray-600 text-center mb-4 p-1">
          The public Nebula Labs API for access to pertinent UT Dallas data.
        </p>

        <div className="flex items-center justify-between rounded-xl p-7 m-10 w-screen h-screen overflow-hidden">
          {/* Events Section */}
          <div className="border-4 border-dashed border-black rounded-lg p-6 w-1/2 h-full shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4 w-full">
              <h2 className="text-xl text-black font-bold mr-20">
                /events/{"{date}"}
              </h2>
              <input
                type="text"
                placeholder="Enter date (e.g., 2025-04-16)"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="bg-neutral-100 p-2 border-2 border-neutral-800 border-b-4 text-black rounded mr-3 w-3/6"
              />
              <button
                className={`bg-green-300 text-white font-bold py-2 px-4 w-1/6 rounded border-2 border-neutral-800 ${
                  isClicked ? "border-b-2" : "border-b-4"
                } hover:border-green-950 hover:text-black transition duration-300 ease-in-out`}
                onClick={handleFetchEvents}
              >
                GET
              </button>
            </div>
            <p className="text-gray-700">Events for the selected date:</p>
            <div className="h-1/2 overflow-y-auto">
              {events && events.data && events.data.buildings ? (
                <table className="table-fixed w-full bg-gray-200 rounded mt-4 text-sm text-black">
                  <thead>
                    <tr className="bg-gray-300 border border-b-3">
                      <th className="px-4 py-2 border">Building</th>
                      <th className="px-4 py-2 border">Room</th>
                      <th className="px-4 py-2 border">Start Time</th>
                      <th className="px-4 py-2 border">End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.data.buildings.map((bldg, bi) =>
                      bldg.rooms.map((room, ri) =>
                        room.events.map((evt, ei) => (
                          <tr
                            key={`${bi}-${ri}-${ei}`}
                            className="text-center"
                          >
                            <td className="px-4 py-2 border">
                              {bldg.building}
                            </td>
                            <td className="px-4 py-2 border">{room.room}</td>
                            <td className="px-4 py-2 border">
                              {evt.start_time}
                            </td>
                            <td className="px-4 py-2 border">
                              {evt.end_time}
                            </td>
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
          <div className="border-4 border-dashed border-black rounded-lg shadow-md p-6 w-1/3 h-full">
            <div className="flex items-center justify-center mb-4 w-full">
              <h2 className="text-xl text-black font-bold mr-20">
                /grades/overall
              </h2>
              <input
                type="text"
                placeholder="CS"
                value={coursePrefix}
                onChange={(e) => setCoursePrefix(e.target.value)}
                className="bg-neutral-100 p-2 border-2 border-neutral-800 border-b-4 text-black rounded mr-1 w-1/5"
              />
              <input
                type="text"
                placeholder="1200"
                value={courseNumber}
                onChange={(e) => setCourseNumber(e.target.value)}
                className="bg-neutral-100 p-2 border-2 border-neutral-800 border-b-4 text-black rounded mr-3 w-2/6"
              />
              <button
                className={`bg-green-300 text-white font-bold py-2 px-4 w-1/6 rounded border-2 border-neutral-800 ${
                  isClicked2 ? "border-b-2" : "border-b-4"
                } hover:border-green-950 hover:text-black transition duration-300 ease-in-out`}
                onClick={handleFetchGrades}
              >
                GET
              </button>
            </div>

            <p className="text-gray-700">Grade Distribution for the selected Class:</p>

            {/* Probability Calculator */}
            <div className="mt-6 flex items-center">
              <label className="mr-2 font-medium">Probability of</label>
              <select
                value={gradeForProb}
                onChange={(e) => setGradeForProb(e.target.value)}
                className="border px-2 py-1 mr-2"
              >
                {gradeLabels.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <button
                onClick={handleCalcProbability}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Calculate
              </button>
              {probResult && (
                <p className="ml-4 text-sm text-gray-800">
                  {`Probability of ${probResult.grade} in ${probResult.prefix}${probResult.number}: ${probResult.percentage.toFixed(
                    1
                  )}%`}
                </p>
              )}
            </div>

            <div className="h-1/2 overflow-y-auto">
              {grades && grades.data ? (
                <table className="table-fixed w-full bg-gray-200 rounded mt-4 text-sm text-black">
                  <thead>
                    <tr className="bg-gray-300 border border-b-3">
                      <th className="px-4 py-2 border">Grade</th>
                      <th className="px-4 py-2 border">Grade Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeLabels.map((label, idx) => (
                      <tr key={label}>
                        <td className="px-4 py-2 border">{label}</td>
                        <td className="px-4 py-2 border">
                          {grades.data[idx] || 0}
                        </td>
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
      </div>
    </div>
  );
}
