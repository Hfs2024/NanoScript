NS.contextMenu = ({
    parent,
    menu,
    display = "block"
}) => {
    if (!parent || !menu) return console.error("You must provide an element.");

    const foundParent = document.querySelector(parent);
    const foundMenu = document.querySelector(menu);

    foundParent.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        foundMenu.style.display = display;
        foundMenu.style.top = `${e.clientY}px`;
        foundMenu.style.left = `${e.clientX}px`
    });
    
    document.addEventListener("click", () => {
        foundMenu.style.display = "none";
    });
}