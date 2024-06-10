# Type 1: one `<img>` (or `<canvas>`):
```html
<div id=“main”>
    <img width="100px" height="100px" />
</div>
<input type="button" value="+" />
<input type="button" value="-" />
```


# Type 2: many `<img>` (or `<canvas>`) inside `div#wrapper`:
```html
<div id="main">
    <div id="wrapper">
        <img width="100px" height="100px" />
        <img width="100px" height="100px" />
        <img width="100px" height="100px" />
        ...
    </div>
</div>
<input type="button" value="+" />
<input type="button" value="-" />
```