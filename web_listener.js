(function() {
let events = [];
// 插入点击事件监听
window.addEventListener('click', function (e) {
    let element = document.elementFromPoint(e.clientX, e.clientY);
    let id = e.target.id;
    let className = element.className;
    let tagName = element.tagName;
    let cssSelector = getCssSelector(element);
    let full_xpath = getFullXPath(element);
    events.push({'type': 'click', 'element': {
        'id': id,
        'full xpath': full_xpath,
        'className': className,
        'tagName': tagName,
        'cssSelector': cssSelector
    }});
    }, true);
// 插入输入监听，用获取焦点和失去焦点判断输入是否完成
window.addEventListener('focus', function (e) {
    let element = document.activeElement;
    if (element.tagName.toLowerCase() === 'input') {
        element.addEventListener('blur', function (e) {
            let id = e.target.id;
            let className = element.className;
            let tagName = element.tagName;
            let cssSelector = getCssSelector(element);
            let full_xpath = getFullXPath(element);
            let input_value = element.value;
            events.push({'type': 'input', 'element': {
                'id': id,
                'full xpath': full_xpath,
                'className': className,
                'tagName': tagName,
                'cssSelector': cssSelector
            }, input_value});
        });
    }
    }, true);
window._getEvents = function() { return events; };

// 获取xpath函数
function getFullXPath(element) {
    let count = 1;
    let result = "";

    let tag_index;
    let tmp;
    while (true) {
        count += 1;
        if (count > 99) {
            break
        }
        if (element === document.body) {
            result = '/html/body/' + result;
            break
        } else {
            tag_index = 0;
            tmp = element.parentElement;
            for (let i = 0; i < tmp.childElementCount; i++) {

                if (tmp.children[i].tagName === element.tagName) {
                    tag_index += 1
                }
                if (element === tmp.children[i]) {
                    result = element.tagName.toLowerCase() + "[" + String(tag_index) + "]" + "/" + result;
                    // console.log(result)
                    break
                }
            }
            element = tmp
        }
    }
    if (result.substr(-1) === '/') {
        result = result.substr(0, result.length - 1);
    }
    console.log(result);
    return result;
}

// 获取cssSelector
function getCssSelector(element) {
    if (!(element instanceof Element)){
        return '';
    }
    let path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
        let selector = element.nodeName.toLowerCase();
        if (element.id) {
            selector += '#' + element.id;
            path.unshift(selector);
            break;
        } else {
            let sib = element, nth = 1;
            while (sib === sib.previousElementSibling) {
                if (sib.nodeName.toLowerCase() === selector) {
                    nth++;
                }
            }
            if (nth !== 1) {
                selector += ":nth-of-type("+nth+")";
            }
        }
        path.unshift(selector);
        element = element.parentNode;
    }
    return path.join(" > ");
}

console.log('插入事件');
})();
