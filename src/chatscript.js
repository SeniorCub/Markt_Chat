const allMessages = document.querySelector(".all-messages")
const chatSpace = document.querySelector(".chat-space")

let selectedchat = undefined

window.addEventListener("load",()=>{
    const chatList = document.querySelector(".chats-list")
    chats.forEach((chat)=>{
        let newchatelem = document.createElement("li")
        newchatelem.classList.add("spec-chat")
        newchatelem.addEventListener("click",()=>{
            selectedchat = chat
        })

        let username = document.createElement("h1")
        username.innerHTML = chat.user_name

        let user_profile_image = document.createElement("img")
        user_profile_image.src = chat.user_profile_image

        let lastmessage = document.createElement("p")
        lastmessage.innerHTML = cutstr(chat.messages[chat.messages.length - 1].message)

        let userdetcont = document.createElement("div")
        userdetcont.appendChild(username)
        userdetcont.appendChild(lastmessage)

        newchatelem.appendChild(user_profile_image)
        newchatelem.appendChild(userdetcont)
        chatList.appendChild(newchatelem)
    })
})
window.addEventListener("resize",()=>{})

function cutstr(str){
    if(str.length > 10)
        return str.slice(0,12)+"..."
    return str+"..."
}

let chats = [{
    user_id:"john",user_name:"john",user_profile_image:"cdvnvhjhihnyhb",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"john",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"john",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"john",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"john",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"john",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"john",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"john",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"john",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"john",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
},
{
    user_id:"maze",user_name:"maze",user_profile_image:"cdvnvhjhihnyhb",user_type:"buyer",status:"online",
    messages:[
        {sent_to:"maze",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"maze",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"maze",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"maze",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"maze",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"maze",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"maze",sent_from:"you",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"maze",status:"read",send_date_and_time:"00:04",message:"hello"},
        {sent_to:"you",sent_from:"maze",status:"read",send_date_and_time:"00:04",message:"hello"},
    ]
}]