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
            dateRange: $('#dateRangeFilter').val()
        };
        updateCharts(filters);
    });

    // Handle filter reset
    $('#resetFilters').on('click', function() {
        $('#farmFilter').val('');
        $('#paddockFilter').val('');
        $('#dateRangeFilter').val('7');
        initializeCharts();
    });
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
}

// Function to update Water Usage Chart
function updateWaterUsageChart(filters) {
    const waterUsageCtx = document.getElementById('waterUsageChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.waterUsageChart) {
        window.waterUsageChart.destroy();
    }
    
    // Create new chart with filtered data
    window.waterUsageChart = new Chart(waterUsageCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Water Usage (m³)',
                data: [1200, 1900, 1500, 2100, 1800, 2400],
                borderColor: '#8bb33a',
                backgroundColor: 'rgba(139, 179, 58, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Water Volume (m³)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Function to update Paddock Distribution Chart
function updatePaddockDistributionChart(filters) {
    const paddockDistributionCtx = document.getElementById('paddockDistributionChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.paddockDistributionChart) {
        window.paddockDistributionChart.destroy();
    }
    
    // Create new chart with filtered data
    window.paddockDistributionChart = new Chart(paddockDistributionCtx, {
        type: 'pie',
        data: {
            labels: ['Field A', 'Field B', 'Field C'],
            datasets: [{
                data: [35, 30, 35],
                backgroundColor: [
                    '#8bb33a',
                    'rgb(13, 110, 253)',
                    'rgb(255, 193, 7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Function to update Farm Distribution Chart
function updateFarmDistributionChart(filters) {
    const farmDistributionCtx = document.getElementById('farmDistributionChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.farmDistributionChart) {
        window.farmDistributionChart.destroy();
    }
    
    // Create new chart with filtered data
    window.farmDistributionChart = new Chart(farmDistributionCtx, {
        type: 'pie',
        data: {
            labels: ['Farm 1', 'Farm 2', 'Farm 3', 'Farm 4'],
            datasets: [{
                data: [25, 30, 20, 25],
                backgroundColor: [
                    'rgb(220, 53, 69)',
                    'rgb(111, 66, 193)',
                    'rgb(253, 126, 20)',
                    'rgb(32, 201, 151)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
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
} 