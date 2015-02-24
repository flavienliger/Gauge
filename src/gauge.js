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
    };
    
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
                    min: typeof opt.unit.min !== 'undefined'? pF(opt.unit.min):0,
                    max: typeof opt.unit.max !== 'undefined'? pF(opt.unit.max):10,
                    repeat: typeof opt.unit.repeat !== 'undefined'? parseInt(opt.unit.repeat): 9,
                    font: 'arial',
                    size: pF(opt.unit.size)||12
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
        
        var drawLine = function(x, y, w, h, c){
            ctx.beginPath();
            ctx.strokeStyle = 
            ctx.moveTo(x, y);
            ctx.lineTo(x, y+h);
            
            ctx.lineWidth = w;
            ctx.strokeStyle = c;
            ctx.stroke();
        };
        
        var degreeToRadian = function(deg){
            return deg*Math.PI/180;  
        };
        
        var drawUnit = function(){
            
            var parent = document.createElement('div');
            parent.style.position = 'absolute';
            parent.style.width = option.width+'px';
            parent.style.height = option.height+'px';
            parent.style.top = 0;
            parent.style.left = 0;
            parent.style.color = 'white';
            
            var start = option.angle.start+180;
            var child;
            var rangeAngle = option.angle.start - option.angle.end;
            var angle = Math.abs(rangeAngle/(option.main.repeat-1));
            
            for(var i=0; i<option.unit.repeat; i++){
                child = document.createElement('p');
                child.style.position = 'absolute';
                child.style.margin = 0;
                child.style.left = (option.width/2 * Math.cos(degreeToRadian(start)) + option.width/2) + 'px';
                child.style.top =  (option.height/2 * Math.sin(degreeToRadian(start)) + option.height/2) + 'px';
                
                child.innerHTML = 'TEST';
                
                parent.appendChild(child);
                start += angle;
            }
            
            $obj.appendChild(parent);
        };
        
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
            
            if(option.angle.start != 90)
                $can.style.transform = 'rotate('+(option.angle.start-90)+'deg)';
        };
        
         _construct.apply(this, arguments);
    };
    
})();