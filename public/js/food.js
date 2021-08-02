const loadFoodSchedule = () => {

}

function editDay(tile) {
    editModalTitle = document.getElementById("modalTitle");
    editModalTitle.value = "That day";
    editDayModal = document.getElementById("editDayModal");
    editDayModal.classList.toggle("is-active");
}


function closeDayModal() {
    closeDayModal = document.getElementById("editDayModal");
    closeDayModal.classList.toggle("is-active");
}

document.querySelectorAll(".tile:not(.is-ancestor)").forEach((tile) =>{
    tile.addEventListener("click", click => {
        console.log("Hype");
        editDay(tile);
    })
    console.log(tile);
});