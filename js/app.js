library = [];
isbnURL = "https://www.googleapis.com/books/v1/volumes?q=title:";
listDiv = document.querySelector("#list");
titleInput = document.querySelector("#title");
authorInput = document.querySelector("#author");
pagesInput = document.querySelector("#pages");
isReadCheck = document.querySelector("#is-read");

function Book(title, author, isRead = false, pages = 0, isbn = "no isbn", cover = 'no image') {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.isbn = isbn;
  this.cover = cover;
}

Book.prototype.info = function () {
  isRead = this.isRead ? "Has been read." : "Has not been read";
  return `${this.title} by ${this.author}, ${this.pages} pages. ${isRead}`;
  // return {
  //   title: this.title,
  //   author: this.author,
  //   pages: this.pages,
  //   isRead: this.isRead,
  // };
};

async function getBookInfo(title) {
  let isbn = ''
  let pageCount = ''
  let coverLink = ''
  await fetch(encodeURI(isbnURL + title))
    .then((response) => {
      console.log(encodeURI(isbnURL + title))
      return response.json();
    })
    .then((data) => {
      isbn = data.items[0].volumeInfo.industryIdentifiers[0].identifier;


      for (let i = 0; i < data.items.length; i++) {
        const book = data.items[i].volumeInfo;
        if (book.hasOwnProperty("pageCount")) {
          pageCount = book.pageCount
          break
        }
      }

      for (let i = 0; i < data.items.length; i++) {
        const book = data.items[i].volumeInfo;
        if (book.hasOwnProperty("imageLinks")) {
          coverLink = book.imageLinks.thumbnail
          console.log("image found for", title)
          break
        }
        
      }

      coverLink =  data.items[0].volumeInfo.imageLinks.thumbnail
      console.log(isbn = data.items[0].volumeInfo.industryIdentifiers[0].identifier)
    })
    .catch((e) => {
      console.log(e);
    });
    return {
      isbn,
      coverLink,
      pageCount
    }
}

async function addTestBook(title, author, isRead = false) {
  let validBook = true;
  isbn = ''
  library.forEach((book) => {
    if (book.title == title) {
      validBook = false;
    }
  });

  if (validBook) {
    bookData = await getBookInfo(title).then(({isbn, pageCount, coverLink}) => {
      return {
        isbn,
        pageCount,
        coverLink,
      }
    });

    const newBook = new Book(title, author, isRead, bookData.pageCount, bookData.isbn, bookData.coverLink);
    library.push(newBook);

  } else {
    console.log("Duplicate Book");
  }
}



addTestBook("The Hobbit", "J.R.R. Tolkien", true);
addTestBook("A Game of Thrones", "George R.R Martin", true);
addTestBook("War and Peace", "Leo Tolstoy", false);
addTestBook("Harry Potter and the Sorcerers Stone", "J.K Rowling", true);
addTestBook("Jurassic Park", "Michael Crichton", true);

const app = Vue.createApp({
  data() {
    return {
      showBooks: false,
      showGrid: true,
      books: library,
      addBookTitle: "Book Title",
      addNewAuthor: "Author",
      isRead: false,
    };
  },
  methods: {
    toggleShowBooks() {
      this.showBooks = !this.showBooks;
    },
    toggleGrid() {
      this.showGrid = !this.showGrid;
    },
    addBook: async function addBook(title, author, isRead) {
      let validBook = true;
      isbn = ''
      library.forEach((book) => {
        if (book.title == title) {
          validBook = false;
        }
      });
    
      if (validBook) {
        bookData = await getBookInfo(title).then(({isbn, pageCount, coverLink}) => {
          return {
            isbn,
            pageCount,
            coverLink,
          }
        });
    
        const newBook = new Book(title, author, isRead, bookData.pageCount, bookData.isbn, bookData.coverLink);
        library.push(newBook);
    
      } else {
        console.log("Duplicate Book");
      }
      this.$forceUpdate()
    }
  },
});

app.mount("#app");

// submit.addEventListener("click", (e) => {
//   isRead = isReadCheck.value == "on" ? true : false;
//   addBook(titleInput.value, authorInput.value, isRead);
// });

//console.log(library[1].info());
