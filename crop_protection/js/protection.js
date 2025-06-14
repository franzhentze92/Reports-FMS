// Sample crop protection activities data
const activitiesData = [
    { date: '2024-01-15', farm: 'Farm 1', field: 'Field A', activity: 'Fungicide', product: 'Azoxystrobin', responsable: 'John Doe', amount: 2.5, status: 'Completed' },
    { date: '2024-02-10', farm: 'Farm 2', field: 'Field B', activity: 'Insecticide', product: 'Lambda-cyhalothrin', responsable: 'Jane Smith', amount: 1.8, status: 'Completed' },
    { date: '2024-03-05', farm: 'Farm 3', field: 'Field C', activity: 'Herbicide', product: 'Glyphosate', responsable: 'Carlos Ruiz', amount: 3.0, status: 'Completed' },
    { date: '2024-04-20', farm: 'Farm 1', field: 'Field B', activity: 'Fungicide', product: 'Mancozeb', responsable: 'Amina Patel', amount: 2.2, status: 'Completed' },
    { date: '2024-05-12', farm: 'Farm 4', field: 'Field A', activity: 'Insecticide', product: 'Imidacloprid', responsable: 'John Doe', amount: 2.8, status: 'Completed' },
    { date: '2024-06-18', farm: 'Farm 2', field: 'Field C', activity: 'Herbicide', product: 'Atrazine', responsable: 'Jane Smith', amount: 2.0, status: 'Completed' },
    { date: '2024-07-22', farm: 'Farm 3', field: 'Field B', activity: 'Fungicide', product: 'Chlorothalonil', responsable: 'Carlos Ruiz', amount: 2.6, status: 'Completed' },
    { date: '2024-08-30', farm: 'Farm 1', field: 'Field C', activity: 'Insecticide', product: 'Spinosad', responsable: 'Amina Patel', amount: 1.9, status: 'Completed' },
    { date: '2024-09-14', farm: 'Farm 4', field: 'Field B', activity: 'Herbicide', product: 'Paraquat', responsable: 'John Doe', amount: 2.4, status: 'Completed' },
    { date: '2024-10-03', farm: 'Farm 2', field: 'Field A', activity: 'Fungicide', product: 'Copper Oxychloride', responsable: 'Jane Smith', amount: 2.1, status: 'Completed' },
    { date: '2024-11-19', farm: 'Farm 3', field: 'Field B', activity: 'Insecticide', product: 'Abamectin', responsable: 'Carlos Ruiz', amount: 2.7, status: 'Completed' },
    { date: '2024-12-25', farm: 'Farm 1', field: 'Field A', activity: 'Herbicide', product: '2,4-D', responsable: 'Amina Patel', amount: 2.3, status: 'Completed' }
]; 

// Unique, non-overlapping color assignments for each label across all three pie charts
const paddockColors = ['#ffd23f', '#6ec6ff', '#ff6f91']; // 3 paddocks (yellow, blue, pink)
const farmColors    = ['#8bc34a', '#ffb300', '#ab47bc', '#ff7043']; // 4 farms (green, gold, purple, orange)
const responsableColors = ['#00bcd4', '#f06292', '#cddc39', '#ff8a65']; // 4 responsables (cyan, pink, lime, coral)

// --- Trap Monitoring Sample Data ---
const trapMonitoringData = [
    { date: '2024-01-10', farm: 'Farm 1', paddock: 'Field A', trapNo: 1, catchedNo: 12, responsable: 'John Doe', status: 'Checked', pest: 'Fruit Fly' },
    { date: '2024-01-15', farm: 'Farm 2', paddock: 'Field B', trapNo: 2, catchedNo: 8, responsable: 'Jane Smith', status: 'Checked', pest: 'Codling Moth' },
    { date: '2024-02-05', farm: 'Farm 3', paddock: 'Field C', trapNo: 3, catchedNo: 15, responsable: 'Carlos Ruiz', status: 'Checked', pest: 'Armyworm' },
    { date: '2024-02-20', farm: 'Farm 1', paddock: 'Field B', trapNo: 4, catchedNo: 6, responsable: 'Amina Patel', status: 'Checked', pest: 'Aphid' },
    { date: '2024-03-12', farm: 'Farm 4', paddock: 'Field A', trapNo: 5, catchedNo: 10, responsable: 'John Doe', status: 'Checked', pest: 'Thrips' },
    { date: '2024-03-25', farm: 'Farm 2', paddock: 'Field C', trapNo: 6, catchedNo: 9, responsable: 'Jane Smith', status: 'Checked', pest: 'Fruit Fly' },
    { date: '2024-04-08', farm: 'Farm 3', paddock: 'Field B', trapNo: 7, catchedNo: 13, responsable: 'Carlos Ruiz', status: 'Checked', pest: 'Codling Moth' },
    { date: '2024-04-22', farm: 'Farm 1', paddock: 'Field C', trapNo: 8, catchedNo: 7, responsable: 'Amina Patel', status: 'Checked', pest: 'Armyworm' },
    { date: '2024-05-14', farm: 'Farm 4', paddock: 'Field B', trapNo: 9, catchedNo: 11, responsable: 'John Doe', status: 'Checked', pest: 'Aphid' },
    { date: '2024-05-28', farm: 'Farm 2', paddock: 'Field A', trapNo: 10, catchedNo: 5, responsable: 'Jane Smith', status: 'Checked', pest: 'Thrips' }
];

function getFilteredActivities(filters = {}) {
    return activitiesData.filter(act => {
        if (filters.farm && act.farm !== filters.farm) return false;
        if (filters.paddock && act.field !== filters.paddock) return false;
        if (filters.responsable && act.responsable !== filters.responsable) return false;
        if (filters.activity && act.activity !== filters.activity) return false;
        if (filters.product && act.product !== filters.product) return false;
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

function updateProtectionUsageChart(filters = {}) {
    const ctx = document.getElementById('protectionUsageChart');
    if (!ctx) return;
    if (window.protectionUsageChart && typeof window.protectionUsageChart.destroy === 'function') {
        window.protectionUsageChart.destroy();
    }
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
        }).reduce((sum, act) => sum + act.amount, 0);
    });
    const data = {
        labels: monthLabels,
        datasets: [{
            label: 'Product Usage (L or kg)',
            data: monthly.map(v => +v.toFixed(2)),
            backgroundColor: 'rgba(255,193,7,0.15)',
            borderColor: '#ffc107',
            fill: true,
            tension: 0.4
        }]
    };
    window.protectionUsageChart = new Chart(ctx, {
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
                    title: { display: true, text: 'Product Usage (L or kg)' }
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
            label: 'Product Usage (L or kg)',
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
                            return label + ': ' + value + ' L or kg';
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
            label: 'Product Usage (L or kg)',
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
                            return label + ': ' + value + ' L or kg';
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
            label: 'Product Usage (L or kg)',
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
                            return label + ': ' + value + ' L or kg';
                        }
                    }
                }
            }
        }
    });
}

function updateAllCharts(filters = {}) {
    updateProtectionUsageChart(filters);
    updatePaddockDistributionChart(filters);
    updateFarmDistributionChart(filters);
    updateResponsableDistributionChart(filters);
}

function getFilteredTrapMonitoring(filters = {}) {
    return trapMonitoringData.filter(row => {
        if (filters.farm && row.farm !== filters.farm) return false;
        if (filters.paddock && row.paddock !== filters.paddock) return false;
        if (filters.responsable && row.responsable !== filters.responsable) return false;
        if (filters.pest && row.pest !== filters.pest) return false;
        if (filters.trapNo && String(row.trapNo) !== String(filters.trapNo)) return false;
        if (filters.dateRange) {
            const now = new Date();
            const rowDate = new Date(row.date);
            const daysAgo = parseInt(filters.dateRange);
            const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
            if (rowDate < minDate) return false;
        }
        return true;
    });
}

function updateTrapTable(filters = {}) {
    const tbody = $("#trapTable tbody");
    tbody.empty();
    getFilteredTrapMonitoring(filters).forEach((row, idx) => {
        tbody.append(`
            <tr>
                <td>${row.date}</td>
                <td>${row.farm}</td>
                <td>${row.paddock}</td>
                <td>${row.responsable}</td>
                <td><span class=\"badge bg-success\">${row.status}</span></td>
                <td><button class=\"btn btn-outline-success btn-sm\" data-trap-idx=\"${idx}\">View</button></td>
            </tr>
        `);
    });
}

function updateTrapTimeSeriesChart(filters = {}) {
    const ctx = document.getElementById('trapTimeSeriesChart');
    if (!ctx) return;
    if (window.trapTimeSeriesChart && typeof window.trapTimeSeriesChart.destroy === 'function') {
        window.trapTimeSeriesChart.destroy();
    }
    const filtered = getFilteredTrapMonitoring(filters);
    const allMonths = Array.from(new Set(filtered.map(row => {
        const d = new Date(row.date);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    })));
    allMonths.sort();
    const monthLabels = allMonths.map(ym => {
        const [year, month] = ym.split('-');
        return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(month)-1]} ${year}`;
    });
    const monthly = allMonths.map(ym => {
        return filtered.filter(row => {
            const d = new Date(row.date);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === ym;
        }).reduce((sum, row) => sum + row.catchedNo, 0);
    });
    const data = {
        labels: monthLabels,
        datasets: [{
            label: 'Insects Catched (No.)',
            data: monthly.map(v => +v),
            borderColor: '#ff9800',
            backgroundColor: 'rgba(255,152,0,0.15)',
            fill: true,
            tension: 0.4
        }]
    };
    window.trapTimeSeriesChart = new Chart(ctx, {
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
                    title: { display: true, text: 'Insects Catched (No.)' }
                }
            }
        }
    });
}

function updateTrapPieChart(id, groupBy, filters = {}) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    if (window[id] && typeof window[id].destroy === 'function') {
        window[id].destroy();
    }
    const filtered = getFilteredTrapMonitoring(filters);
    let groups = [];
    if (groupBy === 'paddock') groups = ['Field A', 'Field B', 'Field C'];
    if (groupBy === 'farm') groups = ['Farm 1', 'Farm 2', 'Farm 3', 'Farm 4'];
    if (groupBy === 'responsable') groups = ['John Doe', 'Jane Smith', 'Carlos Ruiz', 'Amina Patel'];
    const dataArr = groups.map(g => filtered.filter(row => row[groupBy] === g).reduce((sum, row) => sum + row.catchedNo, 0));
    const colors = groupBy === 'paddock' ? paddockColors : groupBy === 'farm' ? farmColors : responsableColors;
    const data = {
        labels: groups,
        datasets: [{
            data: dataArr,
            backgroundColor: colors
        }]
    };
    window[id] = new Chart(ctx, {
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
                            return label + ': ' + value + ' No.';
                        }
                    }
                }
            }
        }
    });
}

function updateTrapNoPieChart(filters = {}) {
    const ctx = document.getElementById('trapNoPieChart');
    if (!ctx) return;
    if (window.trapNoPieChart && typeof window.trapNoPieChart.destroy === 'function') {
        window.trapNoPieChart.destroy();
    }
    const filtered = getFilteredTrapMonitoring(filters);
    const trapNos = Array.from(new Set(trapMonitoringData.map(row => row.trapNo))).sort((a,b)=>a-b);
    const dataArr = trapNos.map(no => filtered.filter(row => row.trapNo === no).reduce((sum, row) => sum + row.catchedNo, 0));
    const colors = [
        '#ffb300','#ff7043','#ff9800','#ffd23f','#ff6f91','#ffcc80','#ffa726','#ffb74d','#ffe082','#ffab91'
    ];
    const data = {
        labels: trapNos.map(no => `Trap ${no}`),
        datasets: [{
            data: dataArr,
            backgroundColor: colors.slice(0, trapNos.length)
        }]
    };
    window.trapNoPieChart = new Chart(ctx, {
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
                            return label + ': ' + value + ' No.';
                        }
                    }
                }
            }
        }
    });
}

function updateAllTrapCharts(filters = {}) {
    updateTrapTimeSeriesChart(filters);
    updateTrapPieChart('trapPaddockPieChart', 'paddock', filters);
    updateTrapPieChart('trapFarmPieChart', 'farm', filters);
    updateTrapPieChart('trapResponsablePieChart', 'responsable', filters);
    updateTrapNoPieChart(filters);
}

function updateActivitiesTable(filters = {}) {
    const tbody = $("#activitiesTable tbody");
    tbody.empty();
    getFilteredActivities(filters).forEach((act, idx) => {
        tbody.append(`
            <tr>
                <td>${act.date}</td>
                <td>${act.farm}</td>
                <td>${act.field}</td>
                <td>${act.activity}</td>
                <td>${act.responsable}</td>
                <td><span class=\"badge bg-success\">${act.status}</span></td>
                <td><button class=\"btn btn-outline-success btn-sm\" data-activity-idx=\"${idx}\">View</button></td>
            </tr>
        `);
    });
}

$(document).ready(function() {
    // ... existing code ...
    $('#reports-tab').on('shown.bs.tab', function (e) {
        updateAllCharts();
    });
    $('#applyFilters').on('click', function() {
        const filters = {
            farm: $('#farmFilter').val(),
            paddock: $('#paddockFilter').val(),
            responsable: $('#responsableFilter').val(),
            dateRange: $('#dateRangeFilter').val(),
            activity: $('#activityFilter').val(),
            product: $('#productFilter').val()
        };
        updateAllCharts(filters);
    });
    $('#resetFilters').on('click', function() {
        updateAllCharts();
    });
    updateAllCharts();
    // Trap Monitoring Activities tab
    updateTrapTable();
    $('#trap-tab').on('shown.bs.tab', function (e) {
        updateTrapTable();
    });
    $('#trapTableFarmFilter, #trapTablePaddockFilter, #trapTableResponsableFilter').on('change', function() {
        const filters = {
            farm: $('#trapTableFarmFilter').val(),
            paddock: $('#trapTablePaddockFilter').val(),
            responsable: $('#trapTableResponsableFilter').val()
        };
        updateTrapTable(filters);
    });
    // Trap Monitoring Report tab
    updateAllTrapCharts();
    $('#trap-report-tab').on('shown.bs.tab', function (e) {
        updateAllTrapCharts();
    });
    $('#applyTrapFilters').on('click', function() {
        const filters = {
            farm: $('#trapFarmFilter').val(),
            paddock: $('#trapPaddockFilter').val(),
            responsable: $('#trapResponsableFilter').val(),
            dateRange: $('#trapDateRangeFilter').val(),
            pest: $('#trapPestFilter').val(),
            trapNo: $('#trapNoFilter').val()
        };
        updateAllTrapCharts(filters);
    });
    $('#resetTrapFilters').on('click', function() {
        updateAllTrapCharts();
    });
    // Activities tab filters for crop protection
    $('#activityFarmFilter, #activityPaddockFilter, #activityResponsableFilter').on('change', function() {
        const filters = {
            farm: $('#activityFarmFilter').val(),
            paddock: $('#activityPaddockFilter').val(),
            responsable: $('#activityResponsableFilter').val()
        };
        updateActivitiesTable(filters);
    });
    updateActivitiesTable();
});
// ... existing code ... 