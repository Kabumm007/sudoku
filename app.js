

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
    

document.getElementById("start").onclick = start;

function generateNumber(zeilenarray){
    let ziffernarray=[];
    for(let i=0;i<9;i++){
        if(zeilenarray[i]){
            ziffernarray.push(i+1);
        }
    }
    return ziffernarray
}

function wuerfle(ziffernarray){
    let index=Math.floor(Math.random()*ziffernarray.length);
    return ziffernarray[index];
}
function killNumbers(zeilenarray2,field,zeile,spalte){
    let zeilenarray=zeilenarray2.slice();
    for(let i=0;i<zeile;i++){//checke lines above
        if(field[i][spalte]!==undefined){
            zeilenarray[field[i][spalte]-1]=false;
        }
    }
  
    let zeilediv3=Math.floor(zeile/3);
    let spaltendiv3=Math.floor(spalte/3);
    for(let i=zeilediv3*3;i<=zeilediv3*3+2;i++){
        for(let j=spaltendiv3*3;j<=spaltendiv3*3+2;j++){
            if(field[i][j]!==undefined){
                zeilenarray[field[i][j]-1]=false;
            }
        }
    }
    return zeilenarray;
}
async function start(){
    let docresult=document.getElementById("sudoku");
    docresult.innerHTML="";
    let field=new Array(9);
    for(let i=0;i<9;i++){
        field[i]=new Array(9);
    }

    for(let i=0;i<9;i++){//zeilen
        for(let j=0;j<9;j++){
            field[i][j]=undefined
        }
    }

    let zeilenarray=[true,true,true,true,true,true,true,true,true];
    let copyzeilenarray;
    let ziffernarray=[]

    for(let i=0;i<9;i++) {
        let valid=false;
        while(!valid){
            copyzeilenarray=zeilenarray.slice();
            for(let j=0;j<9;j++){
                let copyzeilenarraytemp=killNumbers(copyzeilenarray,field,i,j);
                ziffernarray=generateNumber(copyzeilenarraytemp);
                if(ziffernarray.length===0){
                    i=Math.floor(i/3)*3;
                    for(let i2=i;i2<=i+2;i2++){//zeilen
                        for(let j=0;j<9;j++){
                            field[i2][j]=undefined
                        }
                    }
                    valid=true;
                    break;
                  
                }
                field[i][j]=wuerfle(ziffernarray);
                copyzeilenarray[field[i][j]-1]=false;
            }
            if(valid){//we step back and start again because we hit a dead end
                i--;//because for loop will increase i
                break;
            }
            valid=true;
            for(let j=0;j<9;j++){
                if(field[i][j]===undefined) {
                    valid=false; 
                    break;
                }
            }
                
        }
    }
    for(let n=0;n<40;++n){
        let i=Math.floor(Math.random()*9);
        let j=Math.floor(Math.random()*9);
        field[i][j]=undefined;
    }
    
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            docresult.innerHTML+=field[i][j]===undefined?" ":field[i][j];	
        }
        docresult.innerHTML+="<br>";
    }



}