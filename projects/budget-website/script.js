// Get DOM elements
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('list');
const formEl = document.getElementById('form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const categoryEl = document.getElementById('category');
const currentSavingsEl = document.getElementById('currentSavings');
const savingsGoalEl = document.getElementById('savingsGoal');
const updateSavingsBtn = document.getElementById('updateSavings');
const progressFillEl = document.getElementById('progressFill');
const progressTextEl = document.getElementById('progressText');
const recommendedSavingsEl = document.getElementById('recommendedSavings');
const monthlyIncomeTextEl = document.getElementById('monthlyIncomeText');
const monthlyExpensesTextEl = document.getElementById('monthlyExpensesText');
const disposableIncomeTextEl = document.getElementById('disposableIncomeText');
const recommendedPercentTextEl = document.getElementById('recommendedPercentText');
const amountNeededTextEl = document.getElementById('amountNeededText');
const timeToGoalTextEl = document.getElementById('timeToGoalText');
const goalDateTextEl = document.getElementById('goalDateText');
const interestRateEl = document.getElementById('interestRate');
const sixMonthProjectionEl = document.getElementById('sixMonthProjection');
const oneYearProjectionEl = document.getElementById('oneYearProjection');
const twoYearProjectionEl = document.getElementById('twoYearProjection');
const fiveYearProjectionEl = document.getElementById('fiveYearProjection');

// Define categories
const categories = {
    income: [
        'Paycheck',
        'Tax Return',
        'Dividend',
        'Investment Return',
        'Side Hustle',
        'Gift',
        'Bonus',
        'Interest',
        'Rental Income',
        'Other Income'
    ],
    expense: [
        'Housing',
        'Transportation',
        'Food',
        'Utilities',
        'Healthcare',
        'Entertainment',
        'Shopping',
        'Education',
        'Debt Payments',
        'Insurance',
        'Savings',
        'Investments',
        'Personal Care',
        'Gifts',
        'Travel',
        'Other Expenses'
    ]
};

// Initialize Chart
let expenseChart;

// Get transactions and savings from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let savings = JSON.parse(localStorage.getItem('savings')) || {
    current: 0,
    goal: 0
};

// Initialize transactions array
// let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Show transaction form
function showTransactionForm(type) {
    const modal = document.getElementById('transactionForm');
    const title = document.getElementById('transactionFormTitle');
    const form = document.getElementById('form');
    const amountInput = document.getElementById('amount');
    const categoryContainer = document.querySelector('.form-control:has(#category)');
    const categorySelect = document.getElementById('category');
    
    // Reset form
    form.reset();
    
    // Set title based on type
    title.innerText = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    // Show modal with animation
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    
    // Trigger reflow to enable animation
    modal.offsetHeight;
    modal.classList.add('show');
    
    // Update category options based on type
    categorySelect.innerHTML = '<option value="">Select a category...</option>';
    const relevantCategories = type === 'income' ? categories.income : categories.expense;
    relevantCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Handle form fields based on type
    if (type === 'expense') {
        amountInput.setAttribute('placeholder', 'Enter expense amount...');
        amountInput.addEventListener('input', function() {
            if (this.value > 0) this.value = -this.value;
        });
        categoryContainer.style.display = 'block';
        categorySelect.required = true;
        categorySelect.value = '';
    } else {
        amountInput.setAttribute('placeholder', 'Enter income amount...');
        amountInput.addEventListener('input', function() {
            if (this.value < 0) this.value = Math.abs(this.value);
        });
        categoryContainer.style.display = 'block'; // Show category for income too
        categorySelect.required = true;
        categorySelect.value = '';
    }
    
    // Focus on description field
    document.getElementById('description').focus();
}

// Hide transaction form
function hideTransactionForm() {
    const modal = document.getElementById('transactionForm');
    const form = document.getElementById('form');
    
    // Hide modal with animation
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        modal.style.display = 'none';
        form.reset();
    }, 300);
}

// Close modal when clicking outside
document.getElementById('transactionForm').addEventListener('click', function(e) {
    if (e.target === this) {
        hideTransactionForm();
    }
});

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = amountEl.value.trim();
    const category = categoryEl.value;

    // Validate form
    if (description === '' || amount === '' || category === '') {
        alert('Please fill in all fields');
        return;
    }

    const transaction = {
        id: generateID(),
        description: description,
        category: category,
        amount: +amount,
        timestamp: new Date().toISOString()
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    
    // Hide modal after successful submission
    hideTransactionForm();
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.description}
        <span class="category-total">${transaction.category}</span>
        <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
    `;

    listEl.appendChild(item);
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Update local storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update the balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);

    balanceEl.innerText = `$${total}`;
    moneyPlusEl.innerText = `+$${income}`;
    moneyMinusEl.innerText = `-$${expense}`;
    
    updateChart();
    updateSavingsRecommendation();
}

// Update chart
function updateChart() {
    const expensesByCategory = {};
    
    // Group expenses by category
    transactions
        .filter(t => t.amount < 0)
        .forEach(t => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + Math.abs(t.amount);
        });
    
    const data = {
        labels: Object.keys(expensesByCategory),
        datasets: [{
            data: Object.values(expensesByCategory),
            backgroundColor: [
                '#ff6384',
                '#36a2eb',
                '#ffce56',
                '#4bc0c0',
                '#9966ff',
                '#ff9f40',
                '#4d5360',
                '#2ecc71',
                '#e74c3c',
                '#95a5a6',
                '#d35400',
                '#3498db',
                '#2c3e50',
                '#f1c40f',
                '#8e44ad',
                '#16a085'
            ]
        }]
    };

    if (expenseChart) {
        expenseChart.destroy();
    }

    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Calculate and update savings recommendation
function updateSavingsRecommendation() {
    const amounts = transactions.map(transaction => transaction.amount);
    const monthlyIncome = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0);
    const monthlyExpenses = Math.abs(amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0));
    
    const disposableIncome = monthlyIncome - monthlyExpenses;
    // Recommend 20% of disposable income for savings
    const recommendedAmount = Math.max(disposableIncome * 0.2, 0).toFixed(2);
    
    // Update all the detailed text elements
    monthlyIncomeTextEl.innerText = `$${monthlyIncome.toFixed(2)}`;
    monthlyExpensesTextEl.innerText = `$${monthlyExpenses.toFixed(2)}`;
    disposableIncomeTextEl.innerText = `$${disposableIncome.toFixed(2)}`;
    recommendedPercentTextEl.innerText = `$${recommendedAmount}`;
    recommendedSavingsEl.innerText = `$${recommendedAmount}`;
    
    // Update savings projections
    updateSavingsProjections(parseFloat(recommendedAmount));

    // Calculate timeline
    const amountNeeded = Math.max(savings.goal - savings.current, 0);
    amountNeededTextEl.innerText = `$${amountNeeded.toFixed(2)}`;

    if (parseFloat(recommendedAmount) > 0) {
        const monthsToGoal = Math.ceil(amountNeeded / parseFloat(recommendedAmount));
        timeToGoalTextEl.innerText = `${monthsToGoal} month${monthsToGoal !== 1 ? 's' : ''}`;
        
        // Calculate expected completion date
        const currentDate = new Date();
        const goalDate = new Date(currentDate.setMonth(currentDate.getMonth() + monthsToGoal));
        goalDateTextEl.innerText = goalDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
    } else {
        timeToGoalTextEl.innerText = 'N/A';
        goalDateTextEl.innerText = 'N/A';
    }
}

// Update savings in localStorage
function updateSavingsStorage() {
    localStorage.setItem('savings', JSON.stringify(savings));
}

// Calculate compound interest for savings projections
function calculateCompoundInterest(principal, monthlyContribution, annualRate, years) {
    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    let total = principal;
    
    for (let i = 0; i < months; i++) {
        total += monthlyContribution;
        total *= (1 + monthlyRate);
    }
    
    return total;
}

// Update savings projections
function updateSavingsProjections(monthlyContribution) {
    const currentSavings = savings.current;
    const annualRate = parseFloat(interestRateEl.value) || 0;
    
    const sixMonths = calculateCompoundInterest(currentSavings, monthlyContribution, annualRate, 0.5);
    const oneYear = calculateCompoundInterest(currentSavings, monthlyContribution, annualRate, 1);
    const twoYears = calculateCompoundInterest(currentSavings, monthlyContribution, annualRate, 2);
    const fiveYears = calculateCompoundInterest(currentSavings, monthlyContribution, annualRate, 5);
    
    sixMonthProjectionEl.innerText = `$${sixMonths.toFixed(2)}`;
    oneYearProjectionEl.innerText = `$${oneYear.toFixed(2)}`;
    twoYearProjectionEl.innerText = `$${twoYears.toFixed(2)}`;
    fiveYearProjectionEl.innerText = `$${fiveYears.toFixed(2)}`;
}

// Update savings progress
function updateSavingsProgress() {
    const progress = savings.goal > 0 ? (savings.current / savings.goal) * 100 : 0;
    progressFillEl.style.width = `${Math.min(progress, 100)}%`;
    progressTextEl.innerText = `${Math.min(progress, 100).toFixed(1)}%`;
}

// Handle savings update
function handleSavingsUpdate() {
    const currentSavings = parseFloat(currentSavingsEl.value) || 0;
    const savingsGoal = parseFloat(savingsGoalEl.value) || 0;
    
    savings.current = currentSavings;
    savings.goal = savingsGoal;
    
    updateSavingsStorage();
    updateSavingsProgress();
    updateSavingsRecommendation();
}

// Initialize app
function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    
    // Initialize savings values
    currentSavingsEl.value = savings.current;
    savingsGoalEl.value = savings.goal;
    updateSavingsProgress();
    updateSavingsRecommendation();
}

// Event listeners
formEl.addEventListener('submit', addTransaction);
updateSavingsBtn.addEventListener('click', handleSavingsUpdate);
interestRateEl.addEventListener('change', () => {
    const recommendedAmount = parseFloat(recommendedSavingsEl.innerText.replace('$', ''));
    updateSavingsProjections(recommendedAmount);
});

// Initialize app on load
init();