(function(){
    
    
    /** Manage pointer
     * @param {String|jQuery|DomObject} obj - pointer object
     * @param {Object.<inp, out>} opt
     */
    var Pointer = window.Pointer = function(obj, opt){
        
        var   inp
            , out
            , option
            , $obj
            , convert
        ;
        
        /**
         * set transform rotate
         * @param {Number} val - input value
         */
        var setTransform = function(val){
            
            var angle = convert.getOutput(val);
            
            $obj.style.transform = 'rotate('+angle+'deg)';
            $obj.style.WebkitTransform = 'rotate('+angle+'deg)';
            out.actual = angle;
        };
        
        var _construct = function(obj, opt){
            
            var opt = opt||{};
            var oInp = opt.input||{};
            var oOut = opt.output||{};

            inp = {
                actual: typeof oInp.start === 'undefined'? oInp.min||0: oInp.start,
                min: pF(oInp.min)||0,
                max: pF(oInp.max)||100
            };
            
            out = {
                actual: typeof oOut.start === 'undefined'? oOut.min||0: oOut.start,
                min: pF(oOut.min)||0,
                max: pF(oOut.max)||360
            };
            
            out.min += 90;
            out.max += 90;
            out.actual += 90;
            
            option = {
                inf: opt.inf||false, // not work
                speed: pF(opt.speed)||0.1
            };
            
            $obj = getObj(obj);
            
            convert = new Range(
                { min: inp.min, max: inp.max }, 
                { min: out.min, max: out.max },
                true
            );
            
            // set default position
            setTransform(inp.actual);
            
            $obj.offsetHeight;
            $obj.style.transition = 'transform '+option.speed+'s linear';
            $obj.style.WebkitTransition = 'all '+option.speed+'s linear';
        };
        
        _construct.apply(this, arguments);
        
        
        /* ----- PUBLIC METHOD ----- */
        
        /**
         * Update pointer
         * @param {Number} upd - input value
         */
        this.update = function(upd){
            
            var last = option.actual;
            var act = parseFloat(upd)||0;
            
            setTransform(act);
            inp.actual = act;
        };
        
        this.getOption = function(){
            var opt = option;
            opt.out = out;
            opt.inp = inp;
            return opt;
        };
    };
    
    /**
     * Create Clock
     * @param {String|jQuery|DomObject} obj - pointer object
     * @param {Object.<pointer, pivot>} opt
     */
    var Gauge = window.Gauge = function(obj, opt){
        
        var option
            , $obj
            , $pointer
            , $pivot
            , isArrow
            , isHalf
            , pointer
            , measure
        ;
        
        var css = {
            clock: {},
            pointer: {},
            pivot: {}
        };
        
        /**
         * set option originX / originY
         * @param { String } origin - top/left/right/bottom
         */
        var setOrigin = function(origin){
            
            if(origin == 'left'|| origin == 'right'){
                option.pointer.originX = 'center';
                option.pointer.originY = 'top';
            }
            else{
                option.pointer.originX = 'top';
                option.pointer.originY = 'center';
            }
        };
        
        // make arrow by canvas - not used
        var makeArrow = function(){
            
            var $can = document.createElement('canvas');
            $can.width = option.pointer.width;
            $can.height = option.pointer.height;
            $pointer.appendChild($can);
            
            var ctx = $can.getContext('2d');
            ctx.translate(0.1,0.1)
            ctx.beginPath();
            ctx.moveTo(option.pointer.width/2, option.pointer.height);
            ctx.lineTo(0, 0);
            ctx.lineTo(option.pointer.width, 0);
            ctx.fillStyle = 'white';
            ctx.fill();
        };
        
        var generateCss = function(){
            
            // base CSS
            var clockCss = css.clock = {
                width: option.width,
                height: option.height,
                borderRadius: option.width+'px',
                position: $obj.style.position && $obj.style.position!=='static'? $obj.style.position:'relative'
            };
            
            var pointerCss = css.pointer = {
                position: 'absolute',
                transformOrigin: option.pointer.originX+' '+option.pointer.originY,
                WebkitTransformOrigin: option.pointer.originX+' '+option.pointer.originY,
                width: isArrow? 0: option.pointer.width,
                height: isArrow? 0: option.pointer.height,
                left: '50%',
                top: '50%',
                marginLeft: isArrow? -option.pointer.width: -option.pointer.width/2
            };
            
            var pivotCss = css.pivot = {
                position: 'absolute',
                width: option.pivot.width,
                height: option.pivot.height,
                top: '50%',
                left: '50%',
                marginLeft: -option.pivot.width/2,
                marginTop: -option.pivot.height/2,
                borderRadius: option.pivot.width
            };
            
            // set default style
            if(!$pivot.style.background){
                pivotCss['background'] = option.pivot.color;   
            }
            
            if(!$pointer.style.background){
                pointerCss['background'] = option.pointer.color;   
            }
            
            if($obj.style.position == 'static'){
                clockCss['position'] = 'relative';
            }
            
            // base arrow
            if(isArrow){
                pointerCss.background = 'none';
                pointerCss.borderTop = option.pointer.height+'px solid '+option.pointer.color;
                pointerCss.borderLeft = option.pointer.width+'px inset rgba(0,0,0,0)';
                pointerCss.borderRight = option.pointer.width+'px inset rgba(0,0,0,0)';
                // fix firefox aliasing
                pointerCss.outline = '1px solid transparent';
            }

            // define borderRadius
            if(isHalf){
                if(option.pointer.origin == 'top'){
                    clockCss.borderRadius = '0 0 '+option.width+'px '+option.width+'px';

                    pivotCss.top = '0%';
                    pivotCss.left = '50%';
                    
                    pointerCss.marginTop = 0;
                    pointerCss.top = 0;
                }
                else if(option.pointer.origin == 'left'){
                    clockCss.borderRadius = '0 '+option.height+'px '+option.height+'px 0';

                    pivotCss.top = '50%';
                    pivotCss.left = '0%';

                    pointerCss.left = 'initial';
                    pointerCss.marginTop = 0;
                }
                else if(option.pointer.origin == 'right'){
                    clockCss.borderRadius = option.height+'px 0 0 '+option.height+'px';

                    pivotCss.top = '50%';
                    pivotCss.left = '100%';

                    pointerCss.left = '100%';
                    pointerCss.marginTop = 0;
                }
                else{
                    clockCss.borderRadius = option.width+'px '+option.width+'px 0 0';

                    pivotCss.top = '100%';
                    pivotCss.left = '50%';
                    
                    pointerCss.marginTop = option.height/2;
                }
            }

            applyCss($obj, clockCss);
            applyCss($pointer, pointerCss);
            
            if($pivot)
                applyCss($pivot, pivotCss);
        };
        
        var _construct = function(obj, opt){
            
            var opt = opt||{};
            var oPointer = opt.pointer||{};
            var oPivot = opt.pivot||{};

            // def option
            option = {
                width: pF(opt.width)||pF(opt.height)||100,
                height: pF(opt.height)||pF(opt.width)||100,
                pointer: {
                    origin: opt.pointer.origin||'bottom',
                    originX: 'bottom',
                    originY: 'center',
                    width: pF(oPointer.width)||2,
                    height: pF(oPointer.height)||40,
                    color: oPointer.color||'white'
                },
                pivot: {
                    width: pF(oPivot.width)||10,
                    height: pF(oPivot.height)||10,
                    color: oPivot.color||'white'
                }
            };
            
            // set originX / originY
            setOrigin(option.pointer.origin);
            
            $obj = getObj(obj);
            
            $pointer = $obj.querySelector('.pointer');
            $pivot = $obj.querySelector('.pivot');

            // pointer shape arrow
            isArrow = ($pointer.classList.contains('arrow'))? true: false;
            isHalf = option.height !== option.width? true: false;
            
            generateCss();
        };
        
        _construct.apply(this, arguments);
        
        
        /* ----- PUBLIC METHOD ----- */
        
        /**
         * Get css generate
         * @return { Object.<clock, pointer, pivot }
         */
        this.getCss = function(){ 
            return css;
        };
        
        /**
         * make new Pointer
         * @param {Object} opt - option of pointer
         * @return {Class} Pointer class
         */
        this.setPointer = function(opt){
            if(!pointer){
                
                var pOption = opt||{};
                
                if(isHalf){
                    var out = pOption.output||{ min: 0, max: 180 };
                    var origin = option.pointer.origin;
                    
                    if(origin == 'top'){
                        out.min += 180;
                        out.max += 180;
                    }
                    else if(origin == 'left'){
                        out.min += 90;
                        out.max += 90;
                    }
                    else if(origin == 'right'){
                        out.min += 270;
                        out.max += 270;
                    }
                    
                    pOption.output = out;
                }
                
                pointer = new Pointer($pointer, pOption);
            }
            return pointer;
        };
        
        this.setMeasure = function(opt){
            if(!measure){
                
                var mOption = opt||{};
                mOption.width = option.width;
                mOption.height = option.height;
                
                if(pointer){
                    var pOption = pointer.getOption();
                    
                    mOption.angle = {
                        start: pOption.out.min-90,
                        end: pOption.out.max-90
                    };
                }
                
                measure = new Measure($obj, mOption);
            }
            return measure;
        };
    };
    
    /**
     * Display measure
     * @param {String|jQuery|DomObject} obj - pointer object
     * @param {Object.<pointer, pivot>} opt
     */
    var Measure = window.Measure = function(obj, opt){
    
        var $obj
            , $can
            , ctx
            , option
        ;
        
        var _construct = function(obj, opt){
            
            var opt = opt||{};
            opt.main = opt.main||{};
            opt.second = opt.second||{};
            opt.angle = opt.angle||{};
            opt.unit = opt.unit||{};
            
            option = {
                width: pF(opt.width)||pF(opt.height)||200,
                height: pF(opt.height)||pF(opt.width)||200,
                main: {
                    repeat: typeof opt.main.repeat !== 'undefined'? parseInt(opt.main.repeat): 9,
                    width: pF(opt.main.width)||3,
                    height: pF(opt.main.height)||20,
                    marge: pF(opt.main.marge)||0,
                    color: opt.main.color||'white'
                },
                second: {
                    repeat: typeof opt.second.repeat !== 'undefined'? parseInt(opt.second.repeat): 9,
                    width: pF(opt.second.width)||1,
                    height: pF(opt.second.height)||10,
                    marge: pF(opt.second.marge)||0,
                    color: opt.second.color||'grey'
                },
                angle: {
                    start: pF(opt.angle.start)||0,
                    end: pF(opt.angle.end)||360
                },
                unit: {
                    start: typeof opt.unit.start !== 'undefined'? pF(opt.unit.start):0,
                    end: typeof opt.unit.end !== 'undefined'? pF(opt.unit.end):10,
                    repeat: typeof opt.unit.repeat !== 'undefined'? parseInt(opt.unit.repeat): 9,
                    font: 'arial',
                    color: opt.unit.color||'white',
                    size: pF(opt.unit.size)||12,
                    radius: opt.unit.radius||100
                }
            };
            
            $obj = getObj(obj);
            $can = document.createElement('canvas');
            $can.width = option.width;
            $can.height = option.height;
            $obj.appendChild($can);
            
            ctx = $can.getContext('2d');
            
            drawMeasure();
            
            if(option.unit.repeat > 0)
                drawUnit();
        };
        
        /**
         * draw line
         * @param { Number } x - coord x
         * @param { Number } y - coord y
         * @param { Number } w - width
         * @param { Number } h - height
         * @param { Number } c - color
         */
        var drawLine = function(x, y, w, h, c){
            ctx.beginPath();
            ctx.strokeStyle = 
            ctx.moveTo(x, y);
            ctx.lineTo(x, y+h);
            
            ctx.lineWidth = w;
            ctx.strokeStyle = c;
            ctx.stroke();
        };
        
        // draw text
        var drawUnit = function(){
            
            var parent = document.createElement('div');
            
            var unit = option.unit;
            var parentStyle = {
                position: 'absolute',
                textAlign: 'center',
                color: unit.color,
                width: option.width,
                height: option.height,
                fontSize: unit.size,
                fontFamily: unit.font,
                top: 0,
                left: 0
            };
            applyCss(parent, parentStyle);
            
            var child;
            var childStyle = {
                position: 'absolute',
                margin: 0,
            };
            
            // angle calc
            var startAngle = option.angle.start+180;
            var rangeAngle = Math.abs(option.angle.start - option.angle.end);
            var repeat = option.unit.repeat + (rangeAngle == 360? 0: -1);
            var angle = rangeAngle/repeat;
            
            // incr unit
            var startUnit = option.unit.start;
            var rangeUnit = Math.abs(option.unit.start - option.unit.end);
            var unit = rangeUnit/(option.unit.repeat-1);
            
            for(var i=0; i<option.unit.repeat; i++){
                child = document.createElement('p');
                
                childStyle.width = option.unit.size*2;
                childStyle.left = (option.unit.radius * Math.cos(degreeToRadian(startAngle)) 
                                    + option.width/2 - option.unit.size);
                childStyle.top =  (option.unit.radius * Math.sin(degreeToRadian(startAngle)) 
                                    + option.height/2 - option.unit.size/2);
                
                applyCss(child, childStyle);
                
                child.innerHTML = startUnit;
                startUnit += (roundNumber(unit, 3)*(option.unit.start>option.unit.end?-1:1));
                
                parent.appendChild(child);
                startAngle += angle;
            }
            
            $obj.appendChild(parent);
        };
        
        // draw line
        var drawMeasure = function(){
            
            var center = {
                x: option.width/2,
                y: option.height/2
            };
            ctx.translate(center.x, center.y);
            
            var rangeAngle = option.angle.start - option.angle.end;
            var angle = Math.abs(rangeAngle/(option.main.repeat-1));
            var hasSecond = option.second.repeat > 0;
            
            if(hasSecond)
                angle = Math.abs(angle/(option.second.repeat+1));
            
            var x, y;
            for(x=0; x<option.main.repeat; x++){
                
                // first line
                drawLine(
                    0, 
                    -center.y+option.main.marge, 
                    option.main.width, 
                    option.main.height, 
                    option.main.color
                );
                
                // second line
                if(hasSecond && x+1<option.main.repeat){
                    ctx.rotate(degreeToRadian(angle));
                    
                    for(y=0; y<option.second.repeat; y++){
                        drawLine(
                            0, 
                            -center.y+option.second.marge, 
                            option.second.width, 
                            option.second.height, 
                            option.second.color
                        );
                        
                        ctx.rotate(degreeToRadian(angle));
                    }
                }
                else{
                    ctx.rotate(degreeToRadian(angle));
                }
            }
            
            if(option.angle.start != 90){
                $can.style.transform = 'rotate('+(option.angle.start-90)+'deg)';
                $can.style.WebkitTransform = 'rotate('+(option.angle.start-90)+'deg)';
            }
        };
        
         _construct.apply(this, arguments);
    };
    
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

        var px = ['borderRadius', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'left', 'top', 'right', 'bottom', 'width', 'height', 'fontSize'];

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

    /**
    * Return round number with offset
    * @param {Number} n original number
    * @param {Number} o offset
    * @returns {Number}
    */
    var roundNumber = function(n, o){
        var offset = Math.pow(10, o);
        n *= offset;
        n = Math.round(n)/offset;
        return n;
    }

    // not used
    var hasStyle = function(obj, property){
        return window.getComputedStyle(obj, null).getPropertyValue(property);  
    };

    var pF = function(val){
        return parseFloat(val);
    };

    var degreeToRadian = function(deg){
        return deg*Math.PI/180;  
    };
    
})();