function saveToCloud(event) {
    event.preventDefault();

    let candyName = event.target.candyName.value;
    let description = event.target.desc.value;
    let price = event.target.price.value;
    let quantity = event.target.quantity.value;

    let CandyStock = {
        candyName,
        description,
        price,
        quantity: parseInt(quantity)
    };

    axios.post("https://crudcrud.com/api/7ca9c3af03fe4bffac142f252f6b9939/CandyStock", CandyStock)
        .then((response) => {
            const updatedCandyStock = response.data;
            printCandyStock(updatedCandyStock);
            console.log(response);
        })
        .catch((err) => {
            console.error(err);
        });
}

window.addEventListener("DOMContentLoaded", () => {
    axios.get("https://crudcrud.com/api/7ca9c3af03fe4bffac142f252f6b9939/CandyStock")
        .then((response) => {
            console.log(response);

            for (var i = 0; i < response.data.length; i++) {
                printCandyStock(response.data[i]);
            }
        })
        .catch((error) => {
            console.log(error);
        });
});

function printCandyStock(CandyStock) {
    const parentElement = document.getElementById('CandyStock');
    const childElement = document.createElement('li');
    childElement.id = CandyStock._id; // Set the ID here

    const candyContainer = document.createElement('div');

    childElement.innerHTML = `
    Candy-Name: ${CandyStock.candyName} <br>
    Description: ${CandyStock.description} <br>
    Price: ${CandyStock.price} <br>
    <span class="quantity">Quantity: ${CandyStock.quantity}</span>
`;


    //buy 1 Button
    const buyOneButton = document.createElement('button')
    buyOneButton.id = 'buy1';
    buyOneButton.className = "btn btn-primary";
    buyOneButton.textContent = "Buy One"
    buyOneButton.style.fontWeight = "bold";


    //buy 2 Button
    const buyTwoButton = document.createElement('button')
    buyTwoButton.id = 'buy2';
    buyTwoButton.className = "btn btn-primary";
    buyTwoButton.textContent = "Buy Two"
    buyTwoButton.style.fontWeight = "bold";


    //buy 3 Button
    const buyThreeButton = document.createElement('button')
    buyThreeButton.id = 'buy3';
    buyThreeButton.className = "btn btn-primary";
    buyThreeButton.textContent = "Buy Three"
    buyThreeButton.style.fontWeight = "bold";

    //CLICK EVENTS
    buyOneButton.onclick = () => removeOne(CandyStock._id, CandyStock.description, CandyStock.candyName, CandyStock.price);
    buyTwoButton.onclick = () => removeTwo(CandyStock._id, CandyStock.description, CandyStock.candyName, CandyStock.price);
    buyThreeButton.onclick = () => removeThree(CandyStock._id, CandyStock.description, CandyStock.candyName, CandyStock.price);

    // Create the delete button
    const deleteButton = document.createElement('button');
    deleteButton.id = 'delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.textContent = 'Delete';
    deleteButton.style.backgroundColor = "red";
    deleteButton.style.fontWeight = 'bold';

    // Set the onclick event to call deleteCandy with the candy's ID
    deleteButton.onclick = () => deleteCandy(CandyStock._id);

    // Append the delete button to the child element
    childElement.appendChild(deleteButton);



    childElement.appendChild(buyOneButton);
    childElement.appendChild(buyTwoButton);
    childElement.appendChild(buyThreeButton);
    childElement.appendChild(candyContainer);
    parentElement.appendChild(childElement);
}

function removeOne(_id, description, candyName, price) {
    updateCandyStock(_id, -1, description, candyName, price);
}

function removeTwo(_id, description, candyName, price) {
    updateCandyStock(_id, -2, description, candyName, price);
}

function removeThree(_id, description, candyName, price) {
    updateCandyStock(_id, -3, description, candyName, price);
}

function deleteCandy(_id) {
    // Make a DELETE request to remove the candy from the server
    axios
        .delete(`https://crudcrud.com/api/7ca9c3af03fe4bffac142f252f6b9939/CandyStock/${_id}`)
        .then(() => {
            // Remove the candy element from the frontend
            const candyElement = document.getElementById(`${_id}`);
            if (candyElement) {
                candyElement.remove();
            } else {
                console.error(`Candy with ID ${_id} not found on the frontend.`);
            }
        })
        .catch((error) => {
            console.error(`Error deleting candy with ID ${_id} from the server:`, error);
        });
}




function updateCandyStock(_id, quantityChange, description, candyName, price) {
    // Make a GET request to fetch the candy data by ID
    axios.get(`https://crudcrud.com/api/7ca9c3af03fe4bffac142f252f6b9939/CandyStock/${_id}`)
        .then((response) => {
            const candyData = response.data;
            const currentQuantity = parseInt(candyData.quantity);
            const newQuantity = currentQuantity + quantityChange;

            if (newQuantity >= 0) {
                // Prepare the updated candy data
                const updatedCandyData = {
                    candyName: candyName,
                    description: description,
                    price: price,
                    quantity: newQuantity
                };

                // Make a PUT request to update the candy data on the server
                axios.put(`https://crudcrud.com/api/7ca9c3af03fe4bffac142f252f6b9939/CandyStock/${_id}`, updatedCandyData)
                    .then(() => {
                        // Update the candy's quantity on the frontend if the element exists
                        const candyElement = document.getElementById(`${_id}`);
                        if (candyElement) {
                            const quantityElement = candyElement.querySelector('.quantity');
                            if (quantityElement) {
                                quantityElement.textContent = `Quantity: ${newQuantity}`;
                            } else {
                                console.error(`Quantity element not found within candy element with ID ${_id}`);
                            }
                        } else {
                            console.error(`Candy with ID ${_id} not found on the frontend.`);
                        }
                    })
                    .catch((error) => {
                        console.error(`Error updating candy with ID ${_id} on the server:`, error);
                    });
            } else {
                // Handle insufficient quantity error more gracefully
                console.error(`Insufficient quantity for candy with ID ${_id}`);
            }
        })
        .catch((error) => {
            console.error(`Error fetching candy with ID ${_id} from the server:`, error);
        });
}
