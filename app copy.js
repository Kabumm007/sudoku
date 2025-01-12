

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
    let html="";
    for(let i=0;i<9;i++){
        html += "<tr>";
        for(let j=0;j<9;j++){
            let inputfield="<input type='number' min='1' max='9'>"
            html+="<td>"+(field[i][j]===undefined?inputfield:field[i][j])+"</td>";	
        }
        html += "</tr>";
        
    }
    docresult.innerHTML=html;
}

class Item{
    constructor(name,llink,rlink){
        this.name=name;
        this.llink=llink;
        this.rlink=rlink;
    }
}

class Option{
    constructor(top,ulink,dlink){
        this.top=top;
        this.ulink=ulink;
        this.dlink=dlink;
    }
}



class DancingLinks{
    constructor(){
        this.items=[new Item("",0,0)]
        this.itemMap=new Map();
        this.options=[new Option(0,0,0),new Option(0,0,0)];
        this.currentoptionstart=0;
        this.spacercnt=0;
    }
    pushItem(itemName){
        if(this.itemMap.has(itemName)){
            console.error("Item already exists");
            return false;
        }
        this.itemMap.set(itemName,this.items.length);
        let item=new Item(itemName,this.items.length-1,0);
        this.items[this.items.length-1].rlink=this.items.length;
        this.items[0].llink=this.items.length
        this.items.push(item);
        let option=this.options[this.options.length-1];
        option.top=0;
        option.ulink=this.options.length-1;
        option.dlink=this.options.length-1;
        this.options.push(new Option(0,0,0));
        return true;
    }
    _modSpacer(optionarraylength){
        let option=this.options[this.options.length-1];
        this.currentoptionstart=this.options.length;
        option.dlink=this.currentoptionstart+optionarraylength-1;
    }
    _addSpacer(){
        this.spacercnt--;
        this.options.push(new Option(this.spacercnt,this.currentoptionstart,0));
    }
    _addNode(itemnum){
        let lastopt=this.options[this.options[itemnum].ulink];
        this.options.push(new Option(itemnum,this.options[itemnum].ulink,itemnum));//add node into circular linked list
        lastopt.dlink=this.options.length-1;
        this.options[itemnum].ulink=this.options.length-1;
    }
    _cover(itemnum){
        let p=this.options[itemnum].dlink;
        while(p!==itemnum){
            this._hide(p);
            p=this.options[p].dlink;
        } 
        let l=this.items[itemnum].llink;
        let r=this.items[itemnum].rlink;
        this.items[l].rlink=r;
        this.items[r].llink=l;
    }
    _hide(optionnum){
        let q=optionnum+1;
        while(q!==optionnum){
            let x=this.options[q].top;
            let u=this.options[q].ulink;
            let d=this.options[q].dlink;
            if(x<=0){//q was a spacer
                q=u;
            }else{
                this.options[u].dlink=d;
                this.options[d].ulink=u;
                this.options[x].top--;//decrement length of column
                q++;
            }
        }
    }
    _uncover(itemnum){
        let l=this.items[itemnum].llink;
        let r=this.items[itemnum].rlink;
        this.items[l].rlink=itemnum;
        this.items[r].llink=itemnum;
        let p=this.options[itemnum].ulink;
        while(p!==itemnum){
            this._unhide(p);
            p=this.options[p].ulink;
        }
    }
    _unhide(optionnum){
        let q=optionnum-1;
        while(q!==optionnum){
            let x=this.options[q].top;
            let u=this.options[q].ulink;
            let d=this.options[q].dlink;
            if(x<=0){//q was a spacer
                q=d;
            }else{
                this.options[u].dlink=q;
                this.options[d].ulink=q;
                this.options[x].top++;//increment length of column
                q--;
            }
        }
    }
    _minimalRemainingOptionsHeuristic(){
        //choose item with minimal length
        //if multiple items have the same length, choose the first one
        let min=Number.MAX_SAFE_INTEGER;
        let minitem=0;
        let p=this.items[0].rlink;
        while(p!==0){
            if(this.options[p].top<min){
                min=this.options[p].top;
                minitem=p;
            }
            p=this.items[p].rlink;
        }
        return minitem;
    }
    _printSolution(x,l){
        let solution=[];
        for(let i=0;i<=l;i++){
            let s="";
            for(let j=x[i];this.options[j].top>0;++j){
                s+=this.items[this.options[j].top].name;
            }
            solution.push(s);
        }
        console.log(solution);
    }
    solve(){//algorithm X: D. Knuth The Art of Computer Programming, Vol 4b, p69, Addison-Wesley, 2011
        let x=new Array(this.items.length).fill(0);
        //X1:Initialize
        for(let l=0,dir=1,i,j,p;l>=0;l+=dir){//X1: initialize
            if(dir>0){
                //X2: enter level l
                if(this.items[0].rlink===0){
                    this._printSolution(x,l-1);
                    dir=-1;
                    continue;//X8,X6
                }
                //x3: choose item
                i=this.items[0].rlink;//this._minimalRemainingOptionsHeuristic();
                //x4: cover item
                this._cover(i);
                console.log("cover"+i);
                x[l]=this.options[i].dlink;
            }else{//dir<0
                //X6: Try again
                p=x[l]-1;
                while(p!==x[l]){
                    j=this.options[p].top;
                    if(j<=0){//p is a spacer
                        p=this.options[p].dlink;
                    }else{
                        console.log("X6: uncover"+j+""+l);
                        this._uncover(j);
                        p--;
                    }
                }
                i=this.options[x[l]].top;
                x[l]=this.options[x[l]].dlink;
            }
            //x5: try x[l]
            if(x[l]===i){
                //x7: backtrack
                console.log("X7 uncover"+i+""+l);
                this._uncover(i);   
                dir=-1;
                continue;
            }else{//x5...
                p=x[l]+1;
                while(p!==x[l]){
                    j=this.options[p].top;
                    if(j<=0){//p is a spacer
                        p=this.options[p].ulink;
                    }else{
                        console.log("X5 cover"+i+""+l);
                        this._cover(j);
                        p++;
                    }
                }
                dir=1;
                continue;
            }

        }

    }
    setOption(optionArray){
        optionArray.forEach((option)=>{
            if(!this.itemMap.has(option)){
                console.error("Item "+option+" does not exist!");
                return false;
            }
        });
        this._modSpacer(optionArray.length);
        optionArray.forEach((option)=>{
            let itemnum=this.itemMap.get(option);
            this._addNode(itemnum);
            this.options[itemnum].top++;
        });
        this._addSpacer();
        return true;
    }

}

let dl=new DancingLinks();

dl.pushItem("e");
dl.pushItem("a");
dl.pushItem("b");
dl.pushItem("c");
dl.pushItem("d");
dl.pushItem("f");
dl.pushItem("g");

dl.setOption(["e"]);
dl.setOption(["c","e"]);
dl.setOption(["a","d","g"]);
dl.setOption(["b","c","f"]);
dl.setOption(["a","d","f"]);
dl.setOption(["b","g"]);
dl.setOption(["d","e","g"]);

dl.setOption(["f"]);
/*

dl.pushItem("a");
dl.pushItem("b");
dl.pushItem("c");
dl.pushItem("d");
dl.pushItem("e");
dl.pushItem("f");
dl.pushItem("g");


dl.setOption(["c","e"]);
dl.setOption(["a","d","g"]);
dl.setOption(["b","c","f"]);
dl.setOption(["a","d","f"]);
dl.setOption(["b","g"]);
dl.setOption(["d","e","g"]);
dl.setOption(["e"]);
dl.setOption(["f"]);
*/
console.log(dl.options)


