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
