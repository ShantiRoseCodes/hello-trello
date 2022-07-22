import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { myKey, myToken } from './keys'

function App() {
  const [boards, setBoards] = useState();
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState([]);
  
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
    setBoards(trelloboards);
  }

  function handleClick (event) {
    let trelloId = event.target.id;
    let findBoard = boards.find(b => b.id === trelloId);
    let li = event.target.closest('li');
    
    
    if(findBoard['selected'] === false){
      findBoard['selected'] = true;
      li.classList.add('active');
      countActive();
    } else {
      findBoard['selected'] = false;
      li.classList.remove('active');
      countActive();
    }

    const selectedArr = [...document.querySelectorAll("li.active")].map(
      (li) => li.id
   );
   setSelected(selectedArr);
   console.log(selectedArr);
  }


  function countActive () {
    const active = document.querySelectorAll("li.active");
    setCount(active.length);
  }

  async function handleDelete() {
    for (const boardID of selected) {
       try {
          console.log("Deleting: ", boardID);
          const res = await axios.delete(
             `https://api.trello.com/1/boards/${boardID}?key=${myKey}&token=${myToken}`
          );
          console.log(res.status, "Success");
          getBoards();
       } catch (err) {
          console.log(err);
       }
    }
 }

 //This does not work. Initially, I thought that this would duplicate from the board source
 //We figured out that it duplicated templates and templates do not get deleted. 
 // So the next steps: 
//  Changing the workspace.
//  Customizing the link so we can have all cohorts. 
 
 async function handleCreate(){
  for(let i = 0; i < selected.length; i++){
    try{
      console.log('Creating copy of boardID:', selected[i]);
      const res = await axios.post(
      `https://api.trello.com/1/boards/?name=FS20 Week ${i + 1}&idBoardSource=${selected[i]}&key=${myKey}&token=${myToken}`);
      console.log(res.status, "Success");
      getBoards();
    } catch (err) {
      console.log(err);
    }
  }
 }


  
  return (
    <div>
      <h1> Hello Trello </h1>
      <div id="confirm" className="hide">
         <div id="btnGroup">
            <button id="delete" type="button" onClick = {handleDelete} > DELETE </button>
            <button id="cancel" type="button" >CANCEL</button>
            <button id="create" type="button" onClick = {handleCreate}> CREATE </button>
         </div>
      </div>
      <div id="header">
            <h3 id="headerText">Click boards to select</h3>
            <span id="select">{count} Selected</span>
        </div>
        <ul>
          { 
            boards && boards.map( b => 
              < li  id = {b.id}
                    key = {b.id}
                    onClick = {handleClick}
                    > 
                  { b.name } </li>)
          }
        </ul>
        
        

    </div>    
  )
}

export default App;
