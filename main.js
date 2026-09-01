function NS(selector) {
  if (typeof selector === "function") {
    NS.ready(selector);
    return;
  }

  let elements = [];
  if (!selector) elements = [];
  else if (selector && selector.nodeType) elements = [selector];
  else if (selector instanceof NodeList || selector instanceof HTMLCollection) elements = Array.from(selector);
  else elements = Array.from(document.querySelectorAll(selector));

  const obj = {};
  obj.length = elements.length;
  for (let i = 0; i < elements.length; i++) obj[i] = elements[i];

  obj.css = function (prop, value) {
    if (typeof prop === "string" && Number.isInteger(value)) {
      if (elements[value]) return window.getComputedStyle(elements[value])[prop];
    } else if (typeof prop === "object") {
      for (let i = 0; i < elements.length; i++)
        for (let key in prop) elements[i].style[key] = prop[key];
    } else {
      for (let i = 0; i < elements.length; i++) elements[i].style[prop] = value;
    }

    return obj;
  }

  obj.get = function (item) {
    return elements.map(el => el.querySelector(item));
  }

  obj.getAll = function (item) {
    return elements.map(el => el.querySelectorAll(item));
  }

  obj.html = function (content) {
    if (content === undefined) return elements[0]?.innerHTML;
    for (let i = 0; i < elements.length; i++) elements[i].innerHTML = content;
    return obj;
  }

  obj.animation = function (cssQuery) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.animation = `${cssQuery}`;
    }
    return obj;
  }

  obj.on = function (event, callback) {
    for (let i = 0; i < elements.length; i++) elements[i].addEventListener(event, callback);
    return obj;
  }

  obj.off = function (event, callback) {
    elements.forEach(el => el.removeEventListener(event, callback));
    return obj;
  }

  obj.remove = function () {
    for (let i = 0; i < elements.length; i++) elements[i].remove();
    return obj;
  }

  obj.show = function () {
    for (let i = 0; i < elements.length; i++) elements[i].style.display = "";
    return obj;
  }

  obj.hide = function () {
    for (let i = 0; i < elements.length; i++) elements[i].style.display = "none";
    return obj;
  }

  obj.toggleDisplay = function () {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      if (!el.dataset._display) {
        el.dataset._display = getComputedStyle(el).display;
      }

      el.style.display =
        getComputedStyle(el).display === "none"
          ? el.dataset._display
          : "none";
    }
    return obj;
  }

  obj.attr = function (name, value) {
    if (value === undefined) return elements[0]?.getAttribute(name);
    for (let i = 0; i < elements.length; i++) elements[i].setAttribute(name, value);
    return obj;
  };

  obj.removeAttr = function (name) {
    for (let i = 0; i < elements.length; i++) elements[i].removeAttribute(name);
    return obj;
  }

  obj.addClass = function (className) {
    for (let i = 0; i < elements.length; i++) elements[i].classList.add(className);
    return obj;
  };

  obj.removeClass = function (className) {
    for (let i = 0; i < elements.length; i++) elements[i].classList.remove(className);
    return obj;
  };

  obj.toggleClass = function (className) {
    for (let i = 0; i < elements.length; i++) elements[i].classList.toggle(className);
    return obj;
  };

  obj.hasClass = function (className) {
    return elements.some(el => el.classList.contains(className));
  };

  obj.replaceClass = function (oldClass, newClass) {
    for (let i = 0; i < elements.length; i++) elements[i].classList.replace(oldClass, newClass);
    return obj;
  }

  obj.focus = function (n = 0) {
    const index = Number.isInteger(n) ? n : 0;
    elements[index]?.focus();
    return obj;
  }

  obj.parent = function () {
    return NS(elements.map(el => el.parentElement).filter(el => el));
  }

  obj.children = function () {
    const newElements = elements.flatMap(el => Array.from(el.children));
    return NS(newElements);
  };

  obj.siblings = function () {
    return NS(elements.flatMap(el =>
      Array.from(el.parentElement.children).filter(e => e !== el)
    ));
  }

  obj.hover = function (overFn, outFn) {
    if (typeof overFn !== "function" || typeof outFn !== "function") throw new TypeError("hover() expects two functions");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("mouseenter", function (e) {
        overFn.call(this, e);
      });
      elements[i].addEventListener("mouseleave", function (e) {
        outFn.call(this, e);
      });
    }
    return obj;
  }

  obj.once = function (callback) {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const handler = function (e) {
        callback(e);
        el.removeEventListener("click", handler);
      };
      el.addEventListener("click", handler);
    }
    return obj;
  }

  obj.setText = function (txt) {
    for (let i = 0; i < elements.length; i++) elements[i].textContent = txt;
    return obj;
  }

  obj.getText = function () {
    let values = [];
    for (let i = 0; i < elements.length; i++) values.push(elements[i].textContent);

    return values;
  }

  obj.getVal = function () {
    let values = [];
    for (let i = 0; i < elements.length; i++) values.push(elements[i].value);

    return values;
  }

  obj.setVal = function (val) {
    for (let i = 0; i < elements.length; i++) elements[i].value = val;
    return obj;
  }

  obj.each = function (callback) {
    elements.forEach((elements, index) => {
      callback(elements, index);
    });

    return obj;
  }

  obj.clickAllOnce = function () {
    for (let i = 0; i < elements.length; i++) elements[i]?.click();

    return obj;
  }

  obj.click = function (count = 1, index = 0,) {
    index = Number.isInteger(index) ? index : 0;
    count = Number.isInteger(count) ? count : 0;

    for (let i = 0; i < count; i++) elements[index]?.click();

    return obj;
  }

  obj.append = function (target) {
    for (let i = 0; i < elements.length; i++) {
      const nodeToAppend = i === elements.length - 1 ? target : target.cloneNode(true);
      elements[i].appendChild(nodeToAppend);
    }

    return obj;
  }

  obj.getDataSetItem = function (target) {
    return elements.map(el => el.dataset?.[target]);
  }

  obj.setDataSetItem = function (target, value) {
    for (let i = 0; i < elements.length; i++) elements[i].dataset[target] = value;
    return obj;
  }

  return obj;
}

NS.ready = function (fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}

NS.createEl = function (type = "", target = "", props = {}) {
  if (typeof props !== "object" || props === null) return console.error("Props must be an object, not null.");

  const rawTarget = target?.[0] || target;
  const el = document.createElement(type);
  for (let key in props) el[key] = props[key];

  if (rawTarget && rawTarget?.appendChild) rawTarget.appendChild(el);
  return el;
};

NS.fetch = async function ({
  url = "",
  path, type,
  method = "GET", body = {},
  mediaType = "application/json",
  headers,
  credentials = 'include',
  options = {}
} = {}) {
  try {
    method = method.toUpperCase();
    let response = null;
    let data;
    const hasPayload = ["POST", "PUT", "PATCH"].includes(method.toUpperCase());
    const payload = hasPayload ? {
      method: method,
      headers: { "Content-Type": mediaType, ...headers },
      body: JSON.stringify(body),
      credentials: credentials
    } : { method: method };

    for (const key in options) {
      payload[key] = options[key];
    }

    response = await fetch(url, payload);
    if (type === "text") data = await response.text();
    else data = await response.json();

    // Return data
    if (path) return data[path];
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

NS.xml = {
  load: async function (filePath) {
    try {
      const file = await fetch(filePath);
      if (!file.ok) throw new Error("File not found!");
      const text = await file.text();
      const parser = new DOMParser();
      const parsedXML = parser.parseFromString(text, "text/xml");

      return parsedXML;
    } catch (e) {
      console.log("Error: " + e);
    }
  },

  getAll: function (xml, item) {
    return xml.querySelectorAll(item);
  },

  get: function (xml, item) {
    return xml.querySelector(item);
  }
}