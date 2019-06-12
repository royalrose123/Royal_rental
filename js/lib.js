let app = {
    backstage: {},
    log: {},
    member: {},
    rental: {},
    edit: {},
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

function setThousandDigit(num){
    num = num.toString();
    let count = 0;
    let newNum = "";
    for(let i = num.length - 1; i >= 0; i--){
        count++;
        newNum += num[i];
        if(count >= 3){
            newNum += ","
            count = 0;
        }
    }
    newNum = newNum.split("").reverse().join("")
    if(newNum[0] === ",") newNum = newNum.substr(1)
    return newNum
}

function setPhoneSeparate(phone){
    phone = phone.toString();
    let count = 0;
    let newPhone = "";
    for(let i = phone.length - 1; i >= 0; i--){
        count++;
        newPhone += phone[i];
        if(i >= 4){
            if(count >= 3){
                newPhone += "-"
                count = 0;
            }
        }
        
    }
    newPhone = newPhone.split("").reverse().join("")
    if(newPhone[0] === "-") newPhone = "0" + newPhone.substr(1)
    return newPhone
}

// console.log(setPhoneSeparate(0919957281))