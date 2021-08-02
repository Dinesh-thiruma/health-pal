const loadFoodSchedule = () => {

}

function editDay(tile) {
    editDayModal = document.getElementById("editDayModal");
    editDayModal.classList.toggle("is-active");
}

document.querySelectorAll(".tile").forEach((tile) =>{
    tile.addEventListener("click", click => {
        console.log("Hype");
        editDay(tile);
    })
    console.log(tile);
});