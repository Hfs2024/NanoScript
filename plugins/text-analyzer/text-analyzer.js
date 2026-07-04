NS.textAnalyzer = (text) => {
    const obj = {
        length: () => {
            return text.length;
        },

        getText: () => {
            return text;
        },

        extract(type = "digit", alone = false, splitBy = " ",) {
            let items = [];
            let textClone = [];
            if (!Array.isArray(text)) textClone = text.split(alone ? "" : splitBy);
            else textClone = text;

            for (let token of textClone) {
                let regex = type === "digit" ? (alone ? /\d/ : /\d+/) : (alone ? /\w/ : /\w+/);
                let match = token.match(regex);
                if (match) items.push(type === "digit" ? Number(match[0]) : match[0]); // Push the result
            }

            return items;
        },

        toElement(type = "p", target, props = {}) {
            const el = document.createElement(type);
            el.textContent = text;
            for (let key in props) el[key] = props[key];
            target.appendChild(el);
            return el;
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
            if (Array.isArray(text)) return console.error("Text is already an array");
            text = text.split(splitBy);
            return obj;
        },

        join(joinBy = " ") {
            if (!Array.isArray(text)) return console.error("Text must be an array");
            text = text.join(joinBy);
            return obj;
        }
    }

    return obj;
}


// Quick examples:
// Examples 1:
/* NS.textAnalyzer(`
    -- Start conversation: 1
    John: Hey Doe!
    Doe: Hey friend! What's 2+2 equals?
    John: 2+2=4.
    Doe: Sure not 22? Maybe 0?
    John: Yeah.
    Doe: But addition = group number. So, group 2 and 2? 22.
    John: Math doesn't work like that!
    Doe: Got it friend, thanks for your help. That's why I got 0/10 in math 😅.
    John: You are welcome! Just study harder next time! Wish you the best!
    -- End conversation: 1
`).extract("digit", true, " "); // I bet it will handle complex strings. Scroll down for explanation.
*/

// Example 2:
/*
NS.textAnalyzer("Hello everyone! How is your day?").length(); // 32
*/

// Example 3:
/* 
NS.textAnalyzer("I like pizza!").toElement("p", document.body, {
    id: "pizza-corner",
    onclick: () => {
        console.log("How about you?");
    }
});
*/

/*
  Extract rule:
  Our example above will return: [1, 2, 2, 22, 0, 2, 2, 22, 0, 1].
  Why some number were skipped?

  Because: A token is evaluated even if it doesn't start with a number. However, if a 
  token starts with a number and a non-digit character is encountered, processing 
  stops for that specific token. Setting the second argument (alone) to true will 
  split non joined numbers, returning: [1, 2, 2, 2, 2, 4, 2, 2, 0, 2, 2, 2, 2, 0, 1, 0, 1] accepting all numbers but without being joined.
*/