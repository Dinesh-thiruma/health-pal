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

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
let name = "Dinesh";

const nameInput = document.getElementById('nameInput');

nameInput.addEventListener('change', (event) => {
    window.scrollTo(0, 0);
    step1.style.display = 'none';
    step2.style.display = 'block';
    step2.classList.add("transition-fade");
    name = nameInput.value;
    document.getElementById('welcomeName').innerHTML = "Hi " + name + "!";
});

let profilePicName = "boy1";
let profilePicColor = "blue";

function clickedProfilePicture(element, id) {
    unclickProfilePicture();
    element.style.borderRadius = "65px";
    element.style.border= "thick solid black";
    profilePicName = element.id;
    changeProfilePic();
}

function unclickProfilePicture() {
    document.querySelectorAll("img")[3].style.border = "none";
    document.querySelectorAll("img")[4].style.border = "none";
    document.querySelectorAll("img")[5].style.border = "none";
    document.querySelectorAll("img")[6].style.border = "none";
    document.querySelectorAll("img")[7].style.border = "none";
    document.querySelectorAll("img")[8].style.border = "none";
}

function clickedButton(element) {
    unclickButton();
    element.style.border = "thick solid black";
    profilePicColor = element.id;
    changeProfilePic();
}

function unclickButton() {
    document.querySelectorAll("button")[0].style.border = "none";
    document.querySelectorAll("button")[1].style.border = "none";
    document.querySelectorAll("button")[2].style.border = "none";
    document.querySelectorAll("button")[3].style.border = "none";
    document.querySelectorAll("button")[4].style.border = "none";
    document.querySelectorAll("button")[5].style.border = "none";
}

function changeProfilePic() {
    document.getElementById('profilePic').src="assets/profilepic/" + profilePicName + profilePicColor + ".png";
}

function saveProfilePic() {
    const profilePicDB = profilePicName + profilePicColor;
    const ref = firebase.database().ref(`users/${googleUser.uid}/userInfo`).update({
        profilePic: profilePicDB,
        name: name
    }, (error) => {
        if (error) {
            console.log(error);
        } else {
            window.location = "home.html";
        }
    });
}