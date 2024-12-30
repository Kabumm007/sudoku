

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
    
(async ()=>{
    let a=0
    let b=0
    let c=0
    let korrektfeld=document.getElementById("korrekt")
    //Zufallszahl von 0 bis 9
    while(true){
        a=Math.floor(Math.random() * 10);
        b=Math.floor(Math.random() * 10);
        c=a*b
        let antwort=prompt("was ist "+a+" mal "+b)
        if(c==antwort) korrektfeld.innerHTML="richtig"
        else  korrektfeld.innerHTML="falsch"
        await Sleep(1000)
    }
})()