

(function() {
   
    function fac(num)
    {
        var rval=1;
        for (var i = 2; i <= num; i++)
            rval = rval * i;
        return rval;
    }
    function convertDRG(val){
        switch(drg.innerHTML){
            case "RAD": return val;
            case "DEG": return val*Math.PI/180.;
            case "GRAD": return val*Math.PI/200.
        }
    }
    function invConvertDRG(val){
        switch(drg.innerHTML){
            case "RAD": return val;
            case "DEG": return val*180./Math.PI;
            case "GRAD": return val*200/Math.PI;
        }
    }
    function sin(val){     
        return Math.sin(convertDRG(val));
    }
    function cos(val){     
        return Math.cos(convertDRG(val));
    }
    function tan(val){     
        return Math.tan(convertDRG(val));
    }
    function asin(val){     
        return invConvertDRG(Math.asin(val));
    }
    function acos(val){     
        return invConvertDRG(Math.acos(val));
    }
    function atan(val){     
        return invConvertDRG(Math.atan(val));
    }
    function sinh(val){     
        return Math.sinh(val);
    }
    function cosh(val){     
        return Math.cosh(val);
    }
    function tanh(val){     
        return Math.tanh(val);
    }
    function asinh(val){     
        return Math.asinh(val);
    }
    function acosh(val){     
        return Math.acosh(val);
    }
    function atanh(val){     
        return Math.atanh(val);
    }
    function ln(val){
        return Math.log(val);
    }
    function log10(val){
        return Math.log10(val);
    }
    function sqrt(val){
        return Math.sqrt(val);
    }
    function isAlphaNumeric(str) {
        var code, i, len;
      
        for (i = 0, len = str.length; i < len; i++) {
          code = str.charCodeAt(i);
          if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
          }
        }
        return true;
      };
    function treatfac(s){
        let ret=""
        let i,j;
        for (i = 0; i < s.length; ++i) {
            
            if(s[i]=="!"){
                let bracnt=0;
                let rest="";
                for (j = i-1; j>=0; --j){
                    if(!isAlphaNumeric(s[j])){
                        if(s[j]==")") bracnt++;
                        else if(bracnt>0 && s[j]=="(") bracnt--;
                        else if(bracnt==0) break;
                    }
                    rest=s[j]+rest;
                }
                ret=ret.substring(0,j+1)+"fac("+rest+")";
                continue
            }
            ret+=s[i];
        }
        return ret;
    }
    let lastinput="";
    let sol="";
    let screen = document.querySelector('.screen');
    let buttons = document.querySelectorAll('.btn');
    let inv= document.querySelector('.btn-2nd');
    let hyp= document.querySelector('.btn-hyp');
    let drg=document.querySelector('.DRG')
    let form=document.querySelector('[name="inputform"]');
    
    form.addEventListener('submit',handle);

    function handle(event) { 
        equalButton();
    } 
  

   
    // Log initial elements
    console.log('Screen element:', screen);
    console.log('Buttons:', buttons);
    inv.className = "btn-2nd";
    hyp.className = "btn-hyp";
    buttons.forEach(function(button) {
        button.addEventListener('click', function(e) {
           
            let value=undefined;
         
            if(hyp.className == "btn-hyp-active"){
                if(inv.className == "btn-2nd") value = e.target.dataset.numh;
                else value = e.target.dataset.numh2;
            }
            if(value==undefined){
                if(inv.className == "btn-2nd") value = e.target.dataset.num;
                else value = e.target.dataset.num2;
            }

            if(value!="_HYP" && value!="_2nd") {
                inv.className = "btn-2nd";
                hyp.className = "btn-hyp";
            }
            if(!value)return;
            if(value.startsWith("_")){//put here only buttons that have one of num or num2
                switch (value) {
                    case "_DRG":
                        switch(drg.innerHTML){
                            case "2nd":
                                break;
                            case "RAD":
                                drg.innerHTML="GRAD";
                                break;
                            case "DEG":
                                drg.innerHTML="RAD";
                                break;
                            case "GRAD":
                                drg.innerHTML="DEG";
                                break;    
                        }
                        break;
                    case "_2nd":
                        break;
                    case "_HYP":
                        //alert("hyperbolicus not yet implemented")
                        break;
                    case "_DRG2":
                        alert("convert drg not yet implemented")
                        break;
                    case "_CLR":
                        clearButton();
                        break;
                    case "_BACK":
                        backButton();
                        break;
                    case "_EQ":
                        equalButton();
                        break;
                    case "_SOL":
                        const [start, end] = [screen.selectionStart, screen.selectionEnd];
                        screen.setRangeText(sol, start, end);
                        screen.selectionEnd+=sol.length;
                        screen.selectionStart=screen.selectionEnd
                        screen.focus();
                        break;
                    case "_U":
                        screen.value=lastinput;
                        screen.focus();
                        break;
                    case "_L":
                        if(screen.selectionEnd>0){
                            screen.selectionEnd--;
                            screen.selectionStart=screen.selectionEnd;
                        }
                        break;
                    case "_R":
                        if(screen.selectionEnd<screen.value.length){
                            screen.selectionEnd++;
                            screen.selectionStart=screen.selectionEnd;
                            
                        }
                        break;
                    case "_M+":
                        alert("M+");
                        break;
                    case "_M-":
                        alert("M-");
                        break;
                    case "_MC":
                        alert("MC");
                        break;
                    case "_MR":
                        alert("MR");
                        break;
                    default:
                        console.log("unimplemented "+value)
                }
                screen.focus();
                return;
            }
            console.log('Button clicked:', value); // Debug log
            if (value !== undefined) { // Ensure value is not undefined
                if((screen.value.endsWith(" ")||
                    screen.value.endsWith("(")||
                    screen.value.endsWith("*")||
                    screen.value.endsWith("/")||
                    screen.value.endsWith("+")||
                    screen.value.endsWith("-")||
                    screen.value=="") && value.startsWith(" ")) {
                        const [start, end] = [screen.selectionStart, screen.selectionEnd];
                        screen.setRangeText(value.substring(1), start, end);
                        screen.selectionEnd+=value.substring(1).length;
                        screen.selectionStart=screen.selectionEnd
                        
                        screen.focus();
                    }
                else {
                    const [start, end] = [screen.selectionStart, screen.selectionEnd];
                    screen.setRangeText(value, start, end);
                    screen.selectionEnd+=value.length;
                    screen.selectionStart=screen.selectionEnd
                    screen.focus();
                }
                console.log('Screen value:', screen.value); // Debug log
            }
        });
    });//end of buttons.forEach(function(button)
    //needs to come after the above buttons.forEach(function(button)...
    inv.addEventListener('click', function(e) {
        console.log('inv button clicked'+inv.className); // Debug log
        if(inv.className == "btn-2nd")  inv.className="btn-2nd-active";
        else inv.className="btn-2nd";
        screen.focus();
        console.log('inv button clicked'+inv.className); // Debug log
    });
    hyp.addEventListener('click', function(e) {
        console.log('hyp button clicked'+hyp.className); // Debug log
        if(hyp.className == "btn-hyp")  hyp.className="btn-hyp-active";
        else hyp.className="btn-hyp";
        screen.focus();
    });
    function equalButton(iter) {
        if(iter===undefined) iter=0;
       
        console.log('Equal button clicked'); // Debug log
        if (screen.value === '') {
            screen.value = "Please use buttons or keyboard";
            screen.focus();
            screen.select();
        } else {
            try {
                //screen.value=screen.value.replaceAll(" ","*");
                //replace all functions by lowercase;
                screen.value=screen.value.replace(/sin/ig, 'sin')
                screen.value=screen.value.replace(/cos/ig, 'cos')
                screen.value=screen.value.replace(/tan/ig, 'tan')
                screen.value=screen.value.replace(/asin/ig, 'asin')
                screen.value=screen.value.replace(/acos/ig, 'acos')
                screen.value=screen.value.replace(/atan/ig, 'atan')
                screen.value=screen.value.replace(/sinh/ig, 'sinh')
                screen.value=screen.value.replace(/cosh/ig, 'cosh')
                screen.value=screen.value.replace(/tanh/ig, 'tanh')
                screen.value=screen.value.replace(/asinh/ig, 'asinh')
                screen.value=screen.value.replace(/acosh/ig, 'acosh')
                screen.value=screen.value.replace(/atanh/ig, 'atanh')
                screen.value=screen.value.replace(/ln/ig, 'ln')
                screen.value=screen.value.replace(/log/ig, 'log')
                screen.value=screen.value.replace(/sqrt/ig, 'sqrt')
                
                //replace % by e-2
                screen.value=screen.value.replace(/\%/g, 'e-2')
                //erase beggining and trailing spaces
                screen.value=screen.value.replace(/^\s+|\s+$/g, '')
                //erase double spaces
                screen.value=screen.value.replace(/\s{2,}/g, " ");
                //erase spaces before closing brackets
                screen.value=screen.value.replace(/\s\)/g, ')')
                //erase spaces before closing brackets
                screen.value=screen.value.replace(/\(\s/g, '(')
                //erase spaces before and after trigonometric expressiones
                screen.value=screen.value.replace(/\s*\*\s*/g, '*')
                screen.value=screen.value.replace(/\s*\/\s*/g, '/')
                screen.value=screen.value.replace(/\s*\+\s*/g, '+')
                screen.value=screen.value.replace(/\s*-\s*/g, '-')
                screen.value=screen.value.replace(/\s*\!/g, '!')
                //replace spaces with *
                screen.value=screen.value.replace(/\s+/g, '*');
                screen.value=screen.value.replace(/\^/g, '**')
                lastinput=screen.value;
                screen.value=treatfac(screen.value)
                console.log("cleaned formula:"+screen.value);
                let answer = eval(`
                    s=1;
                    m=1;
                    kg=1;
                    A=1;
                    mol=1;
                    K=1;
                    cd=1;

                    N=kg*m/s**2;
                    Hz=1/s;
                    Pa=N/m**2;
                    J=N*m;
                    W=J/s;

                    C=A*s;
                    V=W/A;
                    F=C/V;
                    Ohm=V/A;
                    S=A/V;

                    Wb=V*s;
                    T=Wb/m**2;
                    H=Wb/A;
                    lm=cd;
                    lx=lm/m**2;
                    Bq=1/s;
                    Gy=J/kg;
                    Sv=J/kg;
                    kat=mol/s;

                    pi=Math.PI;
                    E=Math.E;
                    c=299792458*m/s;
                    h=6.62607015e-34*J*s;
                    hb=h/2/pi;
                    kb=1.380649e-23*J/K;
                    G=6.67430e-11*m**3/kg/s**2;
                    sigma=pi**2*kb**4/(60*hb**3*c**2);
                    e=1.602176634e-19*C;
                    alpha=0.0072973525643;
                    m0=4*pi*alpha*hb/(e**2*c);
                    e0=e**2/(4*pi*alpha*hb*c);
                    me=9.1093837139e-31*kg;
                    mp=1.67262192595e-27*kg;
                    mn=1.67492750056e-27*kg;
                    a0=hb/(alpha*me*c);
                    Ryd=alpha**2*me*c/(2*h);
                    Na=6.02214076e23/mol;
                    u=1.66053906892e-27*kg;
                `+screen.value);
                screen.value = answer;
                sol=screen.value;
                console.log('Calculation result:', answer); // Debug log
                return true;
            } catch (error) {
                screen.value+=")";
                if (iter <10) {
                    if(equalButton(iter+1)) return true;
                }
                screen.value = "Error"+error;
                screen.focus();
                screen.select();
                console.log('Calculation error:', error); // Debug log
            }
        }
        screen.focus();
    };

  
    function clearButton() {
        console.log('Clear button clicked'); // Debug log
        screen.value = "";
        screen.focus();
    }
  
   function backButton()  {
        console.log('back button clicked'); // Debug log
        const [start, end] = [screen.selectionStart, screen.selectionEnd];
        screen.setRangeText("", start-1, end);
        screen.focus();
    }
})();
