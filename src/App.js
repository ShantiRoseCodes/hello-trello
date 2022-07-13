import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { myKey, myToken } from './keys'; 
import './App.css';

function App() {
  const [boards, setBoards] = useState();

  useEffect(
    () => {
      getBoards();
    }, []
  );

  async function getBoards() {
    const res = await axios.get(
       `https://api.trello.com/1/members/me/boards?fields=name,id,starred&key=${myKey}&token=${myToken}`
    );
    console.log(res.data);
    setBoards(res.data);
  }
  
  return (
    <div>
      <h1> Hello Trello </h1>
        <ul>
          {
            boards && boards.map( b => 
              <li id = {b.id}> { b.name } </li>)
          }
        </ul>

    </div>    
  )
}

export default App;
