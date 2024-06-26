const allMessages = document.querySelector(".all-messages")
const chatSpace = document.querySelector(".chat-space")

let selectedchat = undefined

function emoji_tray() {
     let cartmenu = document.querySelector('.emoji-tray');
     let extended = cartmenu.style.display === "block";
     cartmenu.style.display = extended ? "none" : "none";
}

function keyTyping() {
     const statusText = document.querySelector(".status-text")
     statusText.innerHTML=`Typing...`;
}
function keyTypingg() {
     const statusText = document.querySelector(".status-text")
     statusText.innerHTML=`online`;
}
window.addEventListener("load", () => {
     // Add socketio events as needed corresponding to how it is on the server side
     const socket = io.connect(`http://`);
 
     document.querySelector(".chat-input").addEventListener("input", keyTyping);
     document.querySelector(".chat-input").addEventListener("focusout", keyTypingg);
 
     document.querySelector('.emoji-tray').style.display = "none";
 
     document.querySelector('#toggleEmojiTray').addEventListener("click", () => {
         let cartmenu = document.querySelector('.emoji-tray');
         let extended = cartmenu.style.display === "grid";
         cartmenu.style.display = extended ? "none" : "grid";
     });
 
     check_chat_status();
     const chatList = document.querySelector(".chats-list");
     const chatMessages = document.querySelector(".chat-messages");
     const chatSpace = document.querySelector(".chat-space");
     const allMessages = document.querySelector(".all-messages");
 
     chats.forEach((chat) => {
         // Add the chats list inbox
         let newchatelem = document.createElement("li");
         newchatelem.classList.add("spec-chat");
         newchatelem.addEventListener("click", () => {
             // selected chat is the chat the user is currently looking at
             selectedchat = chat;
 
             chatMessages.replaceChildren("");
             check_chat_status();
             emoji_tray();
             const userName = document.querySelector(".user-name");
             const statusText = document.querySelector(".status-text");
             const profile_image = document.querySelector(".profile-image").src = chat.user_profile_image;
             const statusColor = document.querySelector(".status-color");
 
             // change the status and username and profile image to that of the selected chat
             userName.innerHTML = selectedchat.user_name;
             statusText.innerHTML = selectedchat.status;
             if (selectedchat.status === "online") {
                 statusColor.style.backgroundColor = "green";
             } else {
                 statusColor.style.backgroundColor = "darkgray";
             }
 
             // display all messages of selected chat
             selectedchat.messages.forEach((message) => {
                 let messagecont = document.createElement("div");
                 let messagebubble = document.createElement("div");
 
                 if (message.sent_from === "you") {
                     messagecont.classList.add("sent-by-you");
                     messagebubble.classList.add("bubble-sent-by-you");
                 }
                 if (message.sent_to === "you") {
                     messagecont.classList.add("sent-by-other");
                     messagebubble.classList.add("bubble-sent-by-other");
                 }
 
                 messagebubble.innerHTML = message.message;
                 messagecont.appendChild(messagebubble);
 
                 chatMessages.appendChild(messagecont);
                 chatMessages.scrollBy(0, chatMessages.scrollHeight);
             });
             
             // When a chat is clicked, show .chat-space and hide .all-messages on small screens
             if (window.innerWidth <= 500) {
                 chatSpace.style.display = "block";
                 allMessages.style.display = "none";
             }
         });
 
         let username = document.createElement("h1");
         username.innerHTML = chat.user_name;
 
         let user_profile_image = document.createElement("img");
         user_profile_image.classList.add("user-profile-image");
         user_profile_image.src = chat.user_profile_image;
 
         let lastmessage = document.createElement("p");
         lastmessage.innerHTML = cutstr(chat.messages[chat.messages.length - 1].message);
 
         let userdetcont = document.createElement("div");
         userdetcont.classList.add("user-det-cont");
         userdetcont.appendChild(username);
         userdetcont.appendChild(lastmessage);
         newchatelem.appendChild(user_profile_image);
         newchatelem.appendChild(userdetcont);
         chatList.appendChild(newchatelem);
     });
 
     
 });

function check_chat_status(){
    let noMessagesSpace = document.querySelector(".no-messages-space")
    let chatMessagesSpace = document.querySelector(".chat-messages-space")
    if(selectedchat){
        noMessagesSpace.style.display = "none"
        chatMessagesSpace.style.display = "inline-block"
    }
    else{
        noMessagesSpace.style.display = "flex"
        chatMessagesSpace.style.display = "none"
    }
    if (window.innerWidth <= 500) {
          if(!selectedchat){
               noMessagesSpace.style.display = "none"
          }
    }
}

function cutstr(str){
    if(str.length > 18)
        return str.slice(0,21)+"..."
    return str
}

function remove_selected_chat(){
    selectedchat = undefined
    check_chat_status()
    const userName = document.querySelector(".user-name")
    const statusText = document.querySelector(".status-text")
    const statusColor = document.querySelector(".status-color")

    userName.innerHTML = ""
    statusText.innerHTML = ""
    statusColor.style.backgroundColor = "darkgray"
     // When back button is clicked, show .all-messages and hide .chat-space on small screens
     if (window.innerWidth <= 500) {
          selectedchat = undefined
          check_chat_status()
          const chatSpaceHeader = document.querySelector(".chat-space-header").style.display= "none";
          const userName = document.querySelector(".user-name").style.display= "none";
          const statusText = document.querySelector(".status-text").style.display= "none";
          const statusColor = document.querySelector(".status-color").style.display= "none";
          const allMessages = document.querySelector(".all-messages").style.display = "block";
          const chatSpace = document.querySelector(".chat-space").style.display = "none";
     }
}

function send_message(){
    const chatMessages = document.querySelector(".chat-messages")
    let chatInput = document.querySelector(".chat-input")
    let text = chatInput.value
    if(text){
        selectedchat.messages.push(
            {sent_to:selectedchat.user_id,sent_from:"you",status:"unread",
            send_date_and_time:"00:04",message:text})
        let messagecont = document.createElement("div")
        let messagebubble = document.createElement("div")

        messagecont.classList.add("sent-by-you")
        messagebubble.classList.add("bubble-sent-by-you")

        messagebubble.innerHTML = text
        messagecont.appendChild(messagebubble)

        chatMessages.appendChild(messagecont)
        chatMessages.scrollBy(0,chatMessages.scrollHeight)
        chatInput.value = ""
    }
    const statusText = document.querySelector(".status-text")
    statusText.innerHTML=`Online`;
}

function handle_image_uploads(){
    const chatMessages = document.querySelector(".chat-messages")
    let chatImageUploader = document.querySelector("#chat-image")
    for(i=0;i<chatImageUploader.files.length;i++){
        let messagecont = document.createElement("div")
        messagecont.classList.add("sent-by-you")

        let image = document.createElement("img")
        image.src = URL.createObjectURL(chatImageUploader.files[i])
        image.classList.add("uploaded-images")
        messagecont.appendChild(image)
        chatMessages.appendChild(messagecont)
    }
    chatMessages.scrollBy(0,chatMessages.scrollHeight)
}
//this is another function that depends on how the data from the socketio events would look like
function handle_incoming_messages(incoming_message){}

//PS: These values are just for tests, please remove them incase you want to get the socketio stuff set
let chats = [{
    user_id:"angela",user_name:"angela",user_profile_image:"./Chat/avatar-angela-gray.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"angela",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"angela",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"angela",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"angela",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"angela",status:"read",send_date_and_time:"00:04",message:"goat"},
        {sent_to:"angela",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"angela",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"angela",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"angela",status:"read",send_date_and_time:"00:04",message:"bat"},
    ]
},
{
    user_id:"anna",user_name:"anna",user_profile_image:"./Chat/avatar-anna-kim.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"anna",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"anna",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"anna",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"anna",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"anna",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"anna",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"anna",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"anna",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"anna",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"anna",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"anna",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"Jacob",user_name:"Jacob",user_profile_image:"./Chat/avatar-jacob-thompson.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"Jacob",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"Jacob",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"Jacob",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"Jacob",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"Jacob",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"Jacob",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"Jacob",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"Jacob",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"Jacob",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"kimberly",user_name:"kimberly",user_profile_image:"./Chat/avatar-kimberly-smith.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"kimberly",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"kimberly",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"kimberly",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"kimberly",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"kimberly",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"kimberly",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"kimberly",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"kimberly",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"kimberly",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"mark",user_name:"mark",user_profile_image:"./Chat/avatar-mark-webber.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"mark",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"mark",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"mark",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"mark",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"mark",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"mark",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"mark",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"mark",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"mark",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"nathan",user_name:"nathan",user_profile_image:"./Chat/avatar-nathan-peterson.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"nathan",user_name:"nathan",user_profile_image:"./Chat/avatar-nathan-peterson.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"nathan",user_name:"nathan",user_profile_image:"./Chat/avatar-nathan-peterson.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"nathan",user_name:"nathan",user_profile_image:"./Chat/avatar-nathan-peterson.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"nathan",user_name:"nathan",user_profile_image:"./Chat/avatar-nathan-peterson.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"nathan",user_name:"nathan",user_profile_image:"./Chat/avatar-nathan-peterson.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"nathan",user_name:"nathan",user_profile_image:"./Chat/avatar-nathan-peterson.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"nathan",user_name:"nathan",user_profile_image:"./Chat/avatar-nathan-peterson.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"nathan",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"nathan",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"rizky",user_name:"rizky",user_profile_image:"./Chat/avatar-rizky-hasanuddin.webp",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"rizky",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"rizky",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"rizky",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"rizky",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"rizky",status:"read",send_date_and_time:"00:04",message:"courterrr"},
        {sent_to:"rizky",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"rizky",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"rizky",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"rizky",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
}]


function startCall() {
     let callcontainer = document.querySelector("#cameraContainer")
     let noMessagesSpace = document.querySelector(".no-messages-space")
     let chatMessagesSpace = document.querySelector(".chat-messages-space")
     noMessagesSpace.style.display = "none"
     chatMessagesSpace.style.display = "none"
     callcontainer.style.display= "Block"
}
function endCall() {
     let callcontainer = document.querySelector("#cameraContainer")
     let noMessagesSpace = document.querySelector(".no-messages-space")
     let chatMessagesSpace = document.querySelector(".chat-messages-space")
     noMessagesSpace.style.display = "flex"
     chatMessagesSpace.style.display = "none"
     callcontainer.style.display= "none"
     if (window.innerWidth <= 500) {
          selectedchat = undefined
          check_chat_status()
          const chatSpaceHeader = document.querySelector(".chat-space-header").style.display= "none";
          const userName = document.querySelector(".user-name").style.display= "none";
          const statusText = document.querySelector(".status-text").style.display= "none";
          const statusColor = document.querySelector(".status-color").style.display= "none";
          const allMessages = document.querySelector(".all-messages").style.display = "block";
          const chatSpace = document.querySelector(".chat-space").style.display = "none";
     }
}