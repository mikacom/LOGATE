let wires = [];
let inputA = 0;
let inputB = 0;

const workspace = document.getElementById("workspace");
const toolboxGates = document.querySelectorAll(".gate");

/* ================= DRAG FROM TOOLBOX ================= */

toolboxGates.forEach(gate => {
    gate.addEventListener("dragstart", function(e){
        e.dataTransfer.setData("text/plain", gate.dataset.type);
    });
});

/* ================= DROP ================= */

workspace.addEventListener("dragover", function(e){
    e.preventDefault();
});

workspace.addEventListener("drop", function(e){

    e.preventDefault();

    const gateType = e.dataTransfer.getData("text/plain");

    const rect = workspace.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if(typeof createGate === "function"){
        createGate(gateType, x, y);
    }

    simulate();

});

/* ================= INPUT TOGGLE ================= */

function toggleInput(input){

    if(input === "A"){
        inputA = inputA ? 0 : 1;
        document.getElementById("A").innerText = inputA;
    }

    if(input === "B"){
        inputB = inputB ? 0 : 1;
        document.getElementById("B").innerText = inputB;
    }

    simulate();

}

/* ================= SIMULATION ================= */

function simulate(){

/* RESET ALL PINS */
document.querySelectorAll(".pin").forEach(p => p.value = 0);

/* SOURCE VALUES */
document.querySelectorAll(".sourceA").forEach(p => p.value = inputA);
document.querySelectorAll(".sourceB").forEach(p => p.value = inputB);

/* RUN MULTIPLE PASSES */
for(let step = 0; step < 6; step++){

    /* AUTO INPUT ONLY IF NO WIRE CONNECTED */
    document.querySelectorAll(".gateNode").forEach(gate => {

        const inputs = gate.querySelectorAll(".input");

        inputs.forEach((pin, index) => {

            let connected = false;

            wires.forEach(w => {
                if(w.pin2 === pin){
                    connected = true;
                }
            });

            if(!connected){
                pin.value = (index === 0) ? inputA : inputB;
            }

        });

    });

    /* PROPAGATE WIRES */
    wires.forEach(w => {
        w.pin2.value = w.pin1.value;
    });

    /* PROCESS GATES */
    document.querySelectorAll(".gateNode").forEach(gate => {

        const type = gate.dataset.type;
        const inputs = gate.querySelectorAll(".input");
        const output = gate.querySelector(".output");

        let result = 0;

        if(type === "AND"){
            result = inputs[0].value && inputs[1].value;
        }

        else if(type === "OR"){
            result = inputs[0].value || inputs[1].value;
        }

        else if(type === "NOT"){
            result = !inputs[0].value;
        }

        else if(type === "XOR"){
            result = inputs[0].value != inputs[1].value;
        }

        output.value = result ? 1 : 0;

    });

}

/* FINAL OUTPUT = LAST GATE */
let outputValue = 0;
const gates = document.querySelectorAll(".gateNode");

if(gates.length > 0){
    outputValue = gates[gates.length - 1]
        .querySelector(".output").value;
}

document.getElementById("output").innerText = outputValue;

}

/* ================= WIRES ================= */

let selectedPin = null;
const wireLayer = document.getElementById("wireLayer");

/* PIN CLICK */

document.addEventListener("click", function(e){

    if(e.target.classList.contains("pin")){

        if(!selectedPin){
            selectedPin = e.target;
            selectedPin.style.background = "yellow";
        }
        else{

            if(selectedPin.classList.contains("output") &&
               e.target.classList.contains("input")){

                drawWire(selectedPin, e.target);
            }

            selectedPin.style.background = "";
            selectedPin = null;
        }

    }

});

/* DRAW WIRE */

function drawWire(pin1, pin2){

    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("class", "wire");

    wireLayer.appendChild(line);

    wires.push({
        pin1: pin1,
        pin2: pin2,
        element: line
    });

    updateWires();
    simulate();

}

/* UPDATE WIRES */

function updateWires(){

    wires.forEach(w => {

        const rect1 = w.pin1.getBoundingClientRect();
        const rect2 = w.pin2.getBoundingClientRect();
        const workspaceRect = workspace.getBoundingClientRect();

        const x1 = rect1.left - workspaceRect.left + 5;
        const y1 = rect1.top - workspaceRect.top + 5;

        const x2 = rect2.left - workspaceRect.left + 5;
        const y2 = rect2.top - workspaceRect.top + 5;

        w.element.setAttribute("x1", x1);
        w.element.setAttribute("y1", y1);
        w.element.setAttribute("x2", x2);
        w.element.setAttribute("y2", y2);

    });

}

/* ================= MOVE GATES ================= */

let selectedGate = null;
let offsetX = 0;
let offsetY = 0;

document.addEventListener("mousedown", function(e){

    if(e.target.closest(".gateNode")){

        selectedGate = e.target.closest(".gateNode");

        const rect = selectedGate.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

    }

});

document.addEventListener("mousemove", function(e){

    if(selectedGate){

        const workspaceRect = workspace.getBoundingClientRect();

        selectedGate.style.left =
            (e.clientX - workspaceRect.left - offsetX) + "px";

        selectedGate.style.top =
            (e.clientY - workspaceRect.top - offsetY) + "px";

        updateWires();

    }

});

document.addEventListener("mouseup", function(){
    selectedGate = null;
});