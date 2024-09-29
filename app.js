const sendBtn = document.getElementById("sendBtn");
const messageElement = document.getElementById("msg");
const userNameInput = document.getElementById("username");
userNameInput.value = sessionStorage.getItem("username")

sendBtn.disabled = true;


try {
    const socket = io("http://localhost:8181");

    socket.on("message recived", (message) => {
        printMessage(message);
    })

    socket.on("recoverHistory", (history) => {
        history.forEach(msg => {
            printMessage(msg)
        });
    });

    messageElement.addEventListener("input", () => {
        if (messageElement.value.trim() !== "") {
            sendBtn.disabled = false;
        } else {
            sendBtn.disabled = true;
        }
    })

    sendBtn.addEventListener("click", () => {
        try {
            socket.emit("message sent", {
                content: messageElement.value,
                username: userNameInput.value,
                time: new Date(),
            });
        } catch (err) {
            console.log("error during sending the message");
            console.log(err);
        }

        messageElement.value = "";
        messageElement.focus();
    });
} catch (err) {
    console.log("error during connection");
    console.log(err);
}


const printMessage = (msg) => {
    let currentTime = new Date().toLocaleTimeString();
    const chatDiv = document.getElementById("chat");
    const newDiv = document.createElement('div');
    newDiv.classList.add('message');

    if (msg.username === userNameInput.value) {
        newDiv.classList.add('msgIn');
    } else {
        newDiv.classList.add('msgOut')
    }
    const msgOnScreen = document.createElement('p');
    msgOnScreen.innerText = msg.content;
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    div1.innerText = msg.username;
    div1.className = 'msgHeader';
    div2.innerText = currentTime;
    div2.className = 'msgTime';
    newDiv.appendChild(div1);
    newDiv.appendChild(msgOnScreen);
    newDiv.appendChild(div2);
    chatDiv.appendChild(newDiv);
};

userNameInput.addEventListener("input", () => {
    sessionStorage.setItem("username", userNameInput.value)
})