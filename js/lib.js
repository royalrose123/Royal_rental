let app = {
    backstage: {},
}

app.get = function( selector ){
    return document.querySelector(selector);
}

app.createElement = function (dom, id, className, append, text, func){
    let newElement = document.createElement(dom);
    newElement.className = className;
    newElement.id = id;
    newElement.textContent = text;
    document.getElementById(append).appendChild(newElement);
    newElement.onclick = func;
}