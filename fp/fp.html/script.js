const form = document.getElementById("form");
const list = document.getElementById("list");
const success = document.getElementById("success");

// Load saved data
window.onload = function() {
    let data = JSON.parse(localStorage.getItem("users")) || [];
    data.forEach(user => addUser(user));
};

form.addEventListener("submit", function(e){
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let event = document.getElementById("event").value;

    if(event === ""){
        success.innerText = "⚠️ Select event!";
        success.style.color = "red";
        return;
    }

    let user = {name, email, event};

    // Save to localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    addUser(user);

    success.innerText = "✅ Registered Successfully!";
    success.style.color = "green";

    form.reset();
});

// Add user to UI
function addUser(user){
    let li = document.createElement("li");
    li.innerText = `${user.name} (${user.email}) - ${user.event}`;
    list.appendChild(li);
}