let googleUserId;
const week = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];
let sunday = getSunday(new Date());
let totalCalories = 0;

window.onload = (event) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('Logged in as: ' + user.displayName);
        googleUserId = user.uid;
        // Load the calendar visuals
        loadFoodSchedule(sunday);

    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};



// Get schedule from the database
const loadFoodSchedule = (week) => {
    const foodRef = firebase.database().ref(`users/${googleUserId}/food-tracker/${week}/`).on('value', (snapshot) => {
        const data = snapshot.val();
        loadCalendar(data);
        countTotalCalories(data);
    });
}

function countTotalCalories(data) {
    for(const value in data) {
        let foodID = data[value];
        for(const element in foodID) {
            totalCalories += foodID[element].calorieCount;
        }
    }
}

function loadCalendar(data,) { 
    document.querySelectorAll('.calendar').forEach((date) =>{
        let dayoftheWeek = date.innerHTML;
        let calendar = '';
            
        let d  = new Date();
        let targetDate = findTargetDate(dayoftheWeek);
        
        for(const days in data)
        {
            // Checks if the day in the database is the same as the day it's looping through
            if(days == targetDate)
            {
                const foodID = data[days];
                for(const k in foodID)
                {
                    const info = foodID[k];
                    calendar += createCalendar(info, k, days);
                    
                }
                let content = document.createElement("content");
                content.innerHTML = calendar;
                date.insertAdjacentElement("afterend", content);
            }
        }              
    });
}

const uploadFood = (week, day) => {
    firebase.database().ref(`users/${googleUserId}/food-tracker/${week}/${day}`).push({
        food : "pizza",
        calorieCount: 1000,
        imageURL: "empty",
    })
}

function getSunday(d) {
    d = new Date(d);
    
    var day = d.getDay(),
        diff = d.getDate() - day;
    let changedDate = new Date(d.setDate(diff));
    
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}); 
     
}

function getCurrentDate() {
    return new Date().toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}); 
}

function unformatDate(formattedDate) {
    let dateArray = formattedDate.split('-');
    let newArray = [];
    for(const number in dateArray) {
        newArray.push(parseInt(dateArray[number],10));
    }
    return new Date(newArray[0],newArray[1] - 1,newArray[2]);
}



function createCalendar(info, id , day) {
    return `
        <figure class="image">
            <img src="${info.imageURL}">
        </figure>
        <p>${info.food}</p>
        <p>${info.calorieCount}</p>
        <button class="button is-small" onclick="editEntry('${id}','${day}')">Edit</button>
    `
}


// Activate edit modal 
function editEntry(id, day) {
    editModalTitle = document.getElementById("modalTitle");
    editModalTitle.value = "That day";
    
    let food = document.getElementById("editFood");
    let calorieCount = document.getElementById("editCalorieCount");
    let imageURL = document.getElementById("editImageURL");
    // Populate the texboxes
    const foodRef = firebase.database().ref(`users/${googleUserId}/food-tracker/${sunday}/${day}/${id}`).on('value', (snapshot) => {
        const data = snapshot.val();

        food.value = data.food;
        calorieCount.value = data.calorieCount;
        imageURL.value = data.imageURL;
    });

    // "Save" id for later
    entryId = document.getElementById("entryID");
    entryId.value = id;
    // Toggle modal to hidden
    editModal = document.getElementById("editModal");
    editModal.classList.toggle("is-active");
    // "Save" target date into a hidden textbox for later
    targetDate = document.getElementById("targetDate");
    targetDate.value = day;
}
// Save edited Entry
function saveEntry() {
    // Get target date from hidden textbox
    let targetDay = document.getElementById("targetDate");
    // Retrieve ID from hidden box
    entryId = document.getElementById("entryID");
    let id = entryId.value;

    let food = document.getElementById("editFood");
    let calorieCount = document.getElementById("editCalorieCount");
    let imageURL = document.getElementById("editImageURL"); 

    firebase.database().ref(`users/${googleUserId}/food-tracker/${sunday}/${targetDay.value}/${id}`).update({
        calorieCount : parseInt(calorieCount.value),
        food : food.value,
        imageURL : imageURL.value
    })

    editModal = document.getElementById("editModal");
    editModal.classList.toggle("is-active");
}
// Delete Entry
function deleteEntry() {
    // Get target date from hidden textbox
    let targetDay = document.getElementById("targetDate");
    // Retrieve ID from hidden box
    entryId = document.getElementById("entryID");
    let id = entryId.value;

    firebase.database().ref(`users/${googleUserId}/food-tracker/${sunday}/${targetDay.value}/${id}`).remove();
    let editEntryModal = document.getElementById("editEntryModal");
    editEntryModal.classList.toggle("is-active");
}
// Close edit modal
function closeEditModal() {
    closeEditModal = document.getElementById("editModal");
    closeEditModal.classList.toggle("is-active");
}
// Activate add modal
function addEntry(day) {
    addModalTitle = document.getElementById("addmodalTitle");
    addModalTitle.innerHTML = day;

    addEntryModal = document.getElementById("addEntryModal");
    addEntryModal.classList.toggle("is-active");
    // "Save" target date into a hidden textbox for later
    targetDate = document.getElementById("targetDate");
    targetDate.value = day;
}
function closeModal() {
    addEntryModal = document.getElementById("addEntryModal");
    addEntryModal.classList.toggle("is-active");
}


function createEntry(data) {
    // Get target date from hidden textbox
    let targetDay = document.getElementById("targetDate");
    let targetDate = findTargetDate(targetDay.value)
    
    // Get data from edamam api
    let food = data.hits[0].recipe.label;
    let calories = data.hits[0].recipe.calories;
    let imageURL = data.hits[0].recipe.image;

    firebase.database().ref(`users/${googleUserId}/food-tracker/${sunday}/${targetDate}`).push({
        calorieCount : Math.round(calories),
        food : food,
        imageURL : imageURL
    })

    addEntryModal = document.getElementById("addEntryModal");
    addEntryModal.classList.toggle("is-active");
}

// Finds date from day of the week
function findTargetDate(day) {
    let dateArray = sunday.split('-');
    let newArray = [];
    let diff;
    for(const number in dateArray) {
        newArray.push(parseInt(dateArray[number],10));
    }
    for(const element in week){
        if(week[element] == day)
        {
            diff = parseInt(element);
        }
    }
    return new Date(newArray[0],newArray[1] - 1,newArray[2] + diff).toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'});
}

// Api
async function sendApiRequest() {
    let searchValue = document.getElementById("searchBox").value;
    let app_id = "5a25d1bf"
    let api_key = "acb0d0b58448bda95778443778a66e62";
    let response = await fetch(`https://api.edamam.com/search?app_id=${app_id}&app_key=${api_key}&q=${searchValue}`);
    let data = await response.json()
    console.log(data)
    
    createEntry(data)
}

let calorieGoal = document.getElementById("calorieGoal");
let progressBar = document.getElementById("calorieProgress");
calorieGoal.addEventListener("change", ()=>{
    let percentage = (totalCalories /calorieGoal.value) * 100;
    progressBar.value = percentage;
});

