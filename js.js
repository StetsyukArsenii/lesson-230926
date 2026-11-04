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
        body: 
            new FormData(e.target).get("title") && new FormData(e.target).get("description") ?
            JSON.stringify({
                title: new FormData(e.target).get("title"),
                description: new FormData(e.target).get("description")
            }) : null
    }).then(() => {
        location.reload();
    })
})