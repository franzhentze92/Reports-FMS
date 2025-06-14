// Sample crop nutrition activities data
const activitiesData = [
    { date: '2024-01-12', farm: 'Farm 1', field: 'Field A', activity: 'Fertigation', responsable: 'John Doe', nutrient: 'Nitrogen', amount: 25, status: 'Completed' },
    { date: '2024-02-18', farm: 'Farm 2', field: 'Field B', activity: 'Foliar Spray', responsable: 'Jane Smith', nutrient: 'Phosphorus', amount: 18, status: 'Completed' },
    { date: '2024-03-10', farm: 'Farm 3', field: 'Field C', activity: 'Fertigation', responsable: 'Carlos Ruiz', nutrient: 'Potassium', amount: 30, status: 'Completed' },
    { date: '2024-04-05', farm: 'Farm 1', field: 'Field B', activity: 'Foliar Spray', responsable: 'Amina Patel', nutrient: 'Nitrogen', amount: 22, status: 'Completed' },
    { date: '2024-05-22', farm: 'Farm 4', field: 'Field A', activity: 'Fertigation', responsable: 'John Doe', nutrient: 'Phosphorus', amount: 28, status: 'Completed' },
    { date: '2024-06-15', farm: 'Farm 2', field: 'Field C', activity: 'Foliar Spray', responsable: 'Jane Smith', nutrient: 'Potassium', amount: 20, status: 'Completed' },
    { date: '2024-07-08', farm: 'Farm 3', field: 'Field B', activity: 'Fertigation', responsable: 'Carlos Ruiz', nutrient: 'Nitrogen', amount: 26, status: 'Completed' },
    { date: '2024-08-19', farm: 'Farm 1', field: 'Field C', activity: 'Foliar Spray', responsable: 'Amina Patel', nutrient: 'Phosphorus', amount: 19, status: 'Completed' },
    { date: '2024-09-27', farm: 'Farm 4', field: 'Field B', activity: 'Fertigation', responsable: 'John Doe', nutrient: 'Potassium', amount: 24, status: 'Completed' },
    { date: '2024-10-14', farm: 'Farm 2', field: 'Field A', activity: 'Foliar Spray', responsable: 'Jane Smith', nutrient: 'Nitrogen', amount: 21, status: 'Completed' },
    { date: '2024-11-03', farm: 'Farm 3', field: 'Field C', activity: 'Fertigation', responsable: 'Carlos Ruiz', nutrient: 'Phosphorus', amount: 27, status: 'Completed' },
    { date: '2024-12-21', farm: 'Farm 1', field: 'Field A', activity: 'Foliar Spray', responsable: 'Amina Patel', nutrient: 'Potassium', amount: 23, status: 'Completed' }
];

function updateActivitiesTable() {
    const tbody = $("#activities .table tbody");
    tbody.empty();
    activitiesData.forEach(act => {
        tbody.append(`
            <tr>
                <td>${act.date}</td>
                <td>${act.farm}</td>
                <td>${act.field}</td>
                <td>${act.activity}</td>
                <td>${act.responsable}</td>
                <td><span class="badge bg-success">${act.status}</span></td>
            </tr>
        `);
    });
}

function getFilteredActivities(filters = {}) {
    return activitiesData.filter(act => {
        if (filters.farm && act.farm !== filters.farm) return false;
        if (filters.paddock && act.field !== filters.paddock) return false;
        if (filters.responsable && act.responsable !== filters.responsable) return false;
        if (filters.nutrient && act.nutrient !== filters.nutrient) return false;
        if (filters.fertType && act.activity !== filters.fertType) return false;
        // Date range filter
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

// Distinct color sets for all pie charts (no repeats)
const pieColors = [
    '#b48a78', // brown
    '#d2b48c', // tan
    '#a0522d', // sienna
    '#deb887', // burlywood
    '#8d5524', // dark brown
    '#e0c097', // light tan
    '#c68642', // light brown
    '#bc8f8f', // rosy brown
    '#cd853f', // peru
    '#f4a460', // sandy brown
    '#e97451', // burnt sienna
    '#c19a6b', // camel
    '#a67b5b', // french beige
    '#b87333', // copper
    '#e1a95f', // earth yellow
    '#bdb76b'  // dark khaki
];

// Unique color assignments for each label across all three pie charts
const paddockColors = ['#b48a78', '#d2b48c', '#a0522d']; // 3 paddocks
const farmColors    = ['#deb887', '#8d5524', '#e0c097', '#c68642']; // 4 farms
const responsableColors = ['#bc8f8f', '#cd853f', '#f4a460', '#e97451']; // 4 responsables

function updateNutrientUsageChart(filters = {}) {
    const ctx = document.getElementById('nutrientUsageChart');
    if (!ctx) return;
    if (window.nutrientUsageChart && typeof window.nutrientUsageChart.destroy === 'function') {
        window.nutrientUsageChart.destroy();
    }
    // Group by month+year
    const filtered = getFilteredActivities(filters);
    // Get all unique year-months in the data
    const allMonths = Array.from(new Set(filtered.map(act => {
        const d = new Date(act.date);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    })));
    allMonths.sort();
    // Map to labels like 'Jan 2024'
    const monthLabels = allMonths.map(ym => {
        const [year, month] = ym.split('-');
        return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month)-1]} ${year}`;
    });
    // Sum amount per month
    const monthly = allMonths.map(ym => {
        return filtered.filter(act => {
            const d = new Date(act.date);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === ym;
        }).reduce((sum, act) => sum + act.amount, 0);
    });
    const data = {
        labels: monthLabels,
        datasets: [{
            label: 'Nutrient Applied (kg)',
            data: monthly.map(v => +v.toFixed(2)),
            backgroundColor: 'rgba(160,82,45,0.15)',
            borderColor: '#a0522d',
            fill: true,
            tension: 0.4
        }]
    };
    window.nutrientUsageChart = new Chart(ctx, {
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
                    title: { display: true, text: 'Nutrient Applied (kg)' }
                }
            }
        }
    });
}

function updatePaddockDistributionChart(filters = {}) {
    const ctx = document.getElementById('paddockDistributionChart');
    if (!ctx) return;
    if (window.paddockDistributionChart && typeof window.paddockDistributionChart.destroy === 'function') {
        window.paddockDistributionChart.destroy();
    }
    const paddocks = ['Field A', 'Field B', 'Field C'];
    const filtered = getFilteredActivities(filters);
    const paddockData = paddocks.map(field => {
        return filtered.filter(act => act.field === field).reduce((sum, act) => sum + act.amount, 0);
    });
    const data = {
        labels: paddocks,
        datasets: [{
            label: 'Nutrient Applied (kg)',
            data: paddockData.map(v => +v.toFixed(2)),
            backgroundColor: paddockColors,
        }]
    };
    window.paddockDistributionChart = new Chart(ctx, {
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
                            return label + ': ' + value + ' kg';
                        }
                    }
                }
            }
        }
    });
}

function updateFarmDistributionChart(filters = {}) {
    const ctx = document.getElementById('farmDistributionChart');
    if (!ctx) return;
    if (window.farmDistributionChart && typeof window.farmDistributionChart.destroy === 'function') {
        window.farmDistributionChart.destroy();
    }
    const farms = ['Farm 1', 'Farm 2', 'Farm 3', 'Farm 4'];
    const filtered = getFilteredActivities(filters);
    const farmData = farms.map(farm => {
        return filtered.filter(act => act.farm === farm).reduce((sum, act) => sum + act.amount, 0);
    });
    const data = {
        labels: farms,
        datasets: [{
            label: 'Nutrient Applied (kg)',
            data: farmData.map(v => +v.toFixed(2)),
            backgroundColor: farmColors,
        }]
    };
    window.farmDistributionChart = new Chart(ctx, {
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
                            return label + ': ' + value + ' kg';
                        }
                    }
                }
            }
        }
    });
}

function updateResponsableDistributionChart(filters = {}) {
    const ctx = document.getElementById('responsableDistributionChart');
    if (!ctx) return;
    if (window.responsableDistributionChart && typeof window.responsableDistributionChart.destroy === 'function') {
        window.responsableDistributionChart.destroy();
    }
    const responsables = ['John Doe', 'Jane Smith', 'Carlos Ruiz', 'Amina Patel'];
    const filtered = getFilteredActivities(filters);
    const responsableData = responsables.map(res => {
        return filtered.filter(act => act.responsable === res).reduce((sum, act) => sum + act.amount, 0);
    });
    const data = {
        labels: responsables,
        datasets: [{
            label: 'Nutrient Applied (kg)',
            data: responsableData.map(v => +v.toFixed(2)),
            backgroundColor: responsableColors,
        }]
    };
    window.responsableDistributionChart = new Chart(ctx, {
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
                            return label + ': ' + value + ' kg';
                        }
                    }
                }
            }
        }
    });
}

// Update all charts when reports tab is shown or filters are applied
function updateAllCharts(filters = {}) {
    updateNutrientUsageChart(filters);
    updatePaddockDistributionChart(filters);
    updateFarmDistributionChart(filters);
    updateResponsableDistributionChart(filters);
}

$(document).ready(function() {
    updateActivitiesTable();
    $('#reports-tab').on('shown.bs.tab', function (e) {
        updateAllCharts();
    });
    $('#applyFilters').on('click', function() {
        const filters = {
            farm: $('#farmFilter').val(),
            paddock: $('#paddockFilter').val(),
            responsable: $('#responsableFilter').val(),
            dateRange: $('#dateRangeFilter').val(),
            nutrient: $('#nutrientFilter').val(),
            fertType: $('#fertTypeFilter').val()
        };
        updateAllCharts(filters);
    });
    $('#resetFilters').on('click', function() {
        updateAllCharts();
    });
    updateAllCharts();
}); 