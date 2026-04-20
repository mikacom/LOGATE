function createGate(type,x,y){

const workspace = document.getElementById("workspace");

let gate = document.createElement("div");
gate.className = "gateNode";
gate.dataset.type = type;

gate.style.left = x + "px";
gate.style.top = y + "px";
gate.style.position = "absolute";

let svg = "";

/* GATE SHAPES */

if(type === "AND"){
svg = `
<svg width="80" height="50">
<path d="M10 5 L40 5 Q70 25 40 45 L10 45 Z"
fill="white" stroke="black" stroke-width="2"/>
</svg>
`;
}

else if(type === "OR"){
svg = `
<svg width="80" height="50">
<path d="M10 5 Q25 25 10 45 L40 45 Q70 25 40 5 Z"
fill="white" stroke="black" stroke-width="2"/>
</svg>
`;
}

else if(type === "NOT"){
svg = `
<svg width="80" height="50">
<polygon points="10,5 10,45 50,25"
fill="white" stroke="black" stroke-width="2"/>
<circle cx="55" cy="25" r="4"
stroke="black" fill="white"/>
</svg>
`;
}

else if(type === "XOR"){
svg = `
<svg width="80" height="50">
<path d="M8 5 Q20 25 8 45" stroke="black" fill="none"/>
<path d="M10 5 Q25 25 10 45 L40 45 Q70 25 40 5 Z"
fill="white" stroke="black" stroke-width="2"/>
</svg>
`;
}

gate.innerHTML = svg;

/* ADD PINS */
addPins(gate,type);

/* APPEND */
workspace.appendChild(gate);

/* ================= DRAG FIX ================= */

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

gate.addEventListener("mousedown",function(e){

isDragging = true;

/* prevent pin click interfering */
e.stopPropagation();

offsetX = e.offsetX;
offsetY = e.offsetY;

});

document.addEventListener("mousemove",function(e){

if(!isDragging) return;

const rect = workspace.getBoundingClientRect();

gate.style.left = (e.clientX - rect.left - offsetX) + "px";
gate.style.top = (e.clientY - rect.top - offsetY) + "px";

/* ⭐ THIS WAS MISSING */
if(typeof updateWires === "function"){
updateWires();
}

});

document.addEventListener("mouseup",function(){
isDragging = false;
});

}
function addPins(gate,type){

let input1 = document.createElement("div");
input1.className = "pin input";
input1.style.left = "-5px";
input1.style.top = "15px";
input1.value = 0;

let input2 = document.createElement("div");
input2.className = "pin input";
input2.style.left = "-5px";
input2.style.top = "30px";
input2.value = 0;

let output = document.createElement("div");
output.className = "pin output";
output.style.right = "-5px";
output.style.top = "22px";
output.value = 0;

gate.appendChild(input1);

if(type !== "NOT"){
gate.appendChild(input2);
}

gate.appendChild(output);

}