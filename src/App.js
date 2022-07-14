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
    let trelloboards = res.data;
    trelloboards.map(b => b['selected'] = false);
    console.log(trelloboards);
    setBoards(trelloboards);
  }

  function handleClick (event) {
    let trelloId = event.target.id;
    let findBoard = boards.find(b => b.id === trelloId);
    let li = event.target.closest('li');
    
    if(findBoard['selected'] === false){
      findBoard['selected'] = true;
      li.classList.add('active');
    } else {
      findBoard['selected'] = false;
      li.classList.remove('active');
    }

    console.log(findBoard);

  }

  
  return (
    <div>
      <h1> Hello Trello </h1>
        <ul>
          { 
            boards && boards.map( b => 
              < li  id = {b.id}
                    key = {b.id}
                    onClick = {handleClick}
                    > 
                  { b.name } -- {b['selected']}</li>)
          }
        </ul>

    </div>    
  )
}

export default App;
