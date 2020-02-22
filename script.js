let myLibrary = [
    {
        title: "The Angel of Terror",
        author: "Edgar Wallace",
        pages: 320,
        hasBeenRead: false
    },
    {
        title: "Engineering Bulletin No 1: Boiler and Furnace Testing",
        author: "Rufus T. Strohm",
        pages: 20,
        hasBeenRead: false
    }
];

const bookListElement = document.querySelector(".books");

function Book(title, author, pages, hasBeenRead) {
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.hasBeenRead = hasBeenRead;
}

function addBookToLibrary(userInput) {
    const {author, title, pages, hasBeenRead} = userInput;
    myLibrary.push(new Book(author, title, pages, hasBeenRead));
}

function render() {

    bookListElement.innerHTML = "";

    let id = 0;

    myLibrary.forEach((book, index) => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <p class="card__title">Title: <strong>${book.title}</strong></p>
            <p class="card__author">Author: <strong>${book.author}</strong></p>
            <p class="card__pages">Pages: <strong>${book.pages}</strong></p>
            <p class="card__has-been-read">${book.hasBeenRead ? "Has been read" : "Not read"}</p>
            <div class="card__buttons">
                <button class="change-read-status">Change read status</button>
                <button class="remove-book">Remove book</button>
            </div>
        `

        card.setAttribute("data-id", id.toString())
        id++;

        card.querySelector(".card__has-been-read").style.color = book.hasBeenRead ? "green" : "red";

        bookListElement.appendChild(card);

    })

    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

}

function formHandler(e) {
    e.preventDefault();

    // Validate inputs

    const newBook = {hasBeenRead: false};

    Array.from(e.target.elements).forEach(element => {
        if (element.type === "text") {
            newBook[element.id] = element.value;
        }
    })
    
    addBookToLibrary(newBook);
    console.log(newBook)
    toggleNewBookForm();
    render();
    
}

const addBookButton = document.querySelector(".add-book");
const addBookForm = document.querySelector(".form");

addBookButton.addEventListener("click", toggleNewBookForm);

function toggleNewBookForm() {
    console.log(addBookForm);
    addBookForm.classList.toggle("open");
    if (addBookForm.classList.contains("open")) {
        addBookButton.textContent = "Close form"
        addBookButton.style.backgroundColor = "red"
    } else {
        addBookButton.textContent = "Add book"
        addBookButton.style.backgroundColor = "rgb(33,150,243)"
    }
}

bookListElement.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-book")) {
        const bookToDelete = e.path.find(element => element.classList.contains("card"))
        myLibrary.splice(bookToDelete.getAttribute("data-id"), 1);
        render();
    } else if (e.target.classList.contains("change-read-status")) {
        const bookToChangeReadStatus = e.path.find(element => element.classList.contains("card"))
        myLibrary[bookToChangeReadStatus.getAttribute("data-id")].hasBeenRead ^= true;
        render();
    }
})

window.addEventListener("load", () => {
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    render();
});