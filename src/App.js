import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { myKey, myToken } from './keys'

let INIT_FORM = {
  cohort: '',
  color: ''
}

function App() {
  const [boards, setBoards] = useState();
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [board, setBoard] = useState(INIT_FORM);
  
  
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

  function handleReset () {
    setSelected([]);
    setCount(0);
    [...document.querySelectorAll("li.active")].map((li) => li.classList.remove('active'))
    console.log(selected); 
    setShowForm(false);
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
          handleReset();
       } catch (err) {
          console.log(err);
       }
    }
 }

 function showTheForm () {
  setShowForm(true);
 }


function handleChange (e) {
  const {name, value} = e.target;
  setBoard({...board, [name]: value});
  console.log(board);
}

function handleSubmit (e) {
  e.preventDefault();
  console.log(board);
  createTrello(board);
  setBoard(INIT_FORM);
}


// figure out endpoint for changing the workspace
// figure out endpoint for changing the color
async function createTrello(){
  for(let i = 0; i < selected.length; i++){
    try{
      let url = `https://api.trello.com/1/boards/?name=${board.cohort} - Week ${i + 1}&idBoardSource=${selected[i]}&idOrganization=codeopteam&prefs_background=${board.color}&prefs_permissionLevel=public&key=${myKey}&token=${myToken}`;
      console.log(url);
      console.log('Creating copy of boardID:', selected[i]);
      const res = await axios.post(url);
      console.log(res.status, "Success");
      getBoards();
      handleReset(); 
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
            <button id="cancel" type="button" onClick = {handleReset}>CANCEL</button>
            <button id="create" type="button" onClick = {showTheForm}> CREATE </button>
         </div>
         {showForm && 
         <form onSubmit = {handleSubmit}>
         <label> Enter cohort name.
           <input type = "text" name = "cohort" value = {board.cohort}  onChange = {handleChange}/>
         </label> 
         <label> Choose a color.
          <select name = "color" value = {board.color}  onChange = {handleChange}>
            <option value = "red"> Red </option>
            <option value = "blue"> Blue </option>
            <option value = "orange"> Orange </option>
            <option value = "green"> Green </option>
            <option value = "purple"> Purple </option>
            <option value = "pink"> Pink </option>
            <option value = "lime"> Lime </option>
            <option value = "sky"> Sky </option>
            <option value = "grey"> Grey </option>
          </select>
         </label>
         <button id = "submitButton" type = "submit">Create Trello Boards</button>
        </form>
        }
        <br/>
        <br/>
      </div>
      <div id="header">
            <h3 id="headerText">Click boards to select</h3>
            <span id="select">{count} Selected</span>
        </div>
        <br/>
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
