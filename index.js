import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://wearethechampions-2f325-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsement");
const endorsementsListEl = document.getElementById("endorsements");

const endorsementFieldEl = document.getElementById("endorsement");
const fromFieldEl = document.getElementById("from");
const toFieldEl = document.getElementById("to");
const publishButtonEl = document.getElementById("publish-button");

publishButtonEl.addEventListener("click", function(){
    let inputValue = {
        "endorsement": endorsementFieldEl.value,
        "from": fromFieldEl.value,
        "to": toFieldEl.value
    }
    console.log(inputValue);
    //give the ref first, this is where the database is, and then add the inputValue
    push(endorsementsInDB, inputValue);    
    
    //Clear input field
    clearInput();
})

//onValue function for updating in real time
onValue(endorsementsInDB, function(snapshot){
    clearEndorsementsListEl();
    if(snapshot.exists()){
        let endorsementsArray = Object.entries(snapshot.val());
        console.log(endorsementsArray);
        for(let i = 0; i < endorsementsArray.length; i++){
            let currentEndorsement = endorsementsArray[i];
            // currentItemID and currentItemValue and use currentItem to set both of
            // them equal to the correct values.
            appendEndorsement(currentEndorsement);
        }
    }else{
        endorsementsListEl.innerHTML = "No items here... yet."
    }
    
})

//Clear Input Function
function clearInput(){
    endorsementFieldEl.value = "";
    fromFieldEl.value="";
    toFieldEl.value="";
}
//Clear Endorsements List function
function clearEndorsementsListEl(){
    endorsementsListEl.innerHTML = '';
}

function appendEndorsement(endorsement){

    let endorsementID = endorsement[0];
    let endorsementMessage = endorsement[1].endorsement;
    let endorsementFrom = endorsement[1].from;
    let endorsementTo = endorsement[1].to;
    let likes = 0;

    let newEl = document.createElement("div");
    let removeButtonEl = document.getElementById("remove");
    newEl.innerHTML = 
    `<li>
        <p>From: ${endorsementFrom}</p>
        ${endorsementMessage}
        <p>To: ${endorsementTo}</p>
        <button class="like-button" data-endorsement-id="${endorsementID}"><i class="fa-regular fa-heart"></i> Like</button>
        <span class="like-count">${likes}</span>
        <button id="remove">Remove</button>
    </li>`;

    newEl.querySelector('.like-button').addEventListener('click', function() {
        // Handle the like button click
        likes+= 1;
        newEl.querySelector('.like-count').textContent = likes;

        // You may want to update the likes count in the database here if needed
        // Example: updateLikesCount(endorsementID, likes);
        event.stopPropagation();
    });
    
    newEl.addEventListener('click', function(){
        let exactLocationOfItemInDB = ref(database, `endorsement/${endorsementID}`);
        remove(exactLocationOfItemInDB);
    })

    endorsementsListEl.append(newEl);

}



//turning an object into an array

//Object.values() => gives the value of the object
//Object.keys() => gives the key of the object
//Object.entries() => gives key-value pair as a nested array

//fetch data from Firebase using onValue function
//If client adds value to input field, data is saved to database. 
// database sends signal to all clients that database is updated in a 'snapshot'
//onValue takes two arguments, the first of which is reference (where we want to fetch data from)
// in this case that is stored in a variable like so:
// const endorsementsInDB = ref(database, "endorsements");
//the second argument is a function containing the snapshot

// Like button Function
            