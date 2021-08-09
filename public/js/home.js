let googleUser;
let name;
let profilePic;

let exerciseNum = 1;
let workouts = [];

let calorieCount = 0;
let milesCount = 0;
let timeCount = 0;

let selectedWeek = "2021-08-08"

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;

    const exercisesRef = firebase.database().ref(`users/${googleUser.uid}/workout`);
    exercisesRef.on('value', (snapshot) => {
        if(snapshot.exists()) {
            document.getElementById('workoutCardColumns').style.display = 'flex';
            document.getElementById('noWorkoutDiv').style.display = 'none';
        }else {
            document.getElementById('workoutCardColumns').style.display = 'none';
            document.getElementById('noWorkoutDiv').style.display = 'block';
        }
    });

    const exerciseRef = firebase.database().ref(`users/${googleUser.uid}/exercise`);
    exerciseRef.on('value', (snapshot) => {
        if(snapshot.exists()) {
            document.getElementById('cardColumns').style.display = 'flex';
            document.getElementById('noExerciseDiv').style.display = 'none';
        }else {
            document.getElementById('cardColumns').style.display = 'none';
            document.getElementById('noExerciseDiv').style.display = 'block';
        }
    });

    firebase.database().ref(`users/${googleUser.uid}/food-tracker/info/selected-week`).on('value', (snapshot) => {
        selectedWeek = snapshot.val().week;
    });

    const foodsRef = firebase.database().ref(`users/${googleUser.uid}/food-tracker/${selectedWeek}`);
    foodsRef.on('value', (snapshot) => {
        if(snapshot.exists()) {
            document.getElementById('food-log-title').style.display = 'block';
            document.getElementById('noFoodDiv').style.display = 'none';
        }else {
            document.getElementById('food-log-title').style.display = 'none';
            document.getElementById('noFoodDiv').style.display = 'block';
        }
    });

    
    firebase.database().ref(`users/${user.uid}/userInfo/`).on('value', (snapshot) => {
        const data = snapshot.val();
        name = data.name;
        profilePic = data.profilePic;
        document.getElementById('welcomeText').innerHTML = name;
        document.getElementById('nameNav').innerHTML = "<strong>&nbsp" + name + "</strong>";
        document.getElementById('profilePic').src="assets/profilepic/" + profilePic + ".png";
        document.getElementById('profileNav').src="assets/profilepic/" + profilePic + ".png";
    });

    getFood(googleUser.uid);
    getExercises(googleUser.uid);
    getPlans(googleUser.uid);

    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

const getFood = (userId) => {
    firebase.database().ref(`users/${googleUser.uid}/food-tracker/info/selected-week`).on('value', (snapshot) => {
        selectedWeek = snapshot.val().week;
    });

    const foodRef = firebase.database().ref(`users/${userId}/food-tracker/${selectedWeek}/`).on('value', (snapshot) => {
        const data = snapshot.val();
        renderFoodAsHtml(data);
    });
}

const renderFoodAsHtml = (data) => {
    foodEntries = '';
    for(const day in data)
    {
        let entryID = data[day];
        for(food in entryID){
            foodEntries += createFoodCard(entryID[food], day);
        }
    }
    // Get food-log-title
    let foodLogTitle = document.getElementById("food-log-title");
    let content = document.createElement("div");
    // Add classess/styling
    content.classList.add("columns")
    content.style.cssText = "padding-left: 5%; padding-right: 5%; padding-bottom: 1%; overflow-x: auto";
    content.innerHTML = foodEntries;
    foodLogTitle.insertAdjacentElement("afterend", content);
}

const createFoodCard = (foods, date) => {
    calorieCount += parseInt(foods.calorieCount);
    console.log(calorieCount);
    document.getElementById('calorieCount').innerHTML = calorieCount + " cals";
    return `
        <div class="column is-3">
                  <div class="card">
                      <header class="card-header">
                        <p class="card-header-title is-centered">
                        ${foods.food}
                        </p>
                    </header>
                    <div class="card-content has-text-centered">
                        <figure class="image">
                            <img class="is-rounded" src="${foods.imageURL}">
                        </figure>
                        <h3 class="heading is-6"><br>
                            Calories:
                        </h3>
                        <h3 class="class="subtitle is-6 is-spaced" style="margin-top:-5px;">
                            <b>${foods.calorieCount}</b>
                        </h3>
                        <h3 class="heading is-6"><br>
                            Date:
                        </h3>
                        <h3 class="subtitle is-6 is-spaced" style="margin-top:-5px;">
                            <b>${date}</b>
                        </h3>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item">Edit</a>
                        <a href="#" class="card-footer-item has-text-danger">Delete</a>
                    </footer>
                  </div>
              </div>
    `
}

const getExercises = (userId) => {
    const exercisesRef = firebase.database().ref(`users/${userId}/exercise`);
    exercisesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderDataAsHtml(data);
    });
};

const renderDataAsHtml = (data) => {
  let exercises = ``;
  for(const exerciseId in data) {
    const exercise = data[exerciseId];
    // For each note create an HTML card
    if(exercise.date != null)
    {
        exercises += createCard(exercise, exerciseId);
    }
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#cardColumns').innerHTML = exercises;
};

const createCard = (exercise, exerciseId) => {
    let duration = "";
    let durationTitle = "";
    if(exercise.exercise === "Gym") {
        durationTitle = "Duration: ";
        duration = "<b>" + exercise.duration + "</b> min";
        timeCount += parseInt(exercise.duration);
        document.getElementById('timeCount').innerHTML = timeCount + " min";
    }else {
        durationTitle = "Distance: ";
        duration = "<b>" + exercise.duration + "</b> miles";
        milesCount += parseInt(exercise.duration);
        document.getElementById('milesCount').innerHTML = milesCount + " miles";
    }


   return `
        <div class="column is-3">
            <div class="card">
                <header class="card-header">
                <p class="card-header-title is-centered">
                ${exercise.exercise}
                </p>
            </header>
            <div class="card-content has-text-centered">
                <img src="assets/${exercise.exercise}.svg">
                    <h3 class="subtitle is-6 is-spaced"><br>
                    <p class="heading">${durationTitle}</p>${duration}<br><br>
                    <p class="heading">Date:</p> <b>${exercise.date}</b>
                </h3>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item">Edit</a>
                <a href="#" class="card-footer-item has-text-danger">Delete</a>
            </footer>
            </div>
        </div>
   `;
};

const getPlans = (userId) => {
    const exercisesRef = firebase.database().ref(`users/${userId}/workout`);
    exercisesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderPlanDataAsHtml(data);
    });
};

const renderPlanDataAsHtml = (data) => {
  let plans = ``;
  for(const planId in data) {
    const plan = data[planId];
    plans += createPlanCard(data, plan, planId);
  };
  // Inject our string of HTML into our viewNotes.html page
   document.querySelector('#workoutCardColumns').innerHTML = plans;
};

const createPlanCard = (data, plan, planId) => {
    let html = `
        <div class="column is-3">
            <div class="card">
                <header class="card-header">
                <p class="card-header-title is-centered">
                ${planId}
                </p>
            </header>
        <div class="card-content has-text-centered">
            <h3 class="subtitle is-6 is-spaced">
    `;

    let num = 0;
    while(data[planId][num] !== undefined) {
        console.log(data[planId][num].exercise);
        num++;
        if(data[planId][num-1].exercise === "Custom") {
            html += `
                <p class="heading">Exercise #${num}:</p>${data[planId][num-1].exerciseName}<br><br>
                <p class="heading">Reps:</p> <b>${data[planId][num-1].reps}</b><hr>
            `;
        }else {
            html += `
                <p class="heading">Exercise #${num}:</p>${data[planId][num-1].exercise}<br><br>
                <p class="heading">Reps:</p> <b>${data[planId][num-1].reps}</b><hr>
            `;
        }
    }

    html += `
                </h3>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item">Edit</a>
                <a href="#" class="card-footer-item has-text-danger">Delete</a>
            </footer>
            </div>
        </div>
   `;

    return html.substr(0, html.lastIndexOf('<hr>')) + html.substr(html.lastIndexOf('<hr>')+4, html.length);

};

function logExercise() {
    document.getElementById('logDiv').style.display = 'none';
    document.getElementById('confirmLogDiv').style.display = 'block';
}

function confirmLog() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    firebase.database().ref(`users/${googleUser.uid}/exercise`).push({
        date: today,
        exercise: document.getElementById('exerciseSelect').value,
        duration: document.getElementById('durationInput').value
    });

    cancelLog();
}

function cancelLog() {
    document.getElementById('logDiv').style.display = 'block';
    document.getElementById('confirmLogDiv').style.display = 'none';
}

function changeIcon() {
    const exerciseSelect = document.getElementById('exerciseSelect');
    const exerciseIcon = document.getElementById('exerciseIcon');
    exerciseIcon.removeAttribute('class');
    exerciseIcon.classList.add('fas');
    switch(exerciseSelect.value) {
        case "Run":
            exerciseIcon.classList.add('fa-running');
            break;
        case "Walk":
            exerciseIcon.classList.add('fa-walking');
            break;
        case "Swim":
            exerciseIcon.classList.add('fa-swimmer');
            break;
        case "Bike":
            exerciseIcon.classList.add('fa-biking');
            break;
        case "Gym":
           exerciseIcon.classList.add('fa-dumbbell');
            break; 
    }
}

function createWorkout() {
    document.getElementById('workoutDiv').style.display = 'none';
    document.getElementById('confirmWorkoutDiv').style.display = 'block';
}

function confirmCreate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    firebase.database().ref(`users/${googleUser.uid}/exercise`).push({
        date: today,
        exercise: document.getElementById('exerciseSelect').value,
        duration: document.getElementById('durationInput').value
    });

    cancelCreate();
}

function cancelCreate() {
    document.getElementById('workoutDiv').style.display = 'block';
    document.getElementById('confirmWorkoutDiv').style.display = 'none';
}

function changeWorkoutIcon() {
    const workoutIcon = document.getElementById('workoutIcon');
    const workoutNameDiv = document.getElementById('workoutNameDiv');
    switch(document.getElementById('workoutSelect').value) {
        case "Push-ups":
            workoutIcon.src=`https://static.thenounproject.com/png/660576-200.png`;
            workoutNameDiv.style.display='none';
            break;
        case "Pull-ups":
            workoutIcon.src=`https://static.thenounproject.com/png/83591-200.png`;
            workoutNameDiv.style.display='none';
            break;
        case "Sit-ups":
            workoutIcon.src=`https://i1.wp.com/ukandufitness.com/wp-content/uploads/2015/05/sit-up-icon.png?ssl=1`;
            workoutNameDiv.style.display='none';
            break;
        case "Bench Press":
            workoutIcon.src=`https://static.thenounproject.com/png/83592-200.png`;
            workoutNameDiv.style.display='none';
            break;
        case "Custom":
            workoutIcon.src=`https://static.thenounproject.com/png/95683-200.png`;
            workoutNameDiv.style.display='flex';
            break; 
    }
}  

function addExercise() {
    exerciseNum++;
    document.getElementById('exerciseNum').innerHTML = "Exercise #" + exerciseNum;

    const workoutName = document.getElementById('workoutNameInput').value;
    const exercise = document.getElementById('workoutSelect').value;
    const reps = document.getElementById('repsInput').value;

    if(exercise === "Custom") {
        const exerciseName = document.getElementById('exerciseNameInput').value;
        workouts = { exercise, reps, exerciseName };
    }else {
        workouts = { exercise, reps };
    }

    firebase.database().ref(`users/${googleUser.uid}/workout/${workoutName}`).update({
        [exerciseNum-2] : workouts
    })
}

function confirmCreate() {
    addExercise();
    exerciseNum = 1;
    cancelCreate();
}