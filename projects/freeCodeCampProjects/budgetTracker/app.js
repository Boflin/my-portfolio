// step 1: initialize variables
let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;


// load transactions from local storage if available
if (localStorage.getItem('transactions')) {
    transactions = JSON.parse(localStorage.getitem('transactions'));
    updateSummary();
    renderTransactions();
}

// step 2: Handle form Submission
document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    const transaction = {
        id: Date.now(),
        description,
        amount,
        category
    };

    transactions.push(transaction);
    updateLocalStorage();
    updateSummery();
    renderTransactions();

    // clear the form
    document.getElementById('transaction-form').reset();
});

// Step 3: Update the Summary
function updateSummary() {
    totalIncome = transactions
        .filter(t => t.category === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    totalExpenses = transactions
        .filter(t => t.category === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    document.getElementById('total-income').innerText = totalIncome.toFixed(2);
    document.getElementById('total-expenses').innerText = totalExpenses.toFixed(2);
    document.getElementById('balance').innerText = balance.toFixed(2);
}

// display the list of transactions on the page
function renderTransactions() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${transaction.description} - $${transaction.amount.toFixed(2)}
            <button onclick="deleteTransaction(${transaction.id})">X</button>
        `;
        transactionList.appendChild(li);
    });
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    updateSummary();
    renderTransactions();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
