let googleUserId;
const week = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];
let sunday = getSunday(new Date());
let totalCalories = 0;

window.onload = (event) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {        
        console.log('Logged in as: ' + user.displayName);
        googleUserId = user.uid;

        firebase.database().ref(`users/${user.uid}/userInfo/`).on('value', (snapshot) => {
            const data = snapshot.val();
            name = data.name;
            profilePic = data.profilePic;
            document.getElementById('nameNav').innerHTML = "<strong>&nbsp" + name + "</strong>";
            document.getElementById('profileNav').src="assets/profilepic/" + profilePic + ".png";
        });

        // Load sunday from the database
        const sundayRef = firebase.database().ref(`users/${googleUserId}/food-tracker/info/selected-week`).on('value', (snapshot) => {
            const data = snapshot.val();
            
            // If there isn't any data set current date's sunday
            if(data == null)
            {
                firebase.database().ref(`users/${googleUserId}/food-tracker/info/selected-week`).set({
                    week: sunday
                })
            }
            else {
                sunday = data.week;
            }
            // Load the calendar visuals
            loadFoodSchedule(sunday);            
        });
        
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

function loadSunday() {
    
    
}

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

function loadCalendar(data) { 
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
        <p class="heading">Food</p>
        <p style="margin-top: -10px;">${info.food}</p>
        <p class="heading">Calories</p>
        <p style="margin-top: -10px;">${info.calorieCount} calories</p>
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
    location.reload();
}
// Delete Entry
function deleteEntry() {
    // Get target date from hidden textbox
    let targetDay = document.getElementById("targetDate");
    // Retrieve ID from hidden box
    entryId = document.getElementById("entryID");
    let id = entryId.value;

    firebase.database().ref(`users/${googleUserId}/food-tracker/${sunday}/${targetDay.value}/${id}`).remove();
    let editEntryModal = document.getElementById("editModal");
    editEntryModal.classList.toggle("is-active");
    location.reload()
}
// Close edit modal
function closeEditModal() {
    closeEditModal = document.getElementById("editModal");
    closeEditModal.classList.toggle("is-active");
}
// Activate add modal
function addEntry(day) {
    addModalTitle = document.getElementById("modalTitle");
    addModalTitle.innerHTML = "Add Entry for " + day;

    addEntryModal = document.getElementById("addEntryModal");
    addEntryModal.classList.toggle("is-active");
    // Populate serving size to default at 1
    let servingSize = document.getElementById("servingSizeBox");
    servingSize.value = 1;
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
    // Get serving size
    let servingSize = document.getElementById("servingSizeBox").value;
    // Get data from edamam api
    let food = data.hints[0].food.label
    let calories = data.hints[0].food.nutrients.ENERC_KCAL;
    let imageURL = data.hints[0].food.image;

    // Adjust calorie count by serving size
    calories *= servingSize; 

    firebase.database().ref(`users/${googleUserId}/food-tracker/${sunday}/${targetDate}`).push({
        calorieCount : Math.round(calories),
        food : food,
        imageURL : imageURL
    })

    closeModal();
    location.reload();
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
    let app_id = "f35a6ea0"
    let api_key = "86aba272e4382c284591d5a8ea5d3f64";
    let response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${api_key}&ingr=${searchValue}`);
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

let chosenDay = document.getElementById("chosenDay");
chosenDay.addEventListener("change", ()=> {
    let chosenDate = chosenDay.value.split("-");
    let newSunday = getSunday(new Date(chosenDate[2], chosenDate[0] - 1, chosenDate[1]));

    firebase.database().ref(`users/${googleUserId}/food-tracker/info/selected-week`).update({
        week: newSunday,
    })
    location.reload();
});
