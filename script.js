class Book {
  constructor(title, author, pages, hasBeenRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasBeenRead = hasBeenRead;
  }
}

class Library {
  constructor(books) {
    this.books = books;
  }

  addBook(bookProperties) {
    const { title, author, pages } = bookProperties;
    this.books.push(new Book(title, author, pages, false));
  }

  render() {
    const bookListElement = document.querySelector(".books");
    bookListElement.innerHTML = "";

    let id = 0;

    this.books.forEach(book => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
                <p class="card__title">Title: <strong>${book.title}</strong></p>
                <p class="card__author">Author: <strong>${
                  book.author
                }</strong></p>
                <p class="card__pages">Pages: <strong>${book.pages}</strong></p>
                <p class="card__has-been-read">${
                  book.hasBeenRead ? "Has been read" : "Not read"
                }</p>
                <div class="card__buttons">
                    <button class="change-read-status">Change read status</button>
                    <button class="remove-book">Remove book</button>
                </div>
            `;

      card.setAttribute("data-id", id.toString());
      id++;

      card.querySelector(".card__has-been-read").style.color = book.hasBeenRead
        ? "green"
        : "red";

      bookListElement.appendChild(card);
    });

    localStorage.setItem("myLibrary", JSON.stringify(this.books));
  }
}

const MainController = (() => {
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

  const library = new Library(myLibrary);

  const addBookButton = document.querySelector(".add-book");
  const addBookForm = document.querySelector(".form");

  const bookListElement = document.querySelector(".books");

  const validateFields = fields => {
    const errors = [];

    fields.forEach(field => {
      field.classList.remove("invalid");
      if (field.getAttribute("id") === "pages") {
        if (isNaN(parseInt(field.value))) {
          errors.push("Invalid: # Pages - Please enter a number");
          field.classList.add("invalid");
        }
      } else {
        if (field.value.trim().length === 0) {
          errors.push(`Field (${field.name}) is empty - Please enter a value`);
          field.classList.add("invalid");
        }
      }
    });

    return errors;
  };

  const formHandler = e => {
    e.preventDefault();
    const fields = e.target.querySelectorAll("input[type='text']");
    const fieldValidationErrors = validateFields(fields);

    console.log(fieldValidationErrors);

    if (fieldValidationErrors.length > 0) {
      const formErrorsContainer = e.target.querySelector(
        ".form-errors-container"
      );

      formErrorsContainer.innerHTML = "";
      fieldValidationErrors.forEach(err => {
        const errorElement = document.createElement("p");
        errorElement.textContent = err;
        formErrorsContainer.appendChild(errorElement);
      });

      console.log("Display errors");
      e.preventDefault();
      return;
    }

    const newBook = { hasBeenRead: false };

    Array.from(e.target.elements).forEach(element => {
      if (element.type === "text") {
        newBook[element.id] = element.value;
      }
    });

    library.addBook(newBook);

    MainController.toggleNewBookForm();
    library.render();

    e.target.reset();
  };

  const toggleNewBookForm = () => {
    addBookForm.classList.toggle("open");
    if (addBookForm.classList.contains("open")) {
      addBookButton.textContent = "Close form";
      addBookButton.style.backgroundColor = "red";
    } else {
      addBookButton.textContent = "Add book";
      addBookButton.style.backgroundColor = "rgb(33,150,243)";
    }
  };

  bookListElement.addEventListener("click", e => {
    if (e.target.classList.contains("remove-book")) {
      const bookToDelete = e.path.find(element =>
        element.classList.contains("card")
      );
      library.books.splice(bookToDelete.getAttribute("data-id"), 1);
      library.render();
    } else if (e.target.classList.contains("change-read-status")) {
      const bookToChangeReadStatus = e.path.find(element =>
        element.classList.contains("card")
      );

      library.books[
        bookToChangeReadStatus.getAttribute("data-id")
      ].hasBeenRead = !library.books[
        bookToChangeReadStatus.getAttribute("data-id")
      ].hasBeenRead;

      library.render();
    }
  });

  addBookButton.addEventListener("click", toggleNewBookForm);

  window.addEventListener("load", () => {
    let savedBooks = JSON.parse(localStorage.getItem("myLibrary"));

    savedBooks = savedBooks.map(savedBook => {
      let bookProperties = [];

      for (let key in savedBook) {
        bookProperties.push(savedBook[key]);
      }

      return new Book(...bookProperties);
    });

    library.books = savedBooks;
    library.render();
  });

  return { toggleNewBookForm, formHandler };
})();
