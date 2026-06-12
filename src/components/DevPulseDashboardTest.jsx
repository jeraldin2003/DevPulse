import { useState , useEffect} from 'react';
import CountriesPanel from './panels/CountriesPanel';
import OverviewPanel from './panels/OverviewPanel';
import PostsPanel from './panels/PostsPanel';
import ProductivityPanel from './panels/ProductivityPanel';
import TriviaPanel from './panels/TriviaPanel';
import UsersPanel from './panels/UsersPanel';
import {fetchOverviewData , fetchCountriesData, fetchPostsData, fetchUsersData, fetchTriviaData, fetchProductivityData} from './DashboardData';
import LoadingSpinner from './shared/LoadingSpinner'
function Nav({setReload, setLoadingStatus, setIsAuthenticated}){
    return(
        <>
        <div style ={{
            display:'flex',
            justifyContent:'space-between',
            paddingBottom:'50px',
            paddingTop:'50px'
        }}>
            <h1>
                DevPulse Dashboard
            </h1>
            <div>
                <button onClick = {
                    ()=>{
                        setLoadingStatus(true);
                        setReload(prev => prev + 1)
                        
                    }
                }
                style={{
                    padding: '8px 16px',
                    border: '1px solid #4a90e2',
                    borderRadius: '6px',
                    backgroundColor: '#5aa9e6',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                }}
                    >Refresh</button>
                <button onClick = {
                    ()=>{
                        setIsAuthenticated("login")
                        console.log("hey")
                    }
                }
                style={{
                    padding: '8px 16px',
                    border: '1px solid #4a90e2',
                    borderRadius: '6px',
                    backgroundColor: '#5aa9e6',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                }}
                    >Logout</button>
            </div>
        </div>
        </>
    )
}
function GiveMeButtons({setReload, activePanel, setActivePanel, setLoadingStatus}){
    const BUTTONS = [
        "Overview",
        "Users",
        "Posts",
        "Productivity",
        "Trivia",
        "Countries"
    ]
    return (
        <div
            style={{
                display: 'flex',
                paddingBottom:'50px'
            }}
        >
            {BUTTONS.map((button, index) => (
                <button
                    key={index}
                    onClick={() => {
                        setLoadingStatus(true);
                        if (activePanel === button){
                            setReload(prev => prev + 1)
                        }else{
                            setActivePanel(button);
                        }           
                    }}
                    style={{
                        padding: '8px 16px',
                        margin:'2px',
                        border: '1px solid #4a90e2',
                        borderRadius: '6px',
                        backgroundColor: '#5aa9e6',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}
                >
                    {button}
                </button>
            ))}
        </div>
    );
}
export default function Dashboard({setIsAuthenticated}){
    const [activePanel, setActivePanel] = useState("Overview");
    const [activePanelData, setActivePanelData] = useState("Loading....")
    const [loadingStatus, setLoadingStatus] = useState(true)
    const [reload, setReload] = useState(0)
    useEffect(()=>{
        async function getsPanelData(){
            let panelData = null;
            switch(activePanel){
                case "Overview":
                    panelData = await fetchOverviewData();
                    console.log(panelData)
                    setLoadingStatus(false)
                    break;
                case "Users":
                    panelData = await fetchUsersData();
                    setLoadingStatus(false)
                    break;
                case "Posts":
                    panelData = await fetchPostsData();
                    setLoadingStatus(false)
                    break;
                case "Productivity":
                    panelData = await fetchProductivityData();
                    setLoadingStatus(false)
                    break;
                case "Trivia":
                    panelData = await fetchTriviaData();
                    setLoadingStatus(false)
                    break;
                case "Countries":
                    panelData = await fetchCountriesData();
                    setLoadingStatus(false)
                    break;
            }
            setActivePanelData(panelData.data);
        }
        getsPanelData();
    }, [activePanel, reload])
    return (        
        <div className='dashboard'>
            {loadingStatus === false && (
                <>
                    <Nav setIsAuthenticated = {setIsAuthenticated} setReload ={setReload} setLoadingStatus = {setLoadingStatus} />
                    <GiveMeButtons setReload = {setReload} activePanel = {activePanel} setActivePanel = {setActivePanel} setLoadingStatus = {setLoadingStatus}/>
                    {activePanel === "Overview" && (<OverviewPanel data ={activePanelData}/>)}
                    {activePanel === "Posts" && (<PostsPanel data = {activePanelData}/>)}
                    {activePanel === "Users" && (<UsersPanel data ={activePanelData}/>)}
                    {activePanel === "Productivity" && (<ProductivityPanel data = {activePanelData}/>)}
                    {activePanel === "Trivia" && (<TriviaPanel data ={activePanelData}/>)}
                    {activePanel === "Countries" && (<CountriesPanel data = {activePanelData}/>)}
                </>)
            }
            {loadingStatus === true && (
                <>
                    <LoadingSpinner/>
                </>
            )
            }
        </div>
    )
}