fetch("data.json").then(r=>r.json()).then(data=>{
document.getElementById("target").innerText=data.kpis.target;
document.getElementById("actual").innerText=data.kpis.actual;
document.getElementById("achievement").innerText=data.kpis.achievement+"%";

let filter=document.getElementById("stateFilter");
data.states.forEach(s=>{
filter.innerHTML+=`<option>${s.name}</option>`;
});

function render(val="All States"){
let tb=document.getElementById("tableBody");
tb.innerHTML="";
let rows=data.states.filter(x=>val=="All States"||x.name==val);

rows.forEach(s=>{
tb.innerHTML+=`<tr><td><b>${s.name}</b></td><td>${s.sales}</td></tr>`;
s.children.forEach(c=>{
tb.innerHTML+=`<tr><td class='child'>↳ ${c.name}</td><td>${c.sales}</td></tr>`;
})
})
}
render();

filter.onchange=(e)=>render(e.target.value)
});