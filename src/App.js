import React from 'react'
import { useState, useEffect } from 'react'
import {tdata2} from './tabledata.js'
import Home from './Home.js'
import Layout from './layout.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Table from './table.js'
import Graph1 from './graph1.js'
import Graph2 from './graph2.js'
import Graph3 from './graph3.js'
import SelectModel from './selectmodel.js'
import Dataload from './dataload.js'
import {io} from 'socket.io-client'
import CncInfo from './cncInfo.js'
import Document from './documents.js'
import { Login,Signup } from './authForm.js'

// const socket = io.connect("https://iotd.onrender.com/");
const socket = io.connect("http://3.7.109.95:5010/");
// const socket = io.connect("http://localhost:5010/");


// const socket = io.connect(window.location.origin);
// console.log(socket)
// const socket = io.connect("http://3.222.121.208:5000/");

//Handle socket connection error

function App() {
  
  // socket.on('timestamp', (data)=> {
    // console.log(socket)
  // })
  const [maindata, setMaindata] = useState(tdata2.map((item,i)=>{
    // let mysr = i+1;
    return {...item, sr:i+1}
  }));
  useEffect(()=>{
    socket.on('deflection_data', (socketdata)=>{
      setMaindata((prevd)=>{
        let arr = prevd.map((item,i)=>{
          if(i===0){
            return {
              id:1,
              temperature1:socketdata.temp1,
              temperature2:socketdata.temp2,
              temperature3:socketdata.temp3,
              deflection:socketdata.deflection,
              MLmodel:socketdata.MLmodel,
              date:socketdata.date,
              time:socketdata.time,
              sr: 1};
          }
          else{
            let ni = prevd[i-1];
            ni.id = i;
            ni.sr = i+1;
            return ni;
          }
        });
        return arr;
      })
    })
  },[]);
  return (
    // <BrowserRouter basename="/client">
    <BrowserRouter basename="/" >
      <Routes>
        {/* <Route path="/" element={<main><Sidebar/><Home/></main>}/> */}
        <Route path="/" element={<Layout connect={socket}/>}>
        {/* <Route path="/" element={<Layout maindata={maindata}/>}> */}
          <Route path="/home" element={<Home/>}/>
          <Route path="/cncinfo" element={<CncInfo/>}/>
          <Route path="/table" element={<Table maindata={maindata}/>}/>
          <Route path="/graph1" element={<Graph1 maindata={maindata}/>}/>
          <Route path="/graph2" element={<Graph2 maindata={maindata}/>}/>
          <Route path="/graph3" element={<Graph3 maindata={maindata}/>}/>
          <Route path="/selectmodel" element={<SelectModel maindata={maindata} socket={socket}/>}/>
          <Route path="/dataload" element={<Dataload maindata={maindata}/>}/>
          <Route path="/documents" element={<Document maindata={maindata}/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export {socket};
export default App


