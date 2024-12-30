
let a=0
let b=0
let c=0
let korrektfeld=document.getElementById("korrekt")
//Zufallszahl von 0 bis 9
a=Math.floor(Math.random() * 10);
b=Math.floor(Math.random() * 10);
c=a*b
let antwort=prompt("was ist "+a+" mal "+b)
korrektfeld.innerHTML="richtig"