let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      getPlans(googleUser.uid);
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

const logExercise = () => {
  // 1. Capture the form data
  const noteTitle = document.querySelector('#dateInput');
  const noteText = document.querySelector('#exerciseInput');
  // 2. Format the data and write it to our database
  firebase.database().ref(`users/${googleUser.uid}`).push({
    date: dateInput.value,
    exercise: exerciseInput.value
  })
  // 3. Clear the form so that we can write a new note
  .then(() => {
    dateInput.value = "";
    exerciseInput.value = "";
  });
}

const addToPlan = () => {
    const workoutInput = document.querySelector('#workoutInput');
    const repetitionInput = document.querySelector('#repetitionInput');
    
    firebase.database().ref(`users/${googleUser.uid}`).push({
        workout: workoutInput.value,
        repetitions: repetitionInput.value
    }).then(() => {
        workoutInput.value = "";
        repetitionInput.value = "";
    });
}

const getPlans = (userId, planId) => {
    const notesRef = firebase.database().ref(`users/${userId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        renderDataAsHtml(data);
    });
};

const renderDataAsHtml = (data) => {
  let plans = ``;
  for(const planId in data) {
    const plan = data[planId];
    console.log('here');
    // For each note create an HTML card
    if(plan.repetitions != null)
    {
        plans += createCard(plan, planId);
    }
  };
  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#plan').innerHTML = plans;
};

const createCard = (plan, planId) => {
   return `
     <div class="column is-one-quarter">
       <div class="card">
         <header class="card-header">
           <p class="card-header-title">Workout: ${plan.workout}</p>
         </header>
         <div class="card-content">
           <div class="content">Repetitions/Duration: ${plan.repetitions}</div>
         </div>
       </div>
     </div>
   `;
};