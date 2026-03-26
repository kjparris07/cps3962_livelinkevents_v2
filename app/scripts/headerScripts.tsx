'use client'

export function showLogin() {
    let label_group = document.querySelectorAll(".label_group");
    let note = document.getElementById("required-note");

    if (label_group) {
        const isVisible = window.getComputedStyle(label_group[0]).display !== "none";
        if (!isVisible) {
            for (let i = 0; i < label_group.length; i++) {
                let element = label_group[i] as HTMLElement;
                element.style.display = "flex";
            }
            note !== null ? note.style.display = "block" : console.log("note is undefined");
        }
    } else {
        console.log("label_group is undefined");
    }
}

export function hideLogin() {
    let label_group = document.querySelectorAll(".label_group");
    let note = document.getElementById("required-note");

    if (label_group) {
        const isVisible = window.getComputedStyle(label_group[0]).display !== "none";
        if (isVisible) {
            for (let i = 0; i < label_group.length; i++) {
                let element = label_group[i] as HTMLElement;
                element.style.display = "none";
            }
            note !== null ? note.style.display = "none" : console.log("note is undefined");
        }
    } else {
        console.log("label_group is undefined");
    }
}