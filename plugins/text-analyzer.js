NS.textAnalyzer = (text) => {
    const obj = {
        length: () => {
            return text.length;
        },

        getText: () => {
            return text;
        },

        extract(type = "digit", splitBy = " ", alone = false) {
            let items = [];
            let textClone = [];
            if (!Array.isArray(text)) textClone = text.split(alone ? "" : splitBy);
            else textClone = text;

            for (let token of textClone) {
                let match = token.match(type === "digit" ? /\d+/ : /\w+/);
                if (match) items.push(type === "digit" ? Number(match[0]) : match[0]); // Push the result
            }

            return items;
        },

        toElement(type = "p", target, props = {}) {
            const el = document.createElement(type);
            el.textContent = text;
            for (let key in props) el[key] = props[key];
            target.appendChild(el);
            return obj;
        },

        replace(replace = "", replaceWith = "") {
            text = text.replace(replace, replaceWith);
            return obj;
        },

        replaceAll(replace = "", replaceWith = "") {
            text = text.replaceAll(replace, replaceWith);
            return obj;
        },

        split(splitBy = " ") {
            if (Array.isArray(text)) return console.log("Text is already an array");
            text = text.split(splitBy);
            return obj;
        },

        join(joinBy = " ") {
            if (!Array.isArray(text)) return console.log("Text must be an array");
            text = text.join(joinBy);
            return obj;
        }
    }

    return obj;
}

/*
  Returns [2, 120]. Why are the other '2' and '4' skipped? Because there is a plus sign 
  between the two '2's, and an equal sign between the '2' and '4'.
  
  If you set the second argument (alone) to true, it returns: [2, 2, 4, 1, 2, 0] 
  because it extracts each digit individually.
  
  Rule: A token is evaluated even if it doesn't start with a number. However, if a 
  token starts with a number and a non-digit character is encountered, processing 
  stops for that specific token.
*/