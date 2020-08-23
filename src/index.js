'use strict';

//initial state
function asyncHistory() {
    let ret = fetch("https://raw.githubusercontent.com/info340a-su20/project-01-johnrosen00/master/src/fakeinfo%20copy.json")
        .then(
            (response) => {
                return response.json();
            })
        .then(
            (response)=>{
                state.history = response.content;
            })
        .catch(
            (err)=> {
                console.error(err.message);
                state.history=accessHistory();
            }
        ).then(renderFreqTable);
}

let state = {
    current:{type:"", weight:0, sets:0, reps:0, date:""},
    history:[]
};

asyncHistory();

//handle form:

let formElements = {
    type:document.querySelector("#workoutInput"),
    weight:document.querySelector("#weightInput"),
    sets:document.querySelector("#setsInput"),
    reps:document.querySelector("#repsInput"),
    date:document.querySelector("#dateInput")
}

let liftKeys = ["type", "weight", "sets", "reps", "date"];
//Object.keys(sampleObject) does not work in a lot of browsers apparently :(

let form = document.querySelector("form");
let submit = document.querySelector("#submit-button");


for(let i = 0; i < liftKeys.length; i++) {
    formElements[liftKeys[i]].addEventListener("input",
        ()=>{
            state.current[liftKeys[i]] = formElements[liftKeys[i]].value;
            renderInput(liftKeys[i]);
        }
    );
}

submit.addEventListener("click", (event)=> {
    event.preventDefault();
    state.history.push(state.current);
    state.current={type:"", weight:0, sets:0, reps:0, date:""};
    form.reset();
    renderFreqTable();
});


//render inputs
function renderInput(item) {
    formElements[item].value = state.current[item];
}

function renderAllInputs(){
    for(let i = 0; i < liftKeys.length; i++) {
        formElements[liftKeys[i]].value = state.current[liftKeys[i]];
    }
}

//handle buttons

let graphButton = document.querySelector("#graph-button");
graphButton.addEventListener("click",
    (event) => {
        event.preventDefault();
        renderGraphGate();
    }
);

let frequencyButton = document.querySelector("#frequency-button");

frequencyButton.addEventListener("click",(event) => {
    event.preventDefault();
    renderFreqTable();
});



//handle "past" data if fetch fails.
//same data as response.content lol
function accessHistory(){
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




//handle views:

//checks to see if data is eligible to be used for graph
function renderGraphGate(){
    let views = document.querySelector("#views");
    views.innerHTML = "";
    //find lift that is most frequently performed.
    //largely similar to the start of renderFreqTable
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
    );
    
    let highFreq = [];
    //generate array of lifts that have been performed frequently
    uniqueKeys.forEach(
        (item) => {
            if(freq[item] > 3){
                highFreq.push(item);
            }
        }
    );

    if(highFreq.length < 1){
        let errorMessage = document.createElement("p");
        errorMessage.classList.add("alert");
        errorMessage.textContent = "No lifts done frequently enough to generate graph"
        views.appendChild(errorMessage);
    } else{
        renderGraph(highFreq, views);
    }
}

//renders graph
function renderGraph(keys, views){
    let data = [];
    let layout = {
        title:"Progress",
        xaxis:{title:"Milliseconds elapsed since 1970-01-01"},
        yaxis:{title:"Weight lifted * total reps done"},
        height:500,
        autosize:true
    }

    keys.forEach(
        (item) => {
            data.push(createTrace(item));
        }
    )

    Plotly.newPlot('views', data, layout);
}

//creates a trace object
function createTrace(name){
    //example trace
    // let trace1 = {
    //     x: [1, 2, 3, 4],
    //     y: [10, 15, 13, 17],
    //     type: 'scatter'
    //   };

    //x = date
    //y = weight lifted * sets * reps

    let dateArray = []; 
    let volumeArray = [];

    state.history.forEach(
        (item) => {
            if(item.type.toUpperCase() == name) {
                dateArray.push(Date.parse(item.date));
                volumeArray.push(item.sets*item.reps*item.weight);
            }
        }
    );

    let trace = {
        x:dateArray,
        y:volumeArray,
        type:"scatter",
        "name":name
    };

    return trace;
}
//hehe
function renderFreqTable(){
    //big boy
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
    );

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
    );
    
    
    //there has to be a faster way of doing this :(

    //table framework
    let table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("table-dark");
    
    //table head
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
    colHead3.textContent = "Heaviest Weight Lifted";

    //append head content
    row1.appendChild(colHead1);
    row1.appendChild(colHead2);
    row1.appendChild(colHead3)
    head.appendChild(row1);
    table.appendChild(head);
    
    //table body
    let body = document.createElement("tbody");

    uniqueKeys.forEach(
        (item)=> {
            let tr = document.createElement("tr");
            let typeCell = document.createElement("td");
            typeCell.textContent = item;

            let currentFreq = freq[item];
            let currentWeight = weight[item];
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
    
    //render table
    document.querySelector("#views").appendChild(table);
}
