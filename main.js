// ------------------ ANIMATION HELPERS ------------------
function addAnim(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
}

const fadeInAnim = `
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}`;
const fadeOutAnim = `
@keyframes fadeOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}`;

addAnim(fadeInAnim);
addAnim(fadeOutAnim);

// ------------------ NANO SCRIPT (NS) ------------------
function NS(selector) {
  if (typeof selector === "function") {
    NS.ready(selector);
    return;
  }

  let elements = [];
  if (selector && selector.nodeType) {
    elements = [selector];
  }
  else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
    elements = Array.from(selector);
  }
  else {
    elements = Array.from(document.querySelectorAll(selector));
  }

  const obj = {};
  obj.length = elements.length;
  for (let i = 0; i < elements.length; i++) obj[i] = elements[i];

  // ------------------ STYLES ------------------
  obj.centerBody = function () {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "flex";
      elements[i].style.justifyContent = "center";
      elements[i].style.alignItems = "center";
      elements[i].style.minHeight = "100vh";
      elements[i].style.flexDirection = "column";
    }
    return obj;
  };
  // ------------------ METHODS ------------------
  obj.css = function (prop, value) {
    if (typeof prop === "object") {
      for (let i = 0; i < elements.length; i++)
        for (let key in prop) elements[i].style[key] = prop[key];
    } else {
      for (let i = 0; i < elements.length; i++) elements[i].style[prop] = value;
    }
    return obj;
  };

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
  };

  obj.animation = function (cssQuery) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.animation = `${cssQuery}`;
    }
    return obj;
  };

  obj.on = function (event, callback) {
    for (let i = 0; i < elements.length; i++) elements[i].addEventListener(event, callback);
    return obj;
  };

  obj.off = function (event, callback) {
    elements.forEach(el => el.removeEventListener(event, callback));
    return obj;
  };

  obj.remove = function () {
    for (let i = 0; i < elements.length; i++) elements[i].remove();
    return obj;
  };

  obj.show = function () {
    for (let i = 0; i < elements.length; i++) elements[i].style.display = "";
    return obj;
  };

  obj.hide = function () {
    for (let i = 0; i < elements.length; i++) elements[i].style.display = "none";
    return obj;
  };

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
  };

  obj.wrap = function (wrapperTag) {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      const wrapper = document.createElement(wrapperTag);
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
    return obj;
  };

  obj.unwrap = function () {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const parent = el.parentElement;

      if (!parent) continue;
      const grandParent = parent.parentElement;

      if (!grandParent) continue;

      grandParent.insertBefore(el, parent);

      if (parent.children.length === 0) parent.remove();
    }
    return obj;
  };

  obj.attr = function (name, value) {
    if (value === undefined) return elements[0]?.getAttribute(name);
    for (let i = 0; i < elements.length; i++) elements[i].setAttribute(name, value);
    return obj;
  };

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

  obj.fadeIn = function (count = 1) {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      el.style.display = "";
      el.style.animation = `fadeIn 1s ease ${count} `;
    }
    return obj;
  };

  obj.fadeOut = function (fill = "forwards") {
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      el.style.animation = `fadeOut 1s ease`;
      el.style.animationFillMode = fill;
      el.addEventListener(
        "animationend",
        () => { el.style.display = "none"; },
        { once: true }
      );
    }
    return obj;
  };

  obj.parent = function () {
    const newElements = elements.map(el => el.parentElement).filter(el => el);
    return NS(newElements);
  };

  obj.children = function () {
    const newElements = elements.flatMap(el => Array.from(el.children));
    return NS(newElements);
  };

  obj.siblings = function () {
    const newElements = elements.flatMap(el =>
      Array.from(el.parentElement.children).filter(e => e !== el)
    );
    return NS(newElements);
  }

  obj.hover = function (overFn, outFn) {
    if (typeof overFn !== "function" || typeof outFn !== "function") {
      throw new TypeError("hover() expects two functions");
    }
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("mouseenter", function (e) {
        overFn.call(this, e);
      });
      elements[i].addEventListener("mouseleave", function (e) {
        outFn.call(this, e);
      });
    }
    return obj;
  };

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
  };

  obj.data = function (key, value) {
    if (value === undefined) return elements[0]?.dataset[key];
    for (let i = 0; i < elements.length; i++) elements[i].dataset[key] = value;
    return obj;
  };

  obj.setText = function (txt) {
    for (let i = 0; i < elements.length; i++) elements[i].textContent = txt;
    return obj;
  };

  obj.getText = function () {
    let values = [];
    for (let i = 0; i < elements.length; i++) values.push(elements[i].textContent);

    return values;
  };

  obj.getVal = function () {
    let values = [];
    for (let i = 0; i < elements.length; i++) values.push(elements[i].value);

    return values;
  };

  obj.setVal = function (val) {
    for (let i = 0; i < elements.length; i++) elements[i].value = val;
    return obj;
  };

  obj.each = function (callback) {
    elements.forEach((elements, index) => {
      callback(elements, index);
    });

    return obj;
  };

  obj.click = function () {
    for (let i = 0; i < elements.length; i++) elements[i].click();

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
  },

  obj.setDataSetItem = function (target, value) {
    for (let i = 0; i < elements.length; i++) elements[i].dataset[target] = value;

    return obj;
  }

  return obj;
}

// ------------------ NS READY FUNCTION, FETCH FUNCTION, PLUGINS AND MORE ------------------
NS.ready = function (fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}

NS.createEl = function (type, target, props) {
  if ((typeof props !== "object") || (props === null)) return console.log("Props arg must be a type of object, and not null.");
  let el = document.createElement(type);
  for (let key in props) el[key] = props[key];

  target.appendChild(el);
  return el;
};

NS.fetch = async function ({
  url, path, type,
  method = "GET", body = {},
  mediaType = "application/json",
  headers
} = {}) {
  try {
    method = method.toUpperCase();
    let response = null;

    const hasPayload = ["POST", "PUT", "PATCH"].includes(method.toUpperCase());

    const options = hasPayload ? {
      method: method,
      headers: { "Content-Type": mediaType, ...headers },
      body: JSON.stringify(body)
    } : { method: method };

    response = await fetch(url, options);

    let data;

    if (type === "json") data = await response.json();
    else if (type === "text") data = await response.text();
    else data = await response.json();

    if (path) return data[path];

    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

// ------------------ Themes -----------------
NS.theme = {
  add: async function (filePath, name) {
    try {
      const file = await fetch(filePath);

      if (!file.ok) {
        throw new Error("File not found!");
      }

      const text = await file.text();
      const styles = document.createElement("style");
      styles.textContent = text;
      styles.id = name;
      document.head.appendChild(styles);
      return text;

    } catch (e) {
      alert("Error: " + e);
    }
  },

  remove: function (name) {
    const styles = document.getElementById(name);
    if (styles) styles.remove();
  },

  reset() {
    const themeStyles = document.querySelectorAll("style");
    themeStyles.forEach(style => style.remove());
  },

  exists: function (name) {
    const exists = !!document.getElementById(name);
    console.log(
      `Theme '${name}' ${exists ? "exists ✅" : "does not exist 🚫"}`
    );
    return exists;
  },
}

NS.xml = {
  load: async function (filePath) {
    try {
      const file = await fetch(filePath);

      if (!file.ok) {
        throw new Error("File not found!");
      }

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