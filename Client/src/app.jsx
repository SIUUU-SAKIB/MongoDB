import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import Loading from "./Loading";
import Cards from "./Cards";
const fetchedData = async () => {
  const url = await axios.get(`${import.meta.env.VITE_URL}/todo`);

  return url;
};
fetchedData();
const App = () => {
  const [inputVal, setInputVal] = useState(null);
  const button = () => {
    axios.post(`${import.meta.env.VITE_URL}/todo-post`, { inputVal });
  };
  const { data, isLoading, error } = useQuery({
    queryKey: [`todos`],
    queryFn: fetchedData,
  });
  if (isLoading) return <Loading />;
  if (error) return <Error />;
console.log()
  return (
    <div className="w-screen h-screen bg-fuchsia-400 mx-auto">
      <p className="text-center py-8 text-6xl font-bold flex flex-col gap-12 ">
        ToDo Application
      </p>
      <div className="flex max-w-lg bg-gray-200 justify-center mx-auto h-[50px]">
        <input
          onChange={(e) => setInputVal(e.target.value.trim())}
          type="text"
          placeholder="Type your todo"
          className="w-[80%] px-4 font-lg text-xl font-semibold focus:outline-none focus:border-none focus:bg-white"
        />
        <button
          onClick={button}
          className="h-[50px] w-[20%] bg-gray-500 text-white font-bold text-xl hover:bg-gray-600 cursor-pointer"
        >
          Add
        </button>
      </div>

      <Cards data={data} />
    </div>
  );
};

export default App;
