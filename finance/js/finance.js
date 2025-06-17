// Finance section JavaScript

$(document).ready(function() {
    initializeCharts();

    $('#reports-tab').on('shown.bs.tab', function (e) {
        initializeCharts();
    });

    // Reports filters
    $('#applyFilters').on('click', function() {
        const filters = {
            farm: $('#farmFilter').val(),
            paddock: $('#paddockFilter').val(),
            responsable: $('#responsableFilter').val(),
            dateRange: $('#dateRangeFilter').val()
        };
        updateCharts(filters);
    });

    $('#resetFilters').on('click', function() {
        $('#farmFilter').val('');
        $('#paddockFilter').val('');
        $('#responsableFilter').val('');
        $('#dateRangeFilter').val('7');
        initializeCharts();
    });

    // Income filters
    $('#applyIncomeFilters').on('click', function() {
        const filters = {
            farm: $('#incomeFarmFilter').val(),
            paddock: $('#incomePaddockFilter').val(),
            category: $('#incomeCategoryFilter').val(),
            responsable: $('#incomeResponsableFilter').val(),
            dateRange: $('#incomeDateRangeFilter').val()
        };
        updateIncomeTable(filters);
    });
    $('#resetIncomeFilters').on('click', function() {
        $('#incomeFarmFilter').val('');
        $('#incomePaddockFilter').val('');
        $('#incomeCategoryFilter').val('');
        $('#incomeResponsableFilter').val('');
        $('#incomeDateRangeFilter').val('7');
        updateIncomeTable();
    });

    // Expenses filters
    $('#applyExpensesFilters').on('click', function() {
        const filters = {
            farm: $('#expensesFarmFilter').val(),
            paddock: $('#expensesPaddockFilter').val(),
            category: $('#expensesCategoryFilter').val(),
            responsable: $('#expensesResponsableFilter').val(),
            dateRange: $('#expensesDateRangeFilter').val()
        };
        updateExpensesTable(filters);
    });
    $('#resetExpensesFilters').on('click', function() {
        $('#expensesFarmFilter').val('');
        $('#expensesPaddockFilter').val('');
        $('#expensesCategoryFilter').val('');
        $('#expensesResponsableFilter').val('');
        $('#expensesDateRangeFilter').val('7');
        updateExpensesTable();
    });

    updateIncomeTable();
    updateExpensesTable();
});

// Sample income data
const incomeData = [
    { date: '2024-03-15', farm: 'Farm 1', field: 'Field A', amount: 2500.00, responsable: 'John Doe', category: 'Crop Sale', description: 'Wheat harvest sale', status: 'Completed' },
    { date: '2024-05-05', farm: 'Farm 3', field: 'Field C', amount: 1800.00, responsable: 'Carlos Ruiz', category: 'Produce Sale', description: 'Vegetable batch sale', status: 'Completed' },
    { date: '2024-07-12', farm: 'Farm 1', field: 'Field B', amount: 3200.00, responsable: 'John Doe', category: 'Harvest Sale', description: 'Corn harvest sale', status: 'Completed' },
    { date: '2024-09-22', farm: 'Farm 3', field: 'Field A', amount: 2100.00, responsable: 'Carlos Ruiz', category: 'Crop Sale', description: 'Soybean sale', status: 'Completed' },
    { date: '2024-11-14', farm: 'Farm 1', field: 'Field C', amount: 2800.00, responsable: 'John Doe', category: 'Produce Sale', description: 'Fruit batch sale', status: 'Completed' },
    { date: '2024-12-03', farm: 'Farm 2', field: 'Field A', amount: 1900.00, responsable: 'Jane Smith', category: 'Equipment Rental', description: 'Tractor rental income', status: 'Completed' }
];

// Sample expenses data
const expensesData = [
    { date: '2024-04-10', farm: 'Farm 2', field: 'Field B', amount: -1500.00, responsable: 'Jane Smith', category: 'Equipment Purchase', description: 'New tractor parts', status: 'Completed' },
    { date: '2024-06-20', farm: 'Farm 4', field: 'Field A', amount: -800.00, responsable: 'Amina Patel', category: 'Maintenance Costs', description: 'Irrigation system repair', status: 'Completed' },
    { date: '2024-08-18', farm: 'Farm 2', field: 'Field C', amount: -1200.00, responsable: 'Jane Smith', category: 'Fertilizer Purchase', description: 'Nitrogen fertilizer', status: 'Completed' },
    { date: '2024-10-30', farm: 'Farm 4', field: 'Field B', amount: -950.00, responsable: 'Amina Patel', category: 'Irrigation Costs', description: 'Water pump maintenance', status: 'Completed' },
    { date: '2024-12-03', farm: 'Farm 2', field: 'Field A', amount: -1100.00, responsable: 'Jane Smith', category: 'Pest Control', description: 'Pesticide purchase', status: 'Completed' }
];

function getFilteredIncome(filters = {}) {
    return incomeData.filter(act => {
        if (filters.farm && act.farm !== filters.farm) return false;
        if (filters.paddock && act.field !== filters.paddock) return false;
        if (filters.category && act.category !== filters.category) return false;
        if (filters.responsable && act.responsable !== filters.responsable) return false;
        if (filters.dateRange) {
            const now = new Date();
            const actDate = new Date(act.date);
            const daysAgo = parseInt(filters.dateRange);
            const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
            if (actDate < minDate) return false;
        }
        return true;
    });
}

function getFilteredExpenses(filters = {}) {
    return expensesData.filter(act => {
        if (filters.farm && act.farm !== filters.farm) return false;
        if (filters.paddock && act.field !== filters.paddock) return false;
        if (filters.category && act.category !== filters.category) return false;
        if (filters.responsable && act.responsable !== filters.responsable) return false;
        if (filters.dateRange) {
            const now = new Date();
            const actDate = new Date(act.date);
            const daysAgo = parseInt(filters.dateRange);
            const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
            if (actDate < minDate) return false;
        }
        return true;
    });
}

function updateIncomeTable(filters = {}) {
    const tbody = $("#income .table tbody");
    tbody.empty();
    getFilteredIncome(filters).forEach((act, idx) => {
        tbody.append(`
            <tr>
                <td>${act.date}</td>
                <td>${act.farm}</td>
                <td>${act.field}</td>
                <td class="text-success">+$${act.amount.toFixed(2)}</td>
                <td>${act.category}</td>
                <td>${act.description}</td>
                <td><span class=\"badge bg-success\">${act.status}</span></td>
                <td><button class=\"btn btn-outline-success btn-sm\" data-activity-idx=\"${idx}\">View</button></td>
            </tr>
        `);
    });
}

function updateExpensesTable(filters = {}) {
    const tbody = $("#expenses .table tbody");
    tbody.empty();
    getFilteredExpenses(filters).forEach((act, idx) => {
        tbody.append(`
            <tr>
                <td>${act.date}</td>
                <td>${act.farm}</td>
                <td>${act.field}</td>
                <td class="text-danger">$${act.amount.toFixed(2)}</td>
                <td>${act.category}</td>
                <td>${act.description}</td>
                <td><span class=\"badge bg-success\">${act.status}</span></td>
                <td><button class=\"btn btn-outline-success btn-sm\" data-activity-idx=\"${idx}\">View</button></td>
            </tr>
        `);
    });
}

function updateCharts(filters) {
    updateIncomeChart(filters);
    updateExpensesChart(filters);
    updateRevenueChart(filters);
    updateIncomeCategoryChart(filters);
    updateExpensesCategoryChart(filters);
    updateFarmRevenueChart(filters);
}

function updateIncomeChart(filters = {}) {
    const ctx = document.getElementById('incomeChart');
    if (!ctx) return;
    if (window.incomeChart && typeof window.incomeChart.destroy === 'function') {
        window.incomeChart.destroy();
    }
    const filtered = getFilteredIncome(filters);
    const allMonths = Array.from(new Set(filtered.map(act => {
        const d = new Date(act.date);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    })));
    allMonths.sort();
    const monthLabels = allMonths.map(ym => {
        const [year, month] = ym.split('-');
        return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month)-1]} ${year}`;
    });
    const monthly = allMonths.map(ym => {
        return filtered.filter(act => {
            const d = new Date(act.date);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === ym;
        }).reduce((sum, act) => sum + act.amount, 0);
    });
    const data = {
        labels: monthLabels,
        datasets: [{
            label: 'Income ($)',
            data: monthly.map(v => +v.toFixed(2)),
            borderColor: '#28a745',
            backgroundColor: 'rgba(40,167,69,0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    window.incomeChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Amount ($)' }
                }
            }
        }
    });
}

function updateExpensesChart(filters = {}) {
    const ctx = document.getElementById('expensesChart');
    if (!ctx) return;
    if (window.expensesChart && typeof window.expensesChart.destroy === 'function') {
        window.expensesChart.destroy();
    }
    const filtered = getFilteredExpenses(filters);
    const allMonths = Array.from(new Set(filtered.map(act => {
        const d = new Date(act.date);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    })));
    allMonths.sort();
    const monthLabels = allMonths.map(ym => {
        const [year, month] = ym.split('-');
        return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month)-1]} ${year}`;
    });
    const monthly = allMonths.map(ym => {
        return filtered.filter(act => {
            const d = new Date(act.date);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === ym;
        }).reduce((sum, act) => sum + Math.abs(act.amount), 0);
    });
    const data = {
        labels: monthLabels,
        datasets: [{
            label: 'Expenses ($)',
            data: monthly.map(v => +v.toFixed(2)),
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220,53,69,0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    window.expensesChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Amount ($)' }
                }
            }
        }
    });
}

function updateRevenueChart(filters = {}) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    if (window.revenueChart && typeof window.revenueChart.destroy === 'function') {
        window.revenueChart.destroy();
    }
    const incomeFiltered = getFilteredIncome(filters);
    const expensesFiltered = getFilteredExpenses(filters);
    const allMonths = Array.from(new Set([
        ...incomeFiltered.map(act => {
            const d = new Date(act.date);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        }),
        ...expensesFiltered.map(act => {
            const d = new Date(act.date);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        })
    ]));
    allMonths.sort();
    const monthLabels = allMonths.map(ym => {
        const [year, month] = ym.split('-');
        return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month)-1]} ${year}`;
    });
    const monthly = allMonths.map(ym => {
        const income = incomeFiltered.filter(act => {
            const d = new Date(act.date);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === ym;
        }).reduce((sum, act) => sum + act.amount, 0);
        const expenses = expensesFiltered.filter(act => {
            const d = new Date(act.date);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === ym;
        }).reduce((sum, act) => sum + act.amount, 0);
        return income + expenses; // expenses are negative, so this gives us net revenue
    });
    const data = {
        labels: monthLabels,
        datasets: [{
            label: 'Revenue ($)',
            data: monthly.map(v => +v.toFixed(2)),
            borderColor: '#495057',
            backgroundColor: 'rgba(73,80,87,0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    window.revenueChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Amount ($)' }
                }
            }
        }
    });
}

function updateIncomeCategoryChart(filters = {}) {
    const ctx = document.getElementById('incomeCategoryChart');
    if (!ctx) return;
    if (window.incomeCategoryChart && typeof window.incomeCategoryChart.destroy === 'function') {
        window.incomeCategoryChart.destroy();
    }
    const categories = ['Crop Sale', 'Produce Sale', 'Harvest Sale', 'Equipment Rental'];
    const categoryData = categories.map(cat => {
        return getFilteredIncome(filters).filter(act => act.category === cat).reduce((sum, act) => sum + act.amount, 0);
    });
    const data = {
        labels: categories,
        datasets: [{
            data: categoryData.map(v => +v.toFixed(2)),
            backgroundColor: [
                '#28a745',
                '#20c997',
                '#17a2b8',
                '#6f42c1'
            ]
        }]
    };
    window.incomeCategoryChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.parsed || 0;
                            return label + ': $' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function updateExpensesCategoryChart(filters = {}) {
    const ctx = document.getElementById('expensesCategoryChart');
    if (!ctx) return;
    if (window.expensesCategoryChart && typeof window.expensesCategoryChart.destroy === 'function') {
        window.expensesCategoryChart.destroy();
    }
    const categories = ['Equipment Purchase', 'Maintenance Costs', 'Fertilizer Purchase', 'Irrigation Costs', 'Pest Control'];
    const categoryData = categories.map(cat => {
        return getFilteredExpenses(filters).filter(act => act.category === cat).reduce((sum, act) => sum + Math.abs(act.amount), 0);
    });
    const data = {
        labels: categories,
        datasets: [{
            data: categoryData.map(v => +v.toFixed(2)),
            backgroundColor: [
                '#dc3545',
                '#fd7e14',
                '#e83e8c',
                '#6f42c1',
                '#20c997'
            ]
        }]
    };
    window.expensesCategoryChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.parsed || 0;
                            return label + ': $' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function updateFarmRevenueChart(filters = {}) {
    const ctx = document.getElementById('farmRevenueChart');
    if (!ctx) return;
    if (window.farmRevenueChart && typeof window.farmRevenueChart.destroy === 'function') {
        window.farmRevenueChart.destroy();
    }
    const farms = ['Farm 1', 'Farm 2', 'Farm 3', 'Farm 4'];
    const farmData = farms.map(farm => {
        const income = getFilteredIncome(filters).filter(act => act.farm === farm).reduce((sum, act) => sum + act.amount, 0);
        const expenses = getFilteredExpenses(filters).filter(act => act.farm === farm).reduce((sum, act) => sum + act.amount, 0);
        return income + expenses; // expenses are negative, so this gives us net revenue
    });
    const data = {
        labels: farms,
        datasets: [{
            data: farmData.map(v => +v.toFixed(2)),
            backgroundColor: [
                'rgb(220, 53, 69)',
                'rgb(111, 66, 193)',
                'rgb(253, 126, 20)',
                'rgb(32, 201, 151)'
            ]
        }]
    };
    window.farmRevenueChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.parsed || 0;
                            return label + ': $' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function initializeCharts() {
    updateIncomeChart();
    updateExpensesChart();
    updateRevenueChart();
    updateIncomeCategoryChart();
    updateExpensesCategoryChart();
    updateFarmRevenueChart();
} 