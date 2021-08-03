let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
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