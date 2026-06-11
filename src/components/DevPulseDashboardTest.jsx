
import { useState , useEffect} from 'react';

import CountriesPanel from './panels/CountriesPanel';
import OverviewPanel from './panels/OverviewPanel';
import PostsPanel from './panels/PostsPanel';
import ProductivityPanel from './panels/ProductivityPanel';
import TriviaPanel from './panels/TriviaPanel';
import UsersPanel from './panels/UsersPanel';

import {fetchOverviewData} from './DashboardData';


function Nav(){
    return(
        <>
        <div style ={{
            display:'flex',
            justifyContent:'space-between',
            padding:'100px'
        }}>
            <h1>
                DevPulse Dashboard
            </h1>
            <div>
                <button>Refresh</button>
            </div>
        </div>
        </>
    )
}

function GiveMePage(data){
    const returning = (<OverviewPanel data = {data}/>)
    setPage(returning);
}



function GiveMeButtons(setPanel){
    const BUTTONS = [
        "Overview",
        "Users",
        "Posts",
        "Productivity",
        "Trivia",
        "Countries"
    ]

    return(
        <div style ={{
            display:'flex',
            justifyContent: 'space-around'
        }}>
            {
                BUTTONS.map((b, index)=>
                    (
                        <button key = {index} onClick={()=>changePanel(b, setPanel)}>
                            {b}
                        </button>
                    )
                )
            }

        </div>
    )
}

export default function Dashboard(){
    const [panel, setPanel] = useState("Overview");
    const [page, setPage] = useState('')

    const data = async()=>{

        try{
            const data = await fetchOverviewData();
            // console.log(data)
        }
        catch{
            console.log("Not found")
        }
    };
    const c = data();
    console.log(c)
    return(
        <>
            <Nav/>
            <GiveMeButtons setPanel ={setPanel}/>
            <OverviewPanel data= {c} />

        </>
    )

}


// import React, { useState } from "react";

// function App() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         "https://jsonplaceholder.typicode.com/posts/1"
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }

//       const result = await response.json();
//       setData(result);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <button onClick={fetchData}>Get Data</button>

//       {loading && <p>Loading...</p>}

//       {error && <p>Error: {error}</p>}

//       {data && (
//         <div>
//           <h2>{data.title}</h2>
//           <p>{data.body}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;