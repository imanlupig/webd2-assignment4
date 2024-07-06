/******w**************
    
    Assignment 4 Javascript
    Name: Ian Manlupig
    Date: 2024-06-27
    Description: AJAX script for searching parking violations in Winnipeg

*********************/

//fetch count
let count = 1;

async function getData(event) {

    event.preventDefault();

    //getting search bar input
    const searchBar = document.getElementById("searchBar").value.trim();
    const container = document.getElementsByClassName("results")[0];
    container.innerHTML = "<h2>Gathering Data... </h2>"

    //checks if search bar is empty
    if (searchBar === "") {
        return container.innerHTML = "<h3>Enter Valid Name</h3>";
    }

    //api url and search parameters saved in variables
    const apiUrl = 'https://data.winnipeg.ca/resource/bhrt-29rb.json?';  
    const searchParams = `$where= lower(street) LIKE '%${searchBar.toLowerCase()}%'` +
    '&$order= issue_date ASC' +
    '&$limit=100';
    const searchUrl = apiUrl + searchParams;

    //encode url, fetch response and return json object
    const encodedURL = encodeURI(searchUrl);

    console.groupCollapsed(`Fetch Request #${count++}`);
    console.log("Search Term:", searchBar);
    console.log("Final URL:", encodedURL);

    const response = await fetch(encodedURL);
    const streets = await response.json();

    console.log("Results", streets);
    console.groupEnd();

    //loop through the object and print information
    streets.forEach(street => {
        listItems = Object.entries(street).reduce((itemEntry, currentItem) => {
            const [key, value] = currentItem;

            if(key === "street"){
                return itemEntry;
            }

            if(value === "" || typeof value !== "string") {
                return itemEntry;
            }

            return itemEntry += `
            <li>${key}: ${value}</li>
            `
        }, "")

        const resultHTML = `
        <div>
            <h2>${street.street}</h2>
            <ul>
                ${listItems}
            </ul>
        </div>
        `
        container.innerHTML = container.innerHTML + resultHTML;
    });

    document.querySelector(".results h2").remove();

    if(container.innerHTML === ""){
        container.innerHTML = "<h3>Could not find results, try again...</h3>";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("form");
    form.addEventListener("submit", getData);
})