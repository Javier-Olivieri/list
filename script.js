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


document.addEventListener('DOMContentLoaded', () => {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    document.getElementById('cookie-banner').style.display = 'block';
  } else if (consent === 'accepted') {
    // Activar todos los scripts si se acepta el consentimiento
    activateScripts(true, true);
  }
});

function acceptAll() {
  localStorage.setItem('cookieConsent', 'accepted');
  document.getElementById('cookie-banner').style.display = 'none';
  // Activar todos los scripts
  activateScripts(true, true);
}

function denyAll() {
  localStorage.setItem('cookieConsent', 'denied');
  document.getElementById('cookie-banner').style.display = 'none';
  // Desactivar todos los scripts
  activateScripts(false, false);
}

function showPreferences() {
  document.getElementById('preferences-modal').style.display = 'block';
}

function closePreferences() {
  document.getElementById('preferences-modal').style.display = 'none';
}

function savePreferences() {
  const analytics = document.getElementById('analytics').checked;
  const ads = document.getElementById('ads').checked;
  
  localStorage.setItem('cookiePreferences', JSON.stringify({ analytics, ads }));

  document.getElementById('preferences-modal').style.display = 'none';
  // Activar o desactivar scripts según las preferencias
  activateScripts(analytics, ads);
}

function activateScripts(analytics = false, ads = false) {
  if (analytics) {
    // Cargar Google Analytics
    loadGoogleAnalytics();
  }
  // Aquí puedes agregar lógica para activar Google Ads o otros scripts según las preferencias
}

function loadGoogleAnalytics() {
  // Crear el elemento de script para Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-KMDRNGZ9LR';
  document.head.appendChild(script);
  
  script.onload = () => {
    // Inicializar Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-KMDRNGZ9LR');
  };
}

// Mostrar el banner si aún no se ha establecido el consentimiento
window.addEventListener('load', function() {
  if (!getCookie('consent_status')) {
      document.getElementById('cookie-consent-banner').style.display = 'block';
  }
});

// Función para establecer una cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Función para obtener el valor de una cookie
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Manejo de botones
document.getElementById('accept-all').addEventListener('click', function() {
  setCookie('consent_status', 'accepted', 365);
  document.getElementById('cookie-consent-banner').style.display = 'none';
  // Aquí puedes agregar lógica para activar todas las cookies
  setCookie('ad_storage', 'granted', 365);
  setCookie('ad_user_data', 'granted', 365);
  setCookie('ad_personalization', 'granted', 365);
  setCookie('analytics_storage', 'granted', 365);
  setCookie('functionality_storage', 'granted', 365);
  setCookie('personalization_storage', 'granted', 365);
  setCookie('security_storage', 'granted', 365);
});

document.getElementById('deny-all').addEventListener('click', function() {
  setCookie('consent_status', 'denied', 365);
  document.getElementById('cookie-consent-banner').style.display = 'none';
  // Aquí puedes agregar lógica para desactivar todas las cookies
  setCookie('ad_storage', 'denied', 365);
  setCookie('ad_user_data', 'denied', 365);
  setCookie('ad_personalization', 'denied', 365);
  setCookie('analytics_storage', 'denied', 365);
  setCookie('functionality_storage', 'denied', 365);
  setCookie('personalization_storage', 'denied', 365);
  setCookie('security_storage', 'denied', 365);
});

document.getElementById('choose-preferences').addEventListener('click', function() {
  // Mostrar el modal de resumen
  document.getElementById('consent-summary-modal').style.display = 'block';

  // Actualizar el resumen con el estado actual de consentimiento
  document.getElementById('ad_storage-summary').innerText = getCookie('ad_storage') || 'No configurado';
  document.getElementById('ad_user_data-summary').innerText = getCookie('ad_user_data') || 'No configurado';
  document.getElementById('ad_personalization-summary').innerText = getCookie('ad_personalization') || 'No configurado';
  document.getElementById('analytics_storage-summary').innerText = getCookie('analytics_storage') || 'No configurado';
  document.getElementById('functionality_storage-summary').innerText = getCookie('functionality_storage') || 'No configurado';
  document.getElementById('personalization_storage-summary').innerText = getCookie('personalization_storage') || 'No configurado';
  document.getElementById('security_storage-summary').innerText = getCookie('security_storage') || 'No configurado';
});

document.getElementById('close-summary').addEventListener('click', function() {
  // Ocultar el modal
  document.getElementById('consent-summary-modal').style.display = 'none';
});
