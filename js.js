document.querySelector("#add").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "flex";
});
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "none";
});

document.querySelector("#add-ad-form").addEventListener("submit", (e) => {
    e.preventDefault();
    fetch('/add', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: e.target.title.value,
            description: e.target.description.value
        })
    }).then(() => {
        location.reload();
    })
})