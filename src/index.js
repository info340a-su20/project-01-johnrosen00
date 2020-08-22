'use strict';


let emptyState = {type:"", weight:0, sets:0, reps:0, date:""}

let state = {
    current:emptyState,
    history:accessHistory()
};




/*
let g = document.querySelector("#graph-button");
//graphbutton
g.addEventListener("click",
    (event) => {
        event.preventDefault();
    }
);*/

let frequencyButton = document.querySelector("#frequency-button");
//frequencybutton

frequencyButton.addEventListener("click",(event) => {
    event.preventDefault();
    renderFreqTable();
});


function accessHistory(){
//     let ret = fetch("https://raw.githubusercontent.com/info340a-su20/project-01-johnrosen00/master/src/fakeinfo.json")
//         .then(
//             (response) => {
//                 return response.json();
//             }
//         );
    //array of lift objects
    
    let lifts = [
        {"type":"Hack Squat", "weight":225, "sets":5, "reps":8, "date":"2019-05-22"},
        {"type":"Squat", "weight":315, "sets":5, "reps":5, "date":"2019-05-25"},
        {"type":"Leg Press", "weight":540, "sets":3, "reps":8, "date":"2019-05-27"},
        {"type":"Deadlift", "weight":405, "sets":3, "reps":5, "date":"2019-05-29"},
        {"type":"Squat", "weight":225, "sets":5, "reps":5, "date":"2019-05-31"},
        {"type":"Isometric Leg Press", "weight":275, "sets":4, "reps":10, "date":"2019-06-02"},
        {"type":"Deadlift", "weight":365, "sets":3, "reps":6, "date":"2019-06-04"},
        {"type":"Leg Extensions", "weight":130, "sets":5, "reps":10, "date":"2019-06-06"},
        {"type":"Squat", "weight":225, "sets":5, "reps":5, "date":"2019-06-08"},
        {"type":"Squat", "weight":225, "sets":5, "reps":5, "date":"2019-06-10"},
        {"type":"Front Squat", "weight":265, "sets":5, "reps":5, "date":"2019-06-12"},
        {"type":"Squat", "weight":315, "sets":5, "reps":6, "date":"2019-06-14"},
        {"type":"Calf Raises", "weight":225, "sets":3, "reps":20, "date":"2019-06-16"},
        {"type":"Deadlift", "weight":415, "sets":3, "reps":4, "date":"2019-06-18"},
        {"type":"Squat", "weight":275, "sets":3, "reps":10, "date":"2019-06-20"},
        {"type":"Hack Squat", "weight":275, "sets":4, "reps":6, "date":"2019-06-22"},
        {"type":"Deadlift", "weight":365, "sets":3, "reps":6, "date":"2019-06-24"},
        {"type":"Leg Extensions", "weight":130, "sets":5, "reps":10, "date":"2019-06-26"},
        {"type":"Front Squat", "weight":275, "sets":5, "reps":5, "date":"2019-06-28"},
        {"type":"Squat", "weight":365, "sets":2, "reps":4, "date":"2019-06-30"} 
      ];
    
    return lifts;
}

function addLift() {
    state.history.push(state.current);
    state.current = emptyState;
}
/*
function renderGraph(){
    viewContent.innerHTML = "";

}*/

function renderFreqTable(){
    document.querySelector("#views").innerHTML = "";

    let uniqueKeys = [];

    state.history.forEach(
        (item) => {
            if(!uniqueKeys.includes(item.type.toUpperCase())) {
                uniqueKeys.push(item.type.toUpperCase());
            }
        }
    );

    
    let freq = {};

    state.history.forEach(
        (item) => {
            let bold = item.type.toUpperCase();
            if(!freq[bold]){
                freq[bold] = 1;
            } else {
                freq[bold]++;
            }
        }
    )
    let weight = {};

    state.history.forEach(
        (item) => {
            let bold = item.type.toUpperCase();
            if(!weight[bold]){
                weight[bold] = item.weight;
            } else {
                if(item.weight > weight[bold]){
                    weight[bold] = item.weight;
                }
            }
        }
    )

    console.log(weight);
    console.log(freq);
    
    
    //there has to be a faster way of doing this :(
    let table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("table-dark");
    
    
    let head = document.createElement("thead");
    let row1 = document.createElement("tr");
    let colHead1 = document.createElement("th");
    colHead1.scope = "col";
    colHead1.textContent = "Type";
    let colHead2 = document.createElement("th");
    colHead2.scope = "col";
    colHead2.textContent = "Number of Times Performed";
    let colHead3 = document.createElement("th");
    colHead3.scope = "col";
    colHead3.textContent = "Heaviest Weight";

    row1.appendChild(colHead1);
    row1.appendChild(colHead2);
    row1.appendChild(colHead3)
    head.appendChild(row1);
    table.appendChild(head);

    let body = document.createElement("tbody");

    uniqueKeys.forEach(
        (item)=> {
            let tr = document.createElement("tr");
            let typeCell = document.createElement("td");
            typeCell.textContent = item;

            let currentFreq = freq[item];
            let currentWeight = weight[item];
            console.log(item);
            console.log(currentFreq);
            console.log(currentWeight);
            let freqCell = document.createElement("td");
            freqCell.textContent = currentFreq;

            let weightCell = document.createElement("td");
            weightCell.textContent = currentWeight;

            tr.appendChild(typeCell);
            tr.appendChild(freqCell);
            tr.appendChild(weightCell);

            body.appendChild(tr);
        }
    )
    
    table.appendChild(body);

    document.querySelector("#views").appendChild(table);
}
