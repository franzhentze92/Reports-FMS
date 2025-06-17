// Maintenance section JavaScript

$(document).ready(function() {
    initializeCharts();

    $('#reports-tab').on('shown.bs.tab', function (e) {
        initializeCharts();
    });

    $('#applyFilters').on('click', function() {
        const filters = {
            farm: $('#farmFilter').val(),
            paddock: $('#paddockFilter').val(),
            equipment: $('#equipmentFilter').val(),
            responsable: $('#responsableFilter').val(),
            dateRange: $('#dateRangeFilter').val()
        };
        updateCharts(filters);
    });

    $('#resetFilters').on('click', function() {
        $('#farmFilter').val('');
        $('#paddockFilter').val('');
        $('#equipmentFilter').val('');
        $('#responsableFilter').val('');
        $('#dateRangeFilter').val('7');
        initializeCharts();
    });

    $('#applyActivitiesFilters').on('click', function() {
        const filters = {
            farm: $('#activitiesFarmFilter').val(),
            paddock: $('#activitiesPaddockFilter').val(),
            equipment: $('#activitiesEquipmentFilter').val(),
            responsable: $('#activitiesResponsableFilter').val(),
            dateRange: $('#activitiesDateRangeFilter').val()
        };
        updateActivitiesTable(filters);
    });
    $('#resetActivitiesFilters').on('click', function() {
        $('#activitiesFarmFilter').val('');
        $('#activitiesPaddockFilter').val('');
        $('#activitiesEquipmentFilter').val('');
        $('#activitiesResponsableFilter').val('');
        $('#activitiesDateRangeFilter').val('7');
        updateActivitiesTable();
    });

    updateActivitiesTable();
});

// Sample maintenance activities data
const activitiesData = [
    { date: '2024-03-15', farm: 'Farm 1', field: 'Field A', duration: 2.5, responsable: 'John Doe', task: 'Tractor Service', equipment: 'Tractor', status: 'Completed' },
    { date: '2024-04-10', farm: 'Farm 2', field: 'Field B', duration: 3.0, responsable: 'Jane Smith', task: 'Fence Repair', equipment: 'Fencing Tools', status: 'Completed' },
    { date: '2024-05-05', farm: 'Farm 3', field: 'Field C', duration: 1.5, responsable: 'Carlos Ruiz', task: 'Equipment Check', equipment: 'Tractor', status: 'Completed' },
    { date: '2024-06-20', farm: 'Farm 4', field: 'Field A', duration: 4.0, responsable: 'Amina Patel', task: 'Building Maintenance', equipment: 'Building Tools', status: 'Completed' },
    { date: '2024-07-12', farm: 'Farm 1', field: 'Field B', duration: 2.0, responsable: 'John Doe', task: 'Irrigation Pump Service', equipment: 'Irrigation Pump', status: 'Completed' },
    { date: '2024-08-18', farm: 'Farm 2', field: 'Field C', duration: 3.5, responsable: 'Jane Smith', task: 'Tractor Service', equipment: 'Tractor', status: 'Completed' },
    { date: '2024-09-22', farm: 'Farm 3', field: 'Field A', duration: 2.2, responsable: 'Carlos Ruiz', task: 'Fence Repair', equipment: 'Fencing Tools', status: 'Completed' },
    { date: '2024-10-30', farm: 'Farm 4', field: 'Field B', duration: 4.5, responsable: 'Amina Patel', task: 'Equipment Check', equipment: 'Tractor', status: 'Completed' },
    { date: '2024-11-14', farm: 'Farm 1', field: 'Field C', duration: 1.8, responsable: 'John Doe', task: 'Building Maintenance', equipment: 'Building Tools', status: 'Completed' },
    { date: '2024-12-03', farm: 'Farm 2', field: 'Field A', duration: 3.3, responsable: 'Jane Smith', task: 'Irrigation Pump Service', equipment: 'Irrigation Pump', status: 'Completed' }
];

function getFilteredActivities(filters = {}) {
    return activitiesData.filter(act => {
        if (filters.farm && act.farm !== filters.farm) return false;
        if (filters.paddock && act.field !== filters.paddock) return false;
        if (filters.equipment && act.equipment !== filters.equipment) return false;
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

function updateActivitiesTable(filters = {}) {
    const tbody = $("#activities .table tbody");
    tbody.empty();
    getFilteredActivities(filters).forEach((act, idx) => {
        tbody.append(`
            <tr>
                <td>${act.date}</td>
                <td>${act.farm}</td>
                <td>${act.field}</td>
                <td>${act.duration}</td>
                <td>${act.task}</td>
                <td><span class=\"badge bg-success\">${act.status}</span></td>
                <td><button class=\"btn btn-outline-success btn-sm\" data-activity-idx=\"${idx}\">View</button></td>
            </tr>
        `);
    });
}

function updateCharts(filters) {
    updateMaintenanceHoursChart(filters);
    updateEquipmentDistributionChart(filters);
    updateFarmDistributionChart(filters);
    updateResponsableDistributionChart(filters);
}

function updateMaintenanceHoursChart(filters = {}) {
    const ctx = document.getElementById('maintenanceHoursChart');
    if (!ctx) return;
    if (window.maintenanceHoursChart && typeof window.maintenanceHoursChart.destroy === 'function') {
        window.maintenanceHoursChart.destroy();
    }
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
        }).reduce((sum, act) => sum + act.duration, 0);
    });
    const data = {
        labels: monthLabels,
        datasets: [{
            label: 'Maintenance Hours',
            data: monthly.map(v => +v.toFixed(2)),
            borderColor: '#495057',
            backgroundColor: 'rgba(73,80,87,0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    window.maintenanceHoursChart = new Chart(ctx, {
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
                    title: { display: true, text: 'Hours' }
                }
            }
        }
    });
}

function updateEquipmentDistributionChart(filters = {}) {
    const ctx = document.getElementById('paddockDistributionChart');
    if (!ctx) return;
    if (window.paddockDistributionChart && typeof window.paddockDistributionChart.destroy === 'function') {
        window.paddockDistributionChart.destroy();
    }
    const equipment = ['Tractor', 'Irrigation Pump', 'Fencing Tools', 'Building Tools'];
    const equipmentData = equipment.map(eq => {
        return getFilteredActivities(filters).filter(act => act.equipment === eq).reduce((sum, act) => sum + act.duration, 0);
    });
    const data = {
        labels: equipment,
        datasets: [{
            data: equipmentData.map(v => +v.toFixed(2)),
            backgroundColor: [
                '#8bb33a',
                'rgb(13, 110, 253)',
                'rgb(255, 193, 7)',
                'rgb(220, 53, 69)'
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
                            return label + ': ' + value + ' hrs';
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
    const farmData = farms.map(farm => {
        return getFilteredActivities(filters).filter(act => act.farm === farm).reduce((sum, act) => sum + act.duration, 0);
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
                            return label + ': ' + value + ' hrs';
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
    const responsableData = responsables.map(res => {
        return getFilteredActivities(filters).filter(act => act.responsable === res).reduce((sum, act) => sum + act.duration, 0);
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
                            return label + ': ' + value + ' hrs';
                        }
                    }
                }
            }
        }
    });
}

function initializeCharts() {
    updateMaintenanceHoursChart();
    updateEquipmentDistributionChart();
    updateFarmDistributionChart();
    updateResponsableDistributionChart();
} 