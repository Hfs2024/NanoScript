(function (window) {
  // Validators
  const isString = str => typeof str === "string";
  const isNullOrUndefined = data => data === null || data === undefined;
  const isFunction = fn => typeof fn === "function";
  const isObject = obj => Object.prototype.toString.call(obj) === "[object Object]";

  // NS wrapper
  function NS(selector) {
    // Selector
    let elements = [];

    // Find elements
    if (selector?.nodeType) {
      elements = [selector];
    } else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
      elements = Array.from(selector);
    } else if (isString(selector)) {
      try {
        elements = Array.from(document.querySelectorAll(selector));
      } catch {
        elements = []; 
      }
    } else {
      elements = []; 
    }

    // Object wrapper
    const obj = {};
    for (let i = 0; i < elements.length; i++) obj[i] = elements[i];

    // Methods
    obj.css = function (prop, value) {
      if (isString(prop)) {
        if (isNullOrUndefined(value)) return elements.map(el => window.getComputedStyle(el)[prop]);

        // Value exist
        for (let el of elements) {
          el.style[prop] = value;
        }
      } else if (isObject(prop)) {
        for (let el of elements)
          for (let key in prop) el.style[key] = prop[key];
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
      if (isNullOrUndefined(content)) return elements.map(el => el.innerHTML);
      for (let el of elements) el.innerHTML = content;
      return obj;
    }

    obj.on = function (event, callback) {
      for (let el of elements) el.addEventListener(event, callback);
      return obj;
    }

    obj.off = function (event, callback) {
      for (let el of elements) el.removeEventListener(event, callback);
      return obj;
    }

    obj.remove = function () {
      for (let el of elements) el.remove();
      return obj;
    }

    obj.show = function () {
      for (let el of elements) el.style.display = "";
      return obj;
    }

    obj.hide = function () {
      for (let el of elements) el.style.display = "none";
      return obj;
    }

    obj.append = function (target, index) {
      if (target instanceof HTMLElement && Number.isInteger(index)) elements[index]?.appendChild(target);
      return obj;
    }

    obj.click = function () {
      for (let el of elements) el.click();
      return obj;
    }

    obj.attr = function (name, value) {
      if (isNullOrUndefined(value)) return elements.map(el => el.getAttribute(name));
      for (let el of elements) el.setAttribute(name, value);
      return obj;
    }

    obj.removeAttr = function (name) {
      for (let el of elements) el.removeAttribute(name);
      return obj;
    }

    obj.addClass = function (className) {
      for (let el of elements) el?.classList?.add(className);
      return obj;
    };

    obj.removeClass = function (className) {
      for (let el of elements) el?.classList?.remove(className);
      return obj;
    };

    obj.toggleClass = function (className) {
      for (let el of elements) el?.classList?.toggle(className);
      return obj;
    };

    obj.hasClass = function (className) {
      return elements.some(el => el?.classList?.contains(className));
    };

    obj.replaceClass = function (oldClass, newClass) {
      for (let el of elements) el?.classList?.replace(oldClass, newClass);
      return obj;
    }

    obj.parent = function () {
      const parents = elements.map(el => el.parentElement).filter(el => el);
      return NS([...new Set(parents)]);
    };

    obj.children = function () {
      const children = elements.flatMap(el => Array.from(el.children));
      return NS([...new Set(children)]);
    };

    obj.siblings = function () {
      const siblings = elements.flatMap(el => {
        if (!el.parentElement) return [];
        return Array.from(el.parentElement.children).filter(e => e !== el);
      });
      return NS([...new Set(siblings)]);
    };


    obj.hover = function (overFn, outFn) {
      if (!isFunction(overFn) || !isFunction(outFn)) throw new TypeError("Expected two functions");

      // Attach the events
      for (let el of elements) {
        el.addEventListener("mouseenter", function (e) {
          overFn.call(this, e);
        });
        el.addEventListener("mouseleave", function (e) {
          outFn.call(this, e);
        });
      }
      return obj;
    }

    obj.once = function (callback) {
      for (let el of elements) {
        el.addEventListener("click", function handler(e) {
          callback(e);
          el.removeEventListener("click", handler);
        });
      }
      return obj;
    }

    obj.setText = function (txt) {
      for (let el of elements) el.textContent = txt;
      return obj;
    }

    obj.getText = function () {
      return elements.map(el => el.textContent);
    }

    obj.getVal = function () {
      return elements.map(el => el.value);
    }

    obj.setVal = function (val) {
      for (let el of elements) el.value = val;
      return obj;
    }

    obj.each = function (cb) {
      elements.forEach((elements, index) => {
        cb(elements, index);
      });

      return obj;
    }

    obj.focus = function (index = 0) {
      if (Number.isInteger(index)) elements[index]?.focus(); // An index is needed here because you can't focus two elements at the same time
      return obj;
    }

    return obj;
  }

  NS.ready = function (fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  NS.createEl = function (tag, target, props = {}) {
    if (!isObject(props)) return null;

    // Locate target
    target = target?.[0] || target;
    if (!(target instanceof HTMLElement)) return null;

    // Create element
    const el = document.createElement(tag);

    // Add props
    for (let key in props) el[key] = props[key];

    // Append
    target.appendChild(el);

    // Return raw element
    return el;
  }

  NS.fetch = async function ({
    url,
    media = "application/json",
    json = true,
    method = "GET",
    body = {},
    headers = {},
    options = {}
  } = {}) {
    try {
      if (!isString(url) || !isString(method)) return null;

      const safeBody = isObject(body) ? body : {};
      const safeHeaders = isObject(headers) ? headers : {};
      const safeOptions = isObject(options) ? options : {};
      method = method.toUpperCase();
      const hasPayload = ["POST", "PUT", "PATCH"].includes(method);
      let response = null;
      let data;

      // Create the payload
      const payload = hasPayload ? {
        method: method,
        headers: { "Content-Type": media, ...safeHeaders },
        body: JSON.stringify(safeBody)
      } : { method: method };

      // Add extra options
      for (const key in safeOptions) payload[key] = safeOptions[key];

      // Fetch the data
      response = await fetch(url, payload);
      if (json) data = await response.json();
      else data = await response.text();

      return data;
    } catch (e) {
      return e;
    }
  }

  window.NS = NS;
})(window);