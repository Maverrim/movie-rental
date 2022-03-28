import "../scss/main.scss";
import '@csstools/normalize.css';

document.addEventListener('DOMContentLoaded', getData)

const appWrapper = document.querySelector('.wrapper');
const tableBody = document.querySelector('.table-body');
const modal = document.querySelector('.modal-backdrop');
const modalContent = document.querySelector('.content__text-details');
const showDetailsBtn = document.querySelectorAll('.table__details-btn');
const closeModalBtn = document.querySelector('.close-modal');
const submitBtn = document.querySelector('.submit-btn');

const form = document.getElementById('movie-form');
const formTitle = document.getElementById('title');
const formDescription = document.getElementById('description');
const formAuthor = document.getElementById('author');
const formYear = document.getElementById('year');

const movies = [];
console.log(movies);


async function loadMovies() {
  return fetch('https://w-strapi-movies-app-9wxhf.ondigitalocean.app/api/movies')
        .then(res =>{
            const foo = res.json();
            console.log(foo)
            return foo; 
        })
        .then(movie =>  {
            console.log(movie);
            return movie.data;
        })
        .catch(err => console.log(err));
}

async function getData() {
    
    if (!tableBody) {
        return;
    }
    
    let tableDataRowHtml = '';

    try {
        loadMovies().then(apiMovies => {

             apiMovies.forEach(movie => {
       movies.push(movie);
       const availability = movie.attributes.available ? 'Yes' : 'No';
       tableDataRowHtml += `
          <tr data-id='${movie.id}'>
            <td id="id">${movie.id}</td>
            <td>${movie.attributes.title}</td>
            <td>${movie.attributes.author}</td>
            <td>${movie.attributes.year}</td>
            <td>${availability}</td>
            <td><button class="table__details-btn btn">Show Details</button></td>
            <td><button class="table__delete-btn btn">Delete Movie</button></td>
            </tr>
            `;
        });

    if(tableBody) {
        tableBody.innerHTML = tableDataRowHtml;
    }})
    }
    catch {
        (err => console.log(err))
    };
}

const showDetails = (e) => {
    e.stopPropagation();
    console.log(e.target);
    const element = e.target;
    const rowId = Number(element.parentElement.parentElement.dataset.id);
    console.log(typeof rowId);
    console.log(rowId);
    console.log(movies);
    if (element.classList.contains("table__details-btn")) {
          const foundObj = movies.find(el => el.id === rowId); 
          const {id , attributes: {title, author, year, available, description}} = foundObj;
        const contentHtml = `
               <div class="details">
                    <p><strong>Movie ID:</strong> ${id}</p>
                    <p><strong>Availability:</strong> ${available ? 'Yes' : 'No'}</p>
                    <p><strong>Title:</strong> ${title}</p>
                    <p><strong>Author:</strong> ${author}</p>
                    <p><strong>Year:</strong> ${year}</p>
                    <p><strong>Description:</strong> ${description}</p>
               </div>     
               
        `;
        modalContent.innerHTML = contentHtml; 
        modal.classList.add('active');
        console.log(e)
    }
}

const deleteItem = (e) => {
    if (e.target.classList.contains('table__delete-btn')) {
       const element = e.target;
       const rowId = Number(element.parentElement.parentElement.dataset.id);
       const foundObj = movies.find(el => el.id === rowId); 
       const index = movies.findIndex(el => el.id === rowId);
       movies.splice(index, 1);
       console.log(movies);
       element.parentElement.parentElement.remove();

       const options = {
           method: 'DELETE',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(foundObj)
       }

       fetch(`https://w-strapi-movies-app-9wxhf.ondigitalocean.app/api/movies/${foundObj.id}`, options)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));
    } else {
        return;
    }
}

function addItem(e) {
    e.preventDefault();

    if (formTitle.value === '') {
        alert('Title must be filed');
    } else if (!document.querySelector('input[name="availability"]:checked')) {
        alert('Availability option must be checked');
    }

    const movie = {
       data: {
           title: formTitle.value,
           description: formDescription.value,
           author: formAuthor.value,
           available: document.querySelector('input[name="availability"]:checked').value === 'true',
           year: formYear.value
       }
    }
    movies.push(movie);
    console.log(movie)

     const options = {
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(movie)
       }

    fetch('https://w-strapi-movies-app-9wxhf.ondigitalocean.app/api/movies/', options)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));

    

    form.reset();
    setTimeout(window.location.replace('./index.html'), 1000);
}



function closeModal(e) {
    if (e.target === closeModalBtn || e.target === this) {
        modal.classList.remove('active');
    }
}

if(submitBtn){
    submitBtn.addEventListener('click', addItem);
}



if(tableBody) {
    tableBody.addEventListener('click', (e) => {
    showDetails(e);
    deleteItem(e);
});
}



if(modal){
    modal.addEventListener('click', closeModal);
}