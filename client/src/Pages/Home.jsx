import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateJourney from "../Components/forms/CreateJourney";
import { deleteJourney, getAllJourneys } from "../Api/journeys";
import { notesLogo } from "../Constants";

const Home = () => {

  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);

  const deleteOneJourney = async (jid) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this journey?");
  
    if (isConfirmed) {
      try {
        await deleteJourney(jid);
        console.log("Journey deleted successfully.");
        fetchData()
      } catch (error) {
        console.error("Error deleting journey:", error);
      }
    } else {
      console.log("Deletion canceled.");
    }
  };

  const fetchData = async () => {
    const journeys = await getAllJourneys();
    if (journeys) {
      setData(journeys);
      console.log(journeys);  
    }
  };
  

  useEffect(() => {
    fetchData(); 
  }, [open,setOpen]); 

  return (
    <>
      <section className=" min-h-[90vh] bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased ">
        <h1 className="py-10 mx-auto max-w-screen-xl text-white font-bold text-2xl ">
          Your Journeys
        </h1>
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label for="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewbox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search Your Journey"
                      required=""
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  id="createProductModalButton"
                  data-modal-target="createProductModal"
                  data-modal-toggle="createProductModal"
                  className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >
                  <span className="font-bold text-2xl pb-1 mx-2"> +</span>{" "}
                  Create New Journey
                </button>

                <CreateJourney open={open} setOpen={setOpen} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                   
                    <th scope="col" className="px-4 py-3">
                      Journey Name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Visibility
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Notes
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data &&
                    data.map((d, i) => (
                      <tr className="border-b dark:border-gray-700" key={d.id}>
                       
                        <td className="px-4 py-3">
                        <Link className=" cursor-pointer hover:underline hover:text-white" to={`/journey/${d.id}`}>
                          {d.title ? d.title : "Untitled"}
                        </Link>
                        </td>
                        <td className="px-4 py-3 max-w-[12rem] truncate">
                          {d.description
                            ? d.description
                            : "No description available"}
                        </td>
                        <td className="px-4 py-3">{d.is_public?'public':'private'}</td>
                        <td className="px-4 py-3">
                          <Link to={`/notes/${d.id}`}>
                          <img src={notesLogo} width={'30px'} className=" cursor-pointer " alt="" />
                          </Link>
                          </td>
                        <td className="px-4 py-3 flex items-center justify-end">
                          <button
                            className="inline-flex items-center text-sm font-medium hover:bg-red-500 dark:hover:bg-red-700 p-1.5 text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                            type="button"
                            onClick={()=>deleteOneJourney(d.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                 
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

     
    </>
  );
};

export default Home;
