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
     <div class="column is-one-quarter">
       <div class="card">
         <header class="card-header">
           <p class="card-header-title">Date: ${exercise.date}</p>
         </header>
         <div class="card-content">
           <div class="content">Exercise: ${exercise.exercise}</div>
         </div>
       </div>
     </div>
   `;
};


function toggleExerciseModal() {
    document.getElementById('logExerciseModal').classList.toggle("is-active");
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

function logExercise() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    firebase.database().ref(`users/${googleUser.uid}`).push({
        date: today,
        exercise: document.getElementById('exerciseSelect').value,
    });
    toggleExerciseModal();
}