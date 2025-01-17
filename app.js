

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


document.getElementById("start").onclick = start;
document.getElementById("solve").onclick = solve;

function generateNumber(zeilenarray) {
    let ziffernarray = [];
    for (let i = 0; i < 9; i++) {
        if (zeilenarray[i]) {
            ziffernarray.push(i + 1);
        }
    }
    return ziffernarray
}

function wuerfle(ziffernarray) {
    let index = Math.floor(Math.random() * ziffernarray.length);
    return ziffernarray[index];
}
function killNumbers(zeilenarray2, field, zeile, spalte) {
    let zeilenarray = zeilenarray2.slice();
    for (let i = 0; i < zeile; i++) {//checke lines above
        if (field[i][spalte] !== undefined) {
            zeilenarray[field[i][spalte] - 1] = false;
        }
    }

    let zeilediv3 = Math.floor(zeile / 3);
    let spaltendiv3 = Math.floor(spalte / 3);
    for (let i = zeilediv3 * 3; i <= zeilediv3 * 3 + 2; i++) {
        for (let j = spaltendiv3 * 3; j <= spaltendiv3 * 3 + 2; j++) {
            if (field[i][j] !== undefined) {
                zeilenarray[field[i][j] - 1] = false;
            }
        }
    }
    return zeilenarray;
}
var field;
async function start() {
    document.getElementById("info").innerHTML = "";
    let docresult = document.getElementById("sudoku");
    docresult.innerHTML = "";
    field = new Array(9);
    for (let i = 0; i < 9; i++) {
        field[i] = new Array(9);
    }

    for (let i = 0; i < 9; i++) {//zeilen
        for (let j = 0; j < 9; j++) {
            field[i][j] = undefined
        }
    }

    let zeilenarray = [true, true, true, true, true, true, true, true, true];
    let copyzeilenarray;
    let ziffernarray = []

    for (let i = 0; i < 9; i++) {
        let valid = false;
        while (!valid) {
            copyzeilenarray = zeilenarray.slice();
            for (let j = 0; j < 9; j++) {
                let copyzeilenarraytemp = killNumbers(copyzeilenarray, field, i, j);
                ziffernarray = generateNumber(copyzeilenarraytemp);
                if (ziffernarray.length === 0) {
                    i = Math.floor(i / 3) * 3;
                    for (let i2 = i; i2 <= i + 2; i2++) {//zeilen
                        for (let j = 0; j < 9; j++) {
                            field[i2][j] = undefined
                        }
                    }
                    valid = true;
                    break;

                }
                field[i][j] = wuerfle(ziffernarray);
                copyzeilenarray[field[i][j] - 1] = false;
            }
            if (valid) {//we step back and start again because we hit a dead end
                i--;//because for loop will increase i
                break;
            }
            valid = true;
            for (let j = 0; j < 9; j++) {
                if (field[i][j] === undefined) {
                    valid = false;
                    break;
                }
            }

        }
    }
    for (let n = 0; n < 40; ++n) {
        let i = Math.floor(Math.random() * 9);
        let j = Math.floor(Math.random() * 9);
        field[i][j] = undefined;
    }
    let html = "";
    for (let i = 0; i < 9; i++) {
        html += "<tr>";
        for (let j = 0; j < 9; j++) {
            let inputfield = "<input id='" + (j + 1) + "_" + (i + 1) + "' type='number' min='1' max='9'>"
            html += "<td>" + (field[i][j] === undefined ? inputfield : field[i][j]) + "</td>";
        }
        html += "</tr>";

    }
    docresult.innerHTML = html;
}

class Item {
    constructor(name, llink, rlink) {
        this.name = name;
        this.llink = llink;
        this.rlink = rlink;
    }
}

class Option {
    constructor(top, ulink, dlink) {
        this.top = top;
        this.ulink = ulink;
        this.dlink = dlink;
    }
}



class DancingLinks {
    constructor() {
        this.optionArrays = [];
        this.items = [new Item("", 0, 0)]
        this.itemMap = new Map();
        this.options = [new Option(0, 0, 0), new Option(0, 0, 0)];
        this.currentoptionstart = 0;
        this.spacercnt = 0;
        this.forcecnt = 0;
    }
    pushItem(itemName) {
        if (this.itemMap.has(itemName)) {
            console.error("Item already exists");
            return false;
        }
        this.itemMap.set(itemName, { "cnt": 0, "index": this.items.length });
        let item = new Item(itemName, this.items.length - 1, 0);
        this.items[this.items.length - 1].rlink = this.items.length;
        this.items[0].llink = this.items.length
        this.items.push(item);
        let option = this.options[this.options.length - 1];
        option.top = 0;
        option.ulink = this.options.length - 1;
        option.dlink = this.options.length - 1;
        this.options.push(new Option(0, 0, 0));
        return true;
    }
    _modSpacer(optionarraylength) {
        let option = this.options[this.options.length - 1];
        this.currentoptionstart = this.options.length;
        option.dlink = this.currentoptionstart + optionarraylength - 1;
    }
    _addSpacer() {
        this.spacercnt--;
        this.options.push(new Option(this.spacercnt, this.currentoptionstart, 0));
    }
    _addNode(itemnum) {
        let lastopt = this.options[this.options[itemnum].ulink];
        this.options.push(new Option(itemnum, this.options[itemnum].ulink, itemnum));//add node into circular linked list
        lastopt.dlink = this.options.length - 1;
        this.options[itemnum].ulink = this.options.length - 1;
    }
    _cover(itemnum) {
        let p = this.options[itemnum].dlink;
        while (p !== itemnum) {
            this._hide(p);
            p = this.options[p].dlink;
        }
        let l = this.items[itemnum].llink;
        let r = this.items[itemnum].rlink;
        this.items[l].rlink = r;
        this.items[r].llink = l;
    }
    _reorderItemsAfterDec(i) {//for sudoku this gives typically a factor of 2 speedup
      //  return;
        if(this.items[i].llink===0) return;
        /*
        console.log("reorderItems "+i+" "+this.items[i].name+"ll"+this.items[i].llink);
        
        let s="";
        for(let j=this.items[0].rlink;j!==0;j=this.items[j].rlink){
            if(j>=this.items.length){ console.error("!!!"+j)  }
            s+=this.items[j].name;
            s+="("+this.options[j].top+")";
        }
        console.log(s);
        */
        let j=this.items[i].llink;
        if(this.options[i].top>=this.options[j].top) return;
        while(true){
            if(this.options[i].top<this.options[j].top && j!==0){
                j=this.items[j].llink;
            }else{
                this._swap(i,this.items[j].rlink,this.items.length);
                break;
            }
        }
       // for(let j=this.items[0].rlink;this.items[j].rlink!==0;j=this.items[j].rlink){
        //    if(this.items[j].top>this.items[this.items[j].rlink].top) console.error("!!!"+j);
       // }
        /*
                s="";
        for(let j=this.items[0].rlink;j!==0;j=this.items[j].rlink){
            s+=this.items[j].name;
            s+="("+this.options[j].top+")";
        }
        console.log(s);
        */
    }
    _reorderItemsAfterInc(i) {//for sudoku this gives typically a factor of 2 speedup
        //  return;
          if(this.items[i].llink===0) return;
          /*
          console.log("reorderItems "+i+" "+this.items[i].name+"ll"+this.items[i].llink);
          
          let s="";
          for(let j=this.items[0].rlink;j!==0;j=this.items[j].rlink){
              if(j>=this.items.length){ console.error("!!!"+j)  }
              s+=this.items[j].name;
              s+="("+this.options[j].top+")";
          }
          console.log(s);
          */
          let j=this.items[i].rlink;
          if(this.options[i].top<=this.options[j].top) return;
          while(true){
              if(this.options[i].top>this.options[j].top && j!==0){
                  j=this.items[j].rlink;
              }else{
                  this._swap(i,this.items[j].llink,this.items.length);
                  break;
              }
          }
          /*
                  s="";
        */

         // for(let j=this.items[0].rlink;this.items[j].rlink!==0;j=this.items[j].rlink){
          //    if(this.items[j].top>this.items[this.items[j].rlink].top) console.error("!!!"+j);
         // }
         
          
      }
    _hide(optionnum) {
        let q = optionnum + 1;
        while (q !== optionnum) {
            let x = this.options[q].top;
            let u = this.options[q].ulink;
            let d = this.options[q].dlink;
            if (x <= 0) {//q was a spacer
                q = u;
            } else {
                this.options[u].dlink = d;
                this.options[d].ulink = u;
                this.options[x].top--;//decrement length of column
                this._reorderItemsAfterDec(x);
                q++;
            }
        }
    }
    _uncover(itemnum) {
        let l = this.items[itemnum].llink;
        let r = this.items[l].rlink;//this needs to be done instead of this.items[itemnum].rlink because we might have swapped items
        this.items[l].rlink = itemnum;
        this.items[r].llink = itemnum;
        this.items[itemnum].rlink=r;
        let p = this.options[itemnum].ulink;
        while (p !== itemnum) {
            this._unhide(p);
            p = this.options[p].ulink;
        }
    }
    _unhide(optionnum) {
        let q = optionnum - 1;
        while (q !== optionnum) {
            let x = this.options[q].top;
            let u = this.options[q].ulink;
            let d = this.options[q].dlink;
            if (x <= 0) {//q was a spacer
                q = d;
            } else {
                this.options[u].dlink = q;
                this.options[d].ulink = q;
                this.options[x].top++;//increment length of column
                this._reorderItemsAfterInc(x);
                q--;
            }
        }
    }
    _swap(i,j,len){
        if(i===j) return;
        // (i-1).rlink=i, i.llink=i-1, i.rlink=i+1, (i+1).llink=i,   (j-1).rlink=j, j.llink=j-1, j.rlink=j+1, (j+1).llink=j. 
        // (i-1).rlink=j, j.llink=i-1, j.rlink=i+1, (i+1).llink=j,   (j-1).rlink=i, i.llink=j-1, i.rlink=j+1, (j+1).llink=i.
        let il=this.items[i].llink;
        let ir=this.items[i].rlink;
        let jl=this.items[j].llink;
        let jr=this.items[j].rlink
        if(ir==j){
            this.items[il].rlink=j;
            this.items[j].llink=il;
            this.items[j].rlink=i;
            this.items[i].llink=j; 
            this.items[i].rlink=jr; 
            this.items[jr].llink=i;
        }else if(il==j){
            this.items[jl].rlink=i;
            this.items[i].llink=jl;
            this.items[i].rlink=j;
            this.items[j].llink=i;
            this.items[j].rlink=ir;
            this.items[ir].llink=j;
        }else{
            this.items[il].rlink=j;
            this.items[j].llink=il;
            this.items[j].rlink=ir;
            this.items[ir].llink=j;

            this.items[jl].rlink=i;
            this.items[i].llink=jl;
            this.items[i].rlink=jr;
            this.items[jr].llink=i;
        }
    }
    _minimalRemainingOptionsHeuristic() {
        //choose item with minimal length
        //if multiple items have the same length, choose the first one
        let min = Number.MAX_SAFE_INTEGER;
        let minitem = 0;
        let p = this.items[0].rlink;
        while (p !== 0) {
            if (this.options[p].top < min) {
                min = this.options[p].top;
                minitem = p;
            }
            p = this.items[p].rlink;
        }
        return minitem;
    }
    _printSolution(x, l) {
        let solution = [];
        for (let i = 0; i <= l; i++) {
            let s1 = "";
            let s2 =""
            let j=x[i];
            let dos2=true;
            do{
                if(dos2) s2 += this.items[this.options[j].top].name;
                else s1 += this.items[this.options[j].top].name;
                ++j;
                if(this.options[j].top<0){
                    j=this.options[j].ulink;
                    dos2=false;
                }
            }while(j!=x[i]);
            solution.push(s1+s2);
        }
        return solution;
    }
    _scrambleItems() {
        for(let i=0;i<this.items.length;i++){
            this._swap(i,Math.floor(Math.random()*this.items.length),this.items.length);
        }
    }

    solve() {//algorithm X: D. Knuth The Art of Computer Programming, Vol 4b, p69, Addison-Wesley, 2011
        this.finalizeOptions();
        let iter=0;
       // this._scrambleItems(); //check if order is not important
        let x = new Array(this.items.length).fill(0),sol = [];
        for (let l = 0, lmin=0, dir = 1, i, j, p;
            l >= lmin;
            ((dir > 0) && (l < this.forcecnt)) && ++lmin,//short circuit increment needed for forced options
            l += dir
        ) {              
            iter++;                           //X1: initialize	
            if (dir > 0) {                          //X2: enter level l
                if (this.items[0].rlink === 0) {
                    sol.push(this._printSolution(x, l - 1));
                    dir = -1;
                    continue;//X8,X6
                }
                /*i=0;
                while(1){//this works if we do not shuffle or reorder
                    i = this.items[i].rlink;            //x3: choose item //this._minimalRemainingOptionsHeuristic();
                    if(Math.random()<0.5) break;
                    if(i===0) {
                        i=this.items[i].rlink; 
                        break;
                    }
                }
                
                console.log("cover"+i)
                */
                i = this.items[0].rlink; //this works if we do not shuffle or reorder
                
                this._cover(i);                     //x4: cover item
                x[l] = this.options[i].dlink;
            } else {                                //dir<0 then X6: Try again
                p = x[l] - 1;
                while (p !== x[l]) {
                    j = this.options[p].top;
                    if (j <= 0) p = this.options[p].dlink; //p is a spacer
                    else {
                        this._uncover(j);
                        p--;
                    }
                }
                i = this.options[x[l]].top;
                x[l] = this.options[x[l]].dlink;
            }
            if (x[l] === i) {                       //x5: try x[l]
                this._uncover(i);                   //x7: backtrack
                dir = -1;
                continue;
            } else {                                //x5...
                p = x[l] + 1;
//                console.log(p)//we are hanging here if we do not order the items or if we reorder
                while (p !== x[l]) {
                    j = this.options[p].top;
                    if (j <= 0) p = this.options[p].ulink;//p is a spacer
                    else {
                        this._cover(j);
                        p++;
                    }
                }
                dir = 1;
                continue;
            }
        }
        console.log("iter:"+iter);
        return sol;
    }
    setOption(optionArray, force = false) {
        optionArray.forEach((option) => {
            if (!this.itemMap.has(option)) {
                console.error("Item " + option + " does not exist!");
                return false;
            }
            if (force) {
                if (this.itemMap.get(option).cnt < 0) {
                    console.error("Item " + option + " is already forced!");
                    return false;
                }
            }
        });
        optionArray.forEach((option) => {
            if (force) this.itemMap.get(option).cnt--;
            else if (this.itemMap.get(option).cnt >= 0) this.itemMap.get(option).cnt++;
        });
        if (force) this.optionArrays.unshift(optionArray.slice());
        else this.optionArrays.push(optionArray.slice())
        if (force) this.forcecnt++;
    }
    
    finalizeOptions() {
        this.optimizeTable();
        this.optionArrays.forEach((optionArray) => {
            this._modSpacer(optionArray.length);
            let itemnumArr = [];
            optionArray.forEach((option) => {
                let itemnum=this.itemMap.get(option).index;
                this._addNode(itemnum);
                this.options[itemnum].top++;
            });
            this._addSpacer();
        });
        return true;
    }
    
    /*
    finalizeOptions2() {
        this.optimizeTable();
        this.optionArrays.forEach((optionArray) => {
            this._modSpacer(optionArray.length);
            let itemnumArr = [];
            optionArray.forEach((option) => {
                itemnumArr.push(this.itemMap.get(option).index);
            });
            itemnumArr.sort((a, b) => a - b);
            itemnumArr.forEach((itemnum) => {
                this._addNode(itemnum);
                this.options[itemnum].top++;
            });
            this._addSpacer();
        });
        return true;
    }
    */
    optimizeTable() {
        this.spacercnt = 0;
        this.currentoptionstart = 0;
        //sort items by cnt
        let arr = [...this.itemMap.entries()].sort((a, b) => a[1].cnt - b[1].cnt)
        this.itemMap = new Map(arr.map((obj, index) => [obj[0], { "cnt": obj[1].cnt, "index": index + 1 }]));
        //
        this.options = this.options.slice(0, this.items.length + 1);
        this.itemMap.forEach((value, key) => {
            this.items[value.index].name = key;
            this.options[value.index].top = Math.abs(value.cnt);
            this.options[value.index].ulink = value.index;
            this.options[value.index].dlink = value.index;
        });
    }
};



class SudokuSolver {
    constructor() {
        this.dl = new DancingLinks();
        this.generateItems();
        this.generateOptions();
        this.inputField(field);
    }
    generateItems() {
        for (let y = 1; y <= 9; ++y) {
            for (let x = 1; x <= 9; x++) {
                this.dl.pushItem("f" + x + "_" + y);
            }
        }
        for (let x = 1; x <= 9; ++x) {
            for (let n = 1; n <= 9; n++) {
                this.dl.pushItem("c" + x + "#" + n);
            }
        }
        for (let y = 1; y <= 9; y++) {
            for (let n = 1; n <= 9; n++) {
                this.dl.pushItem("r" + y + "#" + n);
            }
        }
        for (let i = 1; i <= 9; i++) {
            for (let n = 1; n <= 9; n++) {
                this.dl.pushItem("b" + i + "#" + n);
            }
        }
    }
    optionEntry(x, y, n) {
        return ["f" + x + "_" + y, "c" + x + "#" + n, "r" + y + "#" + n, "b" + (Math.floor((y - 1) / 3) * 3 + Math.floor((x - 1) / 3) + 1) + "#" + n]
    }
    generateOptions() {
        for (let x = 1; x <= 9; x++) {
            for (let y = 1; y <= 9; y++) {
                for (let n = 1; n <= 9; n++) {
                    this.dl.setOption(this.optionEntry(x, y, n));
                }
            }
        }
    }
    inputField(field) {
        let opt = [];
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (field[y][x] !== undefined) {
                    opt.push(...this.optionEntry(x + 1, y + 1, field[y][x]));
                }
            }
        }
        this.dl.setOption(opt, true);
    }
    solve() {
        return this.dl.solve();
    }
}
var ss;
let cnt = 0;
function solve() {
    ss = new SudokuSolver();

    let sol = ss.solve();
    console.log("solutions: " + sol.length)
    document.getElementById("info").innerHTML = "Solutions: " + sol.length;
    let solnr = cnt % sol.length;
    cnt++;
    for (i = 1; i < sol[solnr].length; i++) {
        //console.log(sol[solnr][i]);
        //console.log(sol[solnr][i][1] + " " + sol[solnr][i][3] + " " + sol[solnr][i][7]);
        document.getElementById(sol[solnr][i][1] + "_" + sol[solnr][i][3]).value = sol[solnr][i][7];
    }
    //
}
let dl = new DancingLinks();
function test(){
    while(true){
        start();
        solve()
    }
}
/*
dl.pushItem("e");
dl.pushItem("a");
dl.pushItem("b");
dl.pushItem("c");
dl.pushItem("d");
dl.pushItem("f");
dl.pushItem("g");
dl.pushItem("h");

dl.setOption(["e"]);
dl.setOption(["c","e"]);
dl.setOption(["a","d","g"]);
dl.setOption(["b","c","f"]);
dl.setOption(["a","d","f"]);
dl.setOption(["b","g"]);
dl.setOption(["d","e","g"]);

dl.setOption(["f"]);
dl.setOption(["h"]);
dl.setOption(["h","e"]);
*/


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




