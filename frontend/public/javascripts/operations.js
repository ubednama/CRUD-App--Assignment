let operation;

function fetchData(event, operation, method, item) {
    event.preventDefault();

    const requestOptions = {
        method : method,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let url;
    console.log("from operation ", item)
    if(operation === 'create') {
        requestOptions.body = JSON.stringify(item);
        url = `/${tableName}/`
    } else url = `/${tableName}/${item.id}`;

    console.log("url from operations",url)
    if(operation === 'update') {
        requestOptions.body = JSON.stringify({newItemName: item.new});
    }

    const messageElement = document.getElementById('operationCategoryName');

    fetch(url, requestOptions)
        .then(response => {
            console.log(`Got response for "${operation.toUpperCase()}" from server:`, response);
            return response.json();
        })
        .then(data => {
            console.log('Window loaded');
            console.log("Response data:", data);
            document.getElementById('operationsMessage').style.display = 'block'
            messageElement.textContent = data.message;
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error(`${operation} operation failed:`, error.message);
        });
}

function createNewItem(event) {
    event.preventDefault();
    const nameInput = document.getElementById('newItemName')
    const categoryIdInput = document.getElementById('newItemCategoryId')
    const categoryPlaceholder = categoryIdInput.placeholder;
    
    let categoryId = categoryIdInput.value.trim();

    const placeholder = nameInput.placeholder;
    let newName = nameInput.value.trim();
    
    console.log("from create", newName ,"")

    if(!newName || !categoryId) {
        setTimeout(()=>{
            nameInput.placeholder = placeholder;
            categoryIdInput.placeholder = categoryPlaceholder;
        }, 1000)
        nameInput.placeholder = `Give new ${title} Name`;
        categoryIdInput.placeholder = `Give Category ID`
    }

    const id = document.getElementById('newItemId').value.trim();

    const item = {
        id: id,
        Name: newName,
        categoryId: categoryId
    };
    console.log("from create operations",item)
    operation = 'create'
    fetchData(event, operation, 'POST', item);
}

document.getElementById("ok-button").addEventListener('click', function () {
    const currentOperation = operation;
    okFunction(currentOperation);
});

function okFunction(operation) {
    document.getElementById('operationsMessage').style.display = 'none';
    if(operation === 'delete' && tableLimit === 1){
        window.location.href = `?page=${cP - 1}&limit=${limit}`;
    } else {
        window.location.href = `?page=${cP}&limit=${limit}`;
    }
}

function deleteItemFunction(event, button) {
    const id = button.getAttribute("itemId")
    if(!id) {
        console.log("from delete", id);
    } else {
    const item = {
        id: id
    }
    operation = 'delete'
    fetchData(event, operation, 'DELETE', item);}
}

function updateItemFunction(event, button) {

    operation = 'update'
    const updateModal = document.getElementById('updateMessage');
    updateModal.style.display = 'block';

    console.log("before close button")
        const closeButton = document.getElementById('closeButton');
        closeButton.addEventListener('click', function() {
            console.log("close button clicked")
            updateModal.style.display = 'none';
        });

        const id = button.getAttribute('itemId');
        const oldName = button.getAttribute('itemName');
        console.log("update: ", id, oldName)
        
        const item = {
            id: id,
            name: oldName
        }
        
        const pname = document.getElementById('updateCategoryName');
        
        pname.innerHTML  = `Give new Name for ${title} <br> ${oldName} having ID ${id}`;
        const update = document.getElementById('confirmUpdate');
        
        
        update.addEventListener('click', function(event) {
            const newValue = document.getElementById('updateCategoryNewName').value;
            if(!newValue) {
                pname.textContent = `Give new ${title} name`;
                event.preventDefault();
                console.log("after check");}
            else {
                    event.preventDefault();
                    item.new = newValue;
                    console.log("from update function: ",item)
                    fetchData(event, operation ,'PUT', item);
                    updateModal.style.display = 'none';
            }}
        )

}

function searchItem(event) {
    event.preventDefault();
    const input = document.getElementById('itemSearch');
    const originalPlaceholder = input.placeholder;
    const search = input.value.trim();
    console.log("from search", search)
    if (search === '') {
        setTimeout(() => {
            input.placeholder = originalPlaceholder;
        }, 1000);
        input.placeholder = "Give value";
    }

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('search', search);

    let newPathname = window.location.pathname;

    newPathname = newPathname.replace(/\/\d+\/products/, '/products');

    const newUrl = `${newPathname}?${urlParams.toString()}`;

    window.location.href = newUrl;
    
    document.getElementById('clearButton').style.display = '';
}


function resetSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('search')
    const currentUrl = window.location.pathname + '?' + urlParams.toString();
    window.location.href = currentUrl;
}