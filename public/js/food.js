let googleUserId;
const week = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];


window.onload = (event) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('Logged in as: ' + user.displayName);
        googleUserId = user.uid;
        // Get start of the week and current date
        let sunday = getSunday(new Date());
        let day = getCurrentDate();
        // Load the calendar visuals
        loadFoodSchedule(sunday);

        //uploadFood(sunday, day);

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
    });
}

function loadCalendar(data,) { 
    let calendar = '';
    
    
    document.querySelectorAll('.calendar').forEach((date) =>{
        let dayoftheWeek = date.innerHTML;
        for(element in week){
            if(dayoftheWeek == week[element])
            {
                let d  = new Date();
                console.log(d.getDay());
                console.log((element));
                if(d.getDay() == element)
                {
                    for(const days in data)
                {
                    const foodID = data[days];
                    for(const k in foodID)
                    {
                        const info = foodID[k];
                        calendar += createCalendar(info);
                        
                    }
                }
                    let content = document.createElement("content");
                    content.innerHTML = calendar;

                    date.insertAdjacentElement("afterend", content);
                }
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



function createCalendar(info) {
    return `
        <p>${info.food}</p>
        <p>${info.calorieCount}</p>
        <p>${info.imageURL}</p>
        <button class="button is-small">Edit</button>
    `
}

function closeDayModal() {
    closeDayModal = document.getElementById("editDayModal");
    closeDayModal.classList.toggle("is-active");
}



// Activate edit modal 
function editDay(tile) {
    editModalTitle = document.getElementById("modalTitle");
    editModalTitle.value = "That day";
    editDayModal = document.getElementById("editDayModal");
    editDayModal.classList.toggle("is-active");
}

// Activate add modal
function addEntry(day) {
    addModalTitle = document.getElementById("addmodalTitle");
    addModalTitle.value = day;

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
function createEntry() {
    let sunday = getSunday(new Date());
    // Get target date from hidden textbox
    let targetDay = document.getElementById("targetDate");
    let targetDate = findTargetDate(targetDay.value, sunday)

    let food = document.getElementById("addFood");
    let calorieCount = document.getElementById("addCalorieCount");
    let imageURL = document.getElementById("addImageURL");

    firebase.database().ref(`users/${googleUserId}/food-tracker/${sunday}/${targetDate}`).push({
        calorieCount : calorieCount.value,
        food : food.value,
        imageURL : imageURL.value
    })
    console.log(food.value, calorieCount.value, imageURL.value);
}
function findTargetDate(day, sunday) {
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