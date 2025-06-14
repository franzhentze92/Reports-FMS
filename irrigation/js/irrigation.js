// Irrigation section JavaScript

$(document).ready(function() {
    // Initialize charts immediately
    initializeCharts();

    // Re-initialize charts when the reports tab is shown
    $('#reports-tab').on('shown.bs.tab', function (e) {
        initializeCharts();
    });

    // Handle filter application
    $('#applyFilters').on('click', function() {
        const filters = {
            farm: $('#farmFilter').val(),
            paddock: $('#paddockFilter').val(),
            responsable: $('#responsableFilter').val(),
            dateRange: $('#dateRangeFilter').val()
        };
        updateCharts(filters);
    });

    // Handle filter reset
    $('#resetFilters').on('click', function() {
        $('#farmFilter').val('');
        $('#paddockFilter').val('');
        $('#responsableFilter').val('');
        $('#dateRangeFilter').val('7');
        initializeCharts();
    });

    // Settings tab: Load value from localStorage
    if (localStorage.getItem('cubicMetersPerHour')) {
        $('#cubicMetersPerHour').val(localStorage.getItem('cubicMetersPerHour'));
    }

    // Save settings form
    $('#settingsForm').on('submit', function(e) {
        e.preventDefault();
        const value = $('#cubicMetersPerHour').val();
        localStorage.setItem('cubicMetersPerHour', value);
        $('#settingsSavedMsg').removeClass('d-none');
        setTimeout(function() {
            $('#settingsSavedMsg').addClass('d-none');
        }, 2000);
    });

    // When switching to settings tab, load value
    $('#settings-tab').on('shown.bs.tab', function (e) {
        if (localStorage.getItem('cubicMetersPerHour')) {
            $('#cubicMetersPerHour').val(localStorage.getItem('cubicMetersPerHour'));
        } else {
            $('#cubicMetersPerHour').val('');
        }
        $('#settingsSavedMsg').addClass('d-none');
    });

    // Activities tab filters
    $('#applyActivitiesFilters').on('click', function() {
        const filters = {
            farm: $('#activitiesFarmFilter').val(),
            paddock: $('#activitiesPaddockFilter').val(),
            responsable: $('#activitiesResponsableFilter').val(),
            dateRange: $('#activitiesDateRangeFilter').val()
        };
        updateActivitiesTable(filters);
    });
    $('#resetActivitiesFilters').on('click', function() {
        $('#activitiesFarmFilter').val('');
        $('#activitiesPaddockFilter').val('');
        $('#activitiesResponsableFilter').val('');
        $('#activitiesDateRangeFilter').val('7');
        updateActivitiesTable();
    });

    updateActivitiesTable();
});

// Function to update charts based on filters
function updateCharts(filters) {
    // Here you would typically fetch new data from your backend based on the filters
    // For demo purposes, we'll just update the charts with filtered data
    
    // Update Monthly Water Usage Chart
    updateWaterUsageChart(filters);
    
    // Update Distribution Charts
    updatePaddockDistributionChart(filters);
    updateFarmDistributionChart(filters);
    updateResponsableDistributionChart(filters);
}

// Sample activities data
const activitiesData = [
    { date: '2024-01-15', farm: 'Farm 1', field: 'Field A', duration: 4.5, responsable: 'John Doe', status: 'Completed' },
    { date: '2024-02-10', farm: 'Farm 2', field: 'Field B', duration: 6, responsable: 'Jane Smith', status: 'Completed' },
    { date: '2024-03-05', farm: 'Farm 1', field: 'Field C', duration: 3, responsable: 'Carlos Ruiz', status: 'Completed' },
    { date: '2024-04-20', farm: 'Farm 3', field: 'Field A', duration: 5, responsable: 'Amina Patel', status: 'Completed' },
    { date: '2024-05-12', farm: 'Farm 4', field: 'Field B', duration: 7, responsable: 'John Doe', status: 'Completed' },
    { date: '2024-06-18', farm: 'Farm 2', field: 'Field C', duration: 2.5, responsable: 'Jane Smith', status: 'Completed' },
    { date: '2024-07-22', farm: 'Farm 3', field: 'Field A', duration: 4, responsable: 'Carlos Ruiz', status: 'Completed' },
    { date: '2024-08-30', farm: 'Farm 1', field: 'Field B', duration: 5.5, responsable: 'Amina Patel', status: 'Completed' },
    { date: '2024-09-14', farm: 'Farm 4', field: 'Field C', duration: 6.5, responsable: 'John Doe', status: 'Completed' },
    { date: '2024-10-03', farm: 'Farm 2', field: 'Field A', duration: 3.5, responsable: 'Jane Smith', status: 'Completed' },
    { date: '2024-11-19', farm: 'Farm 3', field: 'Field B', duration: 4.2, responsable: 'Carlos Ruiz', status: 'Completed' },
    { date: '2024-12-25', farm: 'Farm 1', field: 'Field C', duration: 5.8, responsable: 'Amina Patel', status: 'Completed' }
];

function getCubicMetersPerHour() {
    const value = parseFloat(localStorage.getItem('cubicMetersPerHour'));
    return isNaN(value) ? 1 : value;
}

function getFilteredActivities(filters = {}) {
    return activitiesData.filter(act => {
        if (filters.farm && act.farm !== filters.farm) return false;
        if (filters.paddock && act.field !== filters.paddock) return false;
        if (filters.responsable && act.responsable !== filters.responsable) return false;
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

// Update activities table (add filters param)
function updateActivitiesTable(filters = {}) {
    const tbody = $("#activities .table tbody");
    tbody.empty();
    const cubicMetersPerHour = getCubicMetersPerHour();
    getFilteredActivities(filters).forEach((act, idx) => {
        const waterVolume = (act.duration * cubicMetersPerHour).toFixed(2);
        tbody.append(`
            <tr>
                <td>${act.date}</td>
                <td>${act.farm}</td>
                <td>${act.field}</td>
                <td>${act.duration}</td>
                <td>${waterVolume}</td>
                <td><span class=\"badge bg-success\">${act.status}</span></td>
                <td><button class=\"btn btn-outline-success btn-sm\" data-activity-idx=\"${idx}\">View</button></td>
            </tr>
        `);
    });
}

// Function to update water usage chart
function updateWaterUsageChart(filters = {}) {
    const ctx = document.getElementById('waterUsageChart');
    if (!ctx) return;
    if (window.waterUsageChart && typeof window.waterUsageChart.destroy === 'function') {
        window.waterUsageChart.destroy();
    }
    const cubicMetersPerHour = getCubicMetersPerHour();
    // Group by year-month
    const filtered = getFilteredActivities(filters);
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
        }).reduce((sum, act) => sum + act.duration * cubicMetersPerHour, 0);
    });
    const data = {
        labels: monthLabels,
        datasets: [{
            label: 'Water Usage (m³)',
            data: monthly.map(v => +v.toFixed(2)),
            borderColor: '#4cb6e8',
            backgroundColor: 'rgba(76,182,232,0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    window.waterUsageChart = new Chart(ctx, {
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
                    title: { display: true, text: 'Water Volume (m³)' }
                }
            }
        }
    });
}

// Function to update paddock distribution chart
function updatePaddockDistributionChart(filters = {}) {
    const ctx = document.getElementById('paddockDistributionChart');
    if (!ctx) return;
    if (window.paddockDistributionChart && typeof window.paddockDistributionChart.destroy === 'function') {
        window.paddockDistributionChart.destroy();
    }
    const cubicMetersPerHour = getCubicMetersPerHour();
    const paddocks = ['Field A', 'Field B', 'Field C'];
    const paddockData = paddocks.map(field => {
        return getFilteredActivities(filters).filter(act => act.field === field).reduce((sum, act) => sum + act.duration * cubicMetersPerHour, 0);
    });
    const data = {
        labels: paddocks,
        datasets: [{
            data: paddockData.map(v => +v.toFixed(2)),
            backgroundColor: [
                '#8bb33a',
                'rgb(13, 110, 253)',
                'rgb(255, 193, 7)'
            ]
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
                            return label + ': ' + value + ' m³';
                        }
                    }
                }
            }
        }
    });
}

// Function to update farm distribution chart
function updateFarmDistributionChart(filters = {}) {
    const ctx = document.getElementById('farmDistributionChart');
    if (!ctx) return;
    if (window.farmDistributionChart && typeof window.farmDistributionChart.destroy === 'function') {
        window.farmDistributionChart.destroy();
    }
    const cubicMetersPerHour = getCubicMetersPerHour();
    const farms = ['Farm 1', 'Farm 2', 'Farm 3', 'Farm 4'];
    const farmData = farms.map(farm => {
        return getFilteredActivities(filters).filter(act => act.farm === farm).reduce((sum, act) => sum + act.duration * cubicMetersPerHour, 0);
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
                            return label + ': ' + value + ' m³';
                        }
                    }
                }
            }
        }
    });
}

// Function to update responsable distribution chart
function updateResponsableDistributionChart(filters = {}) {
    const ctx = document.getElementById('responsableDistributionChart');
    if (!ctx) return;
    if (window.responsableDistributionChart && typeof window.responsableDistributionChart.destroy === 'function') {
        window.responsableDistributionChart.destroy();
    }
    const cubicMetersPerHour = getCubicMetersPerHour();
    const responsables = ['John Doe', 'Jane Smith', 'Carlos Ruiz', 'Amina Patel'];
    const responsableData = responsables.map(res => {
        return getFilteredActivities(filters).filter(act => act.responsable === res).reduce((sum, act) => sum + act.duration * cubicMetersPerHour, 0);
    });
    const data = {
        labels: responsables,
        datasets: [{
            data: responsableData.map(v => +v.toFixed(2)),
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)'
            ]
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
                            return label + ': ' + value + ' m³';
                        }
                    }
                }
            }
        }
    });
}

// Function to initialize all charts
function initializeCharts() {
    updateWaterUsageChart();
    updatePaddockDistributionChart();
    updateFarmDistributionChart();
    updateResponsableDistributionChart();
} 