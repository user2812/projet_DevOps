const searchFormInput = document.querySelector("#search-form-input");

document.addEventListener("DOMContentLoaded", e => {
    searchFormInput.placeholder = "Search Income";
    toggleAccordionButtons();
})

searchFormInput.addEventListener("keyup", e => searchMatchingResults(e));

function searchMatchingResults(e) {
    const searchValue = e.target.value.trim();
    
    if (searchValue.length > 0) {

        fetch("/income/search-income", {
            method: "POST",
            body: JSON.stringify({'search-form-input' : searchValue})
        })
        .then(response => response.json())
        .then(result => {
            // clear tbody
            const tbody = document.querySelector("#app-table-tbody");
            tbody.innerHTML = null;
            let innerhtml = '';

            if (result.length == 0) {
                innerhtml = `<p class="mt-3">no matching results to show.</p>`
            } else {
                result.forEach(income => {

                    innerhtml += `<div class="accordion accordion-flush" id="accordion-description"><tr>
                    <td>${ income.income_stream }</td>
                    <td>${ income.amount }</td>
                    <td>
                            <div class="accordion-button" style="max-width: 400px;" data-bs-toggle="collapse" data-bs-target="#collapse-${ income.id }" aria-expanded="false" aria-controls="collapse-${ income.id }">
                                <button type="button" class="btn btn-outline-info btn-sm me-2">Expand</button>
                                <div class="d-inline-block text-truncate" style="max-width: 400px;">${ income.description }</div>
                            </div>
                            <div class="accordion-item">
                                <div id="collapse-${ income.id }" class="accordion-collapse collapse" data-bs-parent="#accordion-description">
                                <div class="accordion-body" style="max-width: 400px;">${ income.description }</div>
                                </div>
                            </div>
                        
                
                    </td>
                    <td>${ income.date }</td>
                    <td>
                        <button onclick="getIncomeObj('${ income.id }')" type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editIncomeModal">
                            <!-- edit icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </button>
                        <button onclick="deleteIncomeObj('${ income.id }')" type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteIncomeModal">
                            <!-- trash icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                            </svg>
                        </button>
                    </td>
                </tr></div>`
    
                })
            }

            tbody.innerHTML = innerhtml;
            toggleAccordionButtons();

        })
    } else {
        // return state to original
        window.location.href = "/income";
    }
}


function getIncomeObj(id) {
    // clear out values while page is loading
    document.getElementById("modal-amount").value = null;
    document.getElementById("modal-date").value = null;
    document.getElementById("modal-description").value = null;

    fetch("/income/edit-income/"+id, {
        method : 'GET',
    })
    .then(response => response.json())
    .then(result => {
        document.getElementById("modal-amount").value = result.amount;
        document.getElementById("modal-date").value = result.date;
        document.getElementById("modal-description").value = result.description;
        const categoryID = "modal-income-stream-" + result.income_stream;
        document.getElementById(categoryID).checked = true;
        document.getElementById("edit-income-form").action = `/income/edit-income/${id}`
    
    })
}

function deleteIncomeObj(id) {
    document.getElementById("delete-income-form").action = `/income/delete-income/${id}`
}

function toggleAccordionButtons() {
    const accordionBtnList = document.querySelectorAll(".accordion-button");
    accordionBtnList.forEach(accordionBtn => {
        accordionBtn.addEventListener("click", e => {
            const visibility = accordionBtn.lastElementChild.style.visibility;
            if (visibility == "hidden") {
                accordionBtn.lastElementChild.style.visibility = "visible";
                accordionBtn.firstElementChild.innerHTML = "Expand";
            } else {
                accordionBtn.lastElementChild.style.visibility = "hidden";
                accordionBtn.firstElementChild.innerHTML = "Hide";
            }
        })
    })
}





