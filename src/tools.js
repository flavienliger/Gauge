/** 
 * Return value between input and output
 * @constructor
 * @param {Object.<min,max>} input data
 * @param {Object.<min,max>} output data
 * @param {Boolean} [lim=true] limit
 */
var Range = function(input, output, lim){

    var   inp = input
        , out = output
        , lim = lim===false? false:true
    ;

    inp.ampl = Math.abs(inp.max-inp.min)
    out.ampl = Math.abs(out.max-out.min);

    /**
    * convert inp>out
    * @param {Number} o input value
    * @returns {Number} output value
    */
    this.getOutput = function(o){

        if(lim){
            var min = Math.min(inp.min, inp.max);
            var max = Math.max(inp.min, inp.max);
            if(o>=max || o<=min){
                o = (o>=max)? max: min; 
            }
        }
        return calcul(o, 'inp');
    };

    /**
    * convert out>inp
    * @param {Number} o output value
    * @returns {Number} input value
    */
    this.getInput = function(o){

        if(lim){
            var min = Math.min(out.min, out.max);
            var max = Math.max(out.min, out.max);
            if(o>=max || o<=min){
              o = (o>=max)? max: min; 
            }
        }
        return calcul(o, 'out');
    };


    /**
    * calcul function
    * @param {Number} o inp or out
    * @param {string} [type='inp'] 'inp' or 'out'
    * @returns {Number} inp or out
    */
    function calcul(o, type){

        var type = type||'inp'
          , oStart = o
          , first = (type==='inp')? inp:out
          , second = (type==='inp')? out:inp
        ;

        // set to zero
        var oZero = oStart-first.min;
        if(first.min>0)
            oZero *= -1;
        oZero = oZero/first.ampl;

        // retransform
        var sens = (second.max>second.min)? 1:-1;
        var val = second.ampl*oZero;
        val = second.min+(val*sens);

        return val;
    }
}



/**
 * Random
 * @param {Number} nMin
 * @param {Number} nMax
 * @return {Number} random
 */
var random = function(nMin,nMax){

    nMin = Math.round(parseInt(nMin));
    nMax = Math.round(parseInt(nMax));
    return Math.floor(nMin + (nMax+1-nMin)*Math.random());
};

/**
 * Apply object Css (equivalent to $(el).css())
 * @param {DomObject} obj
 * @param {Object} css
 */
var applyCss = function(obj, css){
    
    var px = ['borderRadius', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'left', 'top', 'right', 'bottom', 'width', 'height'];
    
    var addUnit = function(key, val){
        if(!String(val).match(/\D+$/)){
            if(px.indexOf(key) !== -1)
                val += 'px';
        }
        return val;
    };
    
    for(var key in css){ 
        obj.style[key] = addUnit(key, css[key]);
    }
};

/**
 * Return DOM object
 * @param {jQuery|DomObject|String}
 * @return {DomObject}
 */
var getObj = function(inp){
    var obj;
    
    if(inp && inp.nodeName){
        obj = inp;
    }
    else if(typeof jQuery !== 'undefined' && inp.get){
        obj = inp.get(0);   
    }
    else{
        obj = document.querySelector(inp);   
    }
    
    return obj;
};

// not used
var hasStyle = function(obj, property){
    return window.getComputedStyle(obj, null).getPropertyValue(property);  
};