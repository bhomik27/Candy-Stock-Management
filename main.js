async function addToServer(event) {
    try {
        event.preventDefault();

        // let name = event.target.name.value;
        // let description = event.target.description.value;
        // let price = event.target.price.value;
        // let quantity = event.target.quantity.value;

        let name = document.getElementById('name').value;
        let description = document.getElementById('description').value;
        let price = document.getElementById('price').value;
        let quantity = document.getElementById('quantity').value;


        let Stock = {
            name,
            description,
            price,
            quantity
        };

        const response = await axios.post("//localhost:3000/stock/add-stock", Stock);
        const updatedStock = response.data;
        printStock(updatedStock);
        console.log(response);


        // Reset input fields
        document.getElementById('my-form').reset();

    } catch (err) {
        console.error(err);
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await axios.get("http://localhost:3000/stock/stocks");
        console.log(response.data);

        for (let i = 0; i < response.data.length; i++) {
            printStock(response.data[i]);
        }
    } catch (error) {
        console.log(error);
    }
});

function printStock(stock) {
    const parentElement = document.getElementById('stocks');
    const childElement = document.createElement('li');
    childElement.id = `${stock.id}`;

    childElement.innerHTML = `
        Item-Name: ${stock.name} <br>
        Description: ${stock.description} <br>
        Price: ${stock.price} <br>
        <span class="quantity">Quantity: ${stock.quantity}</span>
    `;

    const createButton = (id, text, onClick) => {
        const button = document.createElement('button');
        button.id = id;
        button.className = 'btn btn-primary';
        button.textContent = text;
        button.style.fontWeight = 'bold';
        button.onclick = onClick;
        return button;
    };



    const deleteButton = createButton('delete', 'Delete', () => deleteItem(stock.id));
    const editButton = createButton('edit', 'Edit', () => editItem(stock.id));

    deleteButton.style.backgroundColor = 'red';
    editButton.style.backgroundColor = 'green';


    const buyButton = (quantity) => {
        return createButton(`buy${quantity}`, `Buy ${quantity}`, () => updateItemStock(stock.id, -quantity));
    };

    childElement.appendChild(deleteButton);
    childElement.appendChild(editButton);
    childElement.appendChild(buyButton(1));
    childElement.appendChild(buyButton(2));
    childElement.appendChild(buyButton(3));

    parentElement.appendChild(childElement);
}


async function updateItemStock(id, quantityChange) {
    try {
        const response = await axios.get(`http://localhost:3000/stock/${id}`);
        const stockData = response.data;

        const currentQuantity = parseInt(stockData.quantity);
        const newQuantity = currentQuantity + quantityChange;

        if (newQuantity >= 0) {
            // Updated format to match the server's expected structure
            const updatedItemData = {
                quantityChange: quantityChange // Sending just the change in quantity
            };

            try {
                await axios.put(`http://localhost:3000/stock/${id}`, updatedItemData);

                const stockElement = document.getElementById(`${id}`);

                if (stockElement) {
                    const quantityElement = stockElement.querySelector('.quantity');
                    if (quantityElement) {
                        quantityElement.textContent = `Quantity: ${newQuantity}`;
                    } else {
                        console.error(`Quantity element not found within stock element with ID ${id}`);
                    }
                } else {
                    console.error(`Item with ID ${id} not found on the frontend.`);
                }
            } catch (updateError) {
                console.error(`Error updating item with ID ${id}: ${updateError.message}`);
            }
        } else {
            console.error(`Insufficient quantity for item with ID ${id}`);
        }
    } catch (error) {
        console.error(`Error fetching item with ID ${id}: ${error.message}`);
    }
}




async function deleteItem(id) {
    try {
        await axios.delete(`http://localhost:3000/stock/delete-stock/${id}`);

        const stockItem = document.getElementById(`${id}`);
        if (stockItem) {
            stockItem.remove();
        } else {
            console.error(`Item with ID ${id} not found on the frontend.`);
        }
    } catch (error) {
        console.error(`Error deleting item with ID ${id} from the server:`, error); d
    }
}


async function editItem(id) {
    try {
        const response = await axios.get(`http://localhost:3000/stock/edit-stock/${id}`);
        const stockData = response.data;

        console.log('Initial Item Name:', stockData.name);
    
        const newItemName = prompt('Enter new item name:', stockData.name);
        console.log('New Item Name from Prompt:', newItemName);
        const newDescription = prompt('Enter new description:', stockData.description);
        const newPrice = prompt('Enter new price:', stockData.price);
        const newQuantity = prompt('Enter new quantity:', stockData.quantity);

        const updatedStock = {
            name: newItemName ,
            description: newDescription || stockData.description,
            price: newPrice || stockData.price,
            quantity: newQuantity || stockData.quantity,
        };

        console.log('Updated Item Name:', updatedStock.name);


        await axios.put(`http://localhost:3000/stock/edit-stock/${id}`, updatedStock);

        const stockItem = document.getElementById(`${id}`);
        if (stockItem) {
            // stockItem.innerHTML = `
            //     Item-Name: ${updatedStock.name} <br>
            //     Description: ${updatedStock.description} <br>
            //     Price: ${updatedStock.price} <br>
            //     <span class="quantity">Quantity: ${updatedStock.quantity}</span>
            deleteItem(stockData.id);
            // `;
            printStock(updatedStock);
            
        } else {
            console.error(`Item with ID ${id} not found on the frontend.`);
        }
    } catch (error) {
        console.error(`Error updating item with ID ${id} on the server:`, error);
    }
}
