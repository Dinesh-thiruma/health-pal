let googleUser;
let name;
let profilePic;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;

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
    const foodRef = firebase.database().ref(`users/${userId}/food-tracker/2021-08-01/`).on('value', (snapshot) => {
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
    content.classList.add("columns")
    content.innerHTML = foodEntries;
    foodLogTitle.insertAdjacentElement("afterend", content);
}

const createFoodCard = (foods, date) => {
    return `
        <div class="column is-3">
                  <div class="card">
                      <header class="card-header">
                        <p class="card-header-title is-centered">
                        ${foods.food}
                        </p>
                    </header>
                    <div class="card-content has-text-centered">
                        <img src="${foods.imageURL}">
                        <h3 class="subtitle is-6 is-spaced"><br>
                            Calories: <b>${foods.calorieCount}</b><br>
                            Date: <b>${date}</b>
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
    const exercisesRef = firebase.database().ref(`users/${userId}`);
    exercisesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderDataAsHtml(data);
    });
};

const renderDataAsHtml = (data) => {
  let exercises = ``;
  for(const exerciseId in data) {
    const exercise = data[exerciseId];
    console.log('here');
    // For each note create an HTML card
    if(exercise.date != null)
    {
        exercises += createCard(exercise, exerciseId);
    }
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#exerciseCard').innerHTML = exercises;
};

const createCard = (exercise, exerciseId) => {
   return `
       <div class="card">
         <header class="card-header">
           <p class="card-header-title">Date: ${exercise.date}</p>
         </header>
         <div class="card-content">
           <div class="content">Exercise: ${exercise.exercise}</div>
         </div>
       </div>
   `;
};

const getPlans = (userId) => {
    const exercisesRef = firebase.database().ref(`users/${userId}`);
    exercisesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderPlanDataAsHtml(data);
    });
};

const renderPlanDataAsHtml = (data) => {
  let plans = ``;
  for(const planId in data) {
    const plan = data[planId];
    console.log('here');
    // For each note create an HTML card
    if(plan.repetitions != null)
    {
        plans += createPlanCard(plan, planId);
    }
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#plansCard').innerHTML = plans;
};

const createPlanCard = (plan, planId) => {
   return `
       <div class="card">
         <header class="card-header">
           <p class="card-header-title">Workout: ${plan.workout}</p>
         </header>
         <div class="card-content">
           <div class="content">Reps/Duration: ${plan.repetitions}</div>
         </div>
       </div>
   `;
};

let numPressed = 0;
function logExercise() {
    numPressed++;

    if(numPressed === 1) {
        document.getElementById('logExerciseDiv').style.display="block";
        document.getElementById('logExerciseButton').innerHTML = "Confirm";
    }else {
        document.getElementById('logExerciseDiv').style.display="none";
        numPressed = 0;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        firebase.database().ref(`users/${googleUser.uid}`).push({
            date: today,
            exercise: document.getElementById('exerciseSelect').value,
        });
        document.getElementById('logExerciseButton').innerHTML = "Log A New Exercise";
    }
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