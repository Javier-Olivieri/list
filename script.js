(() => { 
    // Initialize state variables and action history from localStorage if available
    let toDoListArray = JSON.parse(localStorage.getItem('toDoListArray')) || [];
    let actionHistory = JSON.parse(localStorage.getItem('actionHistory')) || [];

    // ui variables
    const form = document.querySelector(".form"); 
    const input = form.querySelector(".form__input");
    const ul = document.querySelector(".toDoList"); 
  
    // Load initial items from localStorage
    toDoListArray.forEach(item => {
      addItemToDOM(item.itemId, item.toDoItem, item.timestamp);
    });

    // event listeners
    form.addEventListener('submit', e => {
      // prevent default behaviour - Page reload
      e.preventDefault();
      // give item a unique ID
      let itemId = String(Date.now());
      // get/assign input value
      let toDoItem = input.value;
      // get current timestamp
      let timestamp = new Date().toLocaleString();
      // pass ID, item, and timestamp into functions
      addItemToDOM(itemId, toDoItem, timestamp);
      addItemToArray(itemId, toDoItem, timestamp);
      addActionToHistory('add', itemId, timestamp);
      // clear the input box. (this is default behaviour but we got rid of that)
      input.value = '';
      // Update localStorage with new data
      updateLocalStorage();
    });
    
    ul.addEventListener('click', e => {
      let id = e.target.getAttribute('data-id')
      if (!id) return // user clicked in something else      
      // pass id through to functions
      removeItemFromDOM(id);
      removeItemFromArray(id);
      addActionToHistory('remove', id);
      // Update localStorage with new data
      updateLocalStorage();
    });

    // functions
    function addActionToHistory(actionType, itemId, timestamp) {
      actionHistory.push({ actionType, itemId, timestamp });
      console.log(actionHistory);
    }

    function addItemToDOM(itemId, toDoItem, timestamp) {    
      // create an li
      const li = document.createElement('li')
      li.setAttribute("data-id", itemId);
      // add toDoItem text to li
      li.innerText = `${toDoItem} - Creado el ${timestamp}`;
      // add li to the DOM
      ul.appendChild(li);
    }
    
    function addItemToArray(itemId, toDoItem, timestamp) {
      // add item to array as an object with an ID so we can find and delete it later
      toDoListArray.push({ itemId, toDoItem, timestamp });
      console.log(toDoListArray)
    }
    
    function removeItemFromDOM(id) {
      // get the list item by data ID
      var li = document.querySelector('[data-id="' + id + '"]');
      // remove list item
      ul.removeChild(li);
    }
    
    function removeItemFromArray(id) {
      // create a new toDoListArray with all li's that don't match the ID
      toDoListArray = toDoListArray.filter(item => item.itemId !== id);
      console.log(toDoListArray);
    }

    function updateLocalStorage() {
      localStorage.setItem('toDoListArray', JSON.stringify(toDoListArray));
      localStorage.setItem('actionHistory', JSON.stringify(actionHistory));
    }




})();


