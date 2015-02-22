(function(){
    
    /** Manage pointer
     * @param {String|jQuery|DomObject} obj - pointer object
     * @param {Object.<inp, out>} opt
     */
    var Pointer = window.Pointer = function(obj, opt){
        
        var inp
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
            out.actual = angle;
        };
        
        var _construct = function(obj, opt){
            
            var opt = opt||{};
            var oInp = opt.input||{};
            var oOut = opt.output||{};

            inp = {
                actual: typeof oInp.start === 'undefined'? oInp.min||0: oInp.start,
                min: oInp.min||0,
                max: oInp.max||100
            };
            
            out = {
                actual: typeof oOut.start === 'undefined'? oOut.min||0: oOut.start,
                min: oOut.min||0,
                max: oOut.max||360
            };
            
            out.min += 90;
            out.max += 90;
            out.actual += 90;
            
            option = {
                inf: opt.inf||false, // not work
                speed: opt.speed||0.1
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
        
        var generateCss = function(){
            
            // base CSS
            var clockCss = css.clock = {
                width: option.width,
                height: option.height,
                borderRadius: option.width+'px'
            };

            var pointerCss = css.pointer = {
                position: 'absolute',
                transformOrigin: option.pointer.originX+' '+option.pointer.originY,
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
                pointerCss.borderLeft = option.pointer.width+'px solid transparent';
                pointerCss.borderRight = option.pointer.width+'px solid transparent';
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
                width: parseFloat(opt.width)||100,
                height: parseFloat(opt.height)||100,
                pointer: {
                    origin: opt.pointer.origin||'bottom',
                    originX: 'bottom',
                    originY: 'center',
                    width: parseFloat(oPointer.width)||2,
                    height: parseFloat(oPointer.height)||40,
                    color: oPointer.color||'white'
                },
                pivot: {
                    width: parseFloat(oPivot.width)||10,
                    height: parseFloat(oPivot.height)||10,
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
    };
    
    /* ------------------------------------ */
    /*   TOOLS FUNCTION */
    
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

})();