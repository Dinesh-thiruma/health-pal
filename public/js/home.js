let googleUser;
let name;
let profilePic;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.uid);
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

    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
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