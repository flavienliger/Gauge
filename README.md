# Gauge Library
- No deps
- Easy and light
- Use Transition / Transform
- Compatible IE10+, Chrome, Firefox

![Image of Introduction] (https://github.com/flavienliger/Gauge/raw/master/images/intro.jpg)

# Get Started

Create basic Gauge :

![Full gauge] (https://github.com/flavienliger/Gauge/raw/master/images/start.jpg)

- HTML
    ```html
    <div id="myGauge">
        <!-- pointer -->
        <div class="pointer arrow"></div>
        <!-- circle in center -->
        <div class="pivot"></div>
    </div>
    ```
    
- JS - make gauge
    ```js
    var myGauge = new Gauge('#myGauge', {
        width: 100, 
        height: 100, 
        pointer: {
            width: 3, 
            height: 40 
        }, 
        pivot: { 
            width: 10, 
            height: 10 
        }
    });
    ```
    
- JS - animate pointer
    ```js
    var myPointer = myGauge.setPointer({
        // input range (ex; for a hour of needle clock, min = 0, max = 12)
        input: {
            start: 50,
            min: 1,
            max: 100
        },
        // output range (ex; you want three quarts of circle, min = 0°, max = 270°)
        output: {
            min: 0,
            max: 360
        }
    });
    ```
    
- JS - update pointer
    ```js
    // value = input min/max
    myPointer.update(value);
    ```
    
## Option

- Gauge
    ```
    {
        width
        height
        
        pointer: {
            origin: center origin (top/left/right/bottom)
            width
            height
            color
        }
        
        pivot: {
            width
            height
            color
        }
    }
    ```

- Pointer
    ```
    {
        speed: transition in second (default 0.1)
        
        inp: {
            actual
            min
            max
        }
        
        output: {
            min
            max
        }
    }
    ```
    
## Start

- Gauge
    ```js
    new Gauge(obj, option);
    ```
    
- Pointer
    ```js
    new Pointer(obj, option);
    // equivalent
    myGauge.setPointer(option);
    ```
    
- "obj" possibility :
    ```js
    // String
    obj = '.class';
    obj = '#id';
    
    // jQuery
    obj = $('#id');
    
    // DOM
    obj = document.querySelector('#id');
    ```

## Half and Full gauge

- Half gauge
 
    ![Half Gauge] (https://github.com/flavienliger/Gauge/raw/master/images/half.jpg)

    ```js
    new Gauge('#left', {
        width: 50, 
        height: 100, 
        pointer: { 
            origin: 'left', 
            width: 3, 
            height: 40 
        }
    });
    ```
    
- Full gauge
    ```js
    new Gauge('.full-clock', {
        width: 100, 
        height: 100, 
        pointer: { 
            width: 3, 
            height: 40 
        }
    });
    ```

## Special Pointer

- Default pointer is a line

    ![Half Gauge] (https://github.com/flavienliger/Gauge/raw/master/images/line.jpg)

- Add class "arrow" for triangle

    ![Half Gauge] (https://github.com/flavienliger/Gauge/raw/master/images/arrow.jpg)

- You can make you're own pointer

    ![Half Gauge] (https://github.com/flavienliger/Gauge/raw/master/images/special.jpg)

    ```html
    <!-- html -->
    
    <div class="gauge">
        <div class="pointer">
            <div class="arrow"></div>
            <div class="line"></div>
        </div>
        <div class="pivot"></div>
    </div>
    ```
    
    ```css
    /* css */

    .gauge .pointer div.line{
        height: 90px;
        width: 8px;
        position: relative;
        background: white;
        margin-top: -50px;
        margin-left: -1px;
    }

    .gauge .pointer div.arrow {
        position: absolute;
        top: 40px;
        margin-left: -1px;

        width: 0;
        height: 0;
        background: none;

        border-top: 16px solid white;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
    }
    ```
    
    ```js
    new Gauge('.obj', {
        width: 170,
        height: 170,
        pointer: { 
            width: 5, 
            height: 65,
            color: 'none' 
        },
        pivot: { 
            width: 12, 
            height: 12 
        }
    });
    ```
    
# TODO

- Make graduation, actualy used background image.
- Gauge infinite, transition 360° -> 0°
