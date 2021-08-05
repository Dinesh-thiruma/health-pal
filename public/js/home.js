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
    getExercises(googleUser.uid);
    getPlans(googleUser.uid);
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

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

function launchExerciseModal() {
    document.getElementById('logExerciseModal').classList.toggle("is-active");
}
