let makeVisible = index => {
    [choices, cover].forEach(e => e.classList.toggle("visible"));
    choices.querySelector(".title").innerHTML = titles[index]
    Array.from(document.getElementsByClassName("choice")).forEach(e => {
        e.href = e.href + titles[index]
    })
}

const titles = ["login", "signup"]
const choices = document.getElementById("choices")
const cover = document.getElementById("cover")
const form = document.getElementById("hform")

cover.addEventListener("click", makeVisible)

window.addEventListener("scroll", () => {
    document.querySelector("header").classList.toggle("scrolled", window.scrollY > window.innerHeight - 70)
})

