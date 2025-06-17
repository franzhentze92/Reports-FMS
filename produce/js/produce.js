// Update sample data for produce activities
let produceActivities = [
  { id: 1, date: '2024-05-01', farm: 'Farm 1', paddock: 'Field A', productName: 'Tomatoes', batchId: 'B001', quantity: 500, area: 2.5, responsable: 'John Doe', status: 'Completed' },
  { id: 2, date: '2024-05-03', farm: 'Farm 2', paddock: 'Field B', productName: 'Lettuce', batchId: 'B002', quantity: 300, area: 1.8, responsable: 'Jane Smith', status: 'Completed' },
  { id: 3, date: '2024-05-05', farm: 'Farm 1', paddock: 'Field C', productName: 'Carrots', batchId: 'B003', quantity: 400, area: 3.0, responsable: 'Carlos Ruiz', status: 'Completed' },
  { id: 4, date: '2024-05-07', farm: 'Farm 3', paddock: 'Field A', productName: 'Spinach', batchId: 'B004', quantity: 250, area: 2.2, responsable: 'Amina Patel', status: 'Completed' },
  { id: 5, date: '2024-05-10', farm: 'Farm 2', paddock: 'Field B', productName: 'Tomatoes', batchId: 'B005', quantity: 350, area: 2.0, responsable: 'John Doe', status: 'Completed' },
  { id: 6, date: '2024-05-12', farm: 'Farm 4', paddock: 'Field C', productName: 'Lettuce', batchId: 'B006', quantity: 320, area: 2.7, responsable: 'Jane Smith', status: 'Completed' },
  { id: 7, date: '2024-05-15', farm: 'Farm 3', paddock: 'Field A', productName: 'Carrots', batchId: 'B007', quantity: 280, area: 1.5, responsable: 'Carlos Ruiz', status: 'Completed' },
  { id: 8, date: '2024-05-18', farm: 'Farm 1', paddock: 'Field B', productName: 'Spinach', batchId: 'B008', quantity: 210, area: 2.3, responsable: 'Amina Patel', status: 'Completed' }
];

// Use produceActivities for all filtering, table, and chart data
let currentSort = { column: 'date', direction: 'desc' };

document.addEventListener('DOMContentLoaded', function() {
    updateFilters();
    renderProduceActivitiesTable();
    updateCharts();
    setupEventListeners();
    loadSettings();
});

function updateFilters() {
    const farms = [...new Set(produceActivities.map(a => a.farm))];
    const paddocks = [...new Set(produceActivities.map(a => a.paddock))];
    const responsables = [...new Set(produceActivities.map(a => a.responsable))];
    const productNames = [...new Set(produceActivities.map(a => a.productName))];
    const batchIds = [...new Set(produceActivities.map(a => a.batchId))];
    // Activities tab
    updateFilterDropdown('activitiesFarmFilter', farms);
    updateFilterDropdown('activitiesPaddockFilter', paddocks);
    updateFilterDropdown('activitiesResponsableFilter', responsables);
    updateFilterDropdown('activitiesCropFilter', productNames);
    updateFilterDropdown('activitiesVarietyFilter', batchIds);
    // Reports tab
    updateFilterDropdown('farmFilter', farms);
    updateFilterDropdown('paddockFilter', paddocks);
    updateFilterDropdown('responsableFilter', responsables);
    updateFilterDropdown('cropFilter', productNames);
    updateFilterDropdown('varietyFilter', batchIds);
}

function filterActivities() {
    const filters = {
        farm: document.getElementById('activitiesFarmFilter').value,
        paddock: document.getElementById('activitiesPaddockFilter').value,
        responsable: document.getElementById('activitiesResponsableFilter').value,
        dateRange: document.getElementById('activitiesDateRangeFilter').value,
        productName: document.getElementById('activitiesCropFilter').value,
        batchId: document.getElementById('activitiesVarietyFilter').value
    };
    let filtered = produceActivities.filter(activity => {
        if (activity.status !== 'Completed') return false;
        if (filters.farm && activity.farm !== filters.farm) return false;
        if (filters.paddock && activity.paddock !== filters.paddock) return false;
        if (filters.responsable && activity.responsable !== filters.responsable) return false;
        if (filters.productName && activity.productName !== filters.productName) return false;
        if (filters.batchId && activity.batchId !== filters.batchId) return false;
        if (filters.dateRange !== 'all') {
            const activityDate = new Date(activity.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            switch (filters.dateRange) {
                case 'today': return activityDate.getTime() === today.getTime();
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    return activityDate.getTime() === yesterday.getTime();
                case 'last7':
                    const last7 = new Date(today);
                    last7.setDate(last7.getDate() - 7);
                    return activityDate >= last7;
                case 'last30':
                    const last30 = new Date(today);
                    last30.setDate(last30.getDate() - 30);
                    return activityDate >= last30;
                case 'last90':
                    const last90 = new Date(today);
                    last90.setDate(last90.getDate() - 90);
                    return activityDate >= last90;
            }
        }
        return true;
    });
    renderProduceActivitiesTable(filtered);
}

function updateCharts() {
    const filters = {
        farm: document.getElementById('farmFilter').value,
        paddock: document.getElementById('paddockFilter').value,
        responsable: document.getElementById('responsableFilter').value,
        dateRange: document.getElementById('dateRangeFilter').value,
        productName: document.getElementById('cropFilter').value,
        batchId: document.getElementById('varietyFilter').value
    };
    let filtered = produceActivities.filter(activity => {
        if (activity.status !== 'Completed') return false;
        if (filters.farm && activity.farm !== filters.farm) return false;
        if (filters.paddock && activity.paddock !== filters.paddock) return false;
        if (filters.responsable && activity.responsable !== filters.responsable) return false;
        if (filters.productName && activity.productName !== filters.productName) return false;
        if (filters.batchId && activity.batchId !== filters.batchId) return false;
        if (filters.dateRange !== 'all') {
            const activityDate = new Date(activity.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            switch (filters.dateRange) {
                case 'today': return activityDate.getTime() === today.getTime();
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    return activityDate.getTime() === yesterday.getTime();
                case 'last7':
                    const last7 = new Date(today);
                    last7.setDate(last7.getDate() - 7);
                    return activityDate >= last7;
                case 'last30':
                    const last30 = new Date(today);
                    last30.setDate(last30.getDate() - 30);
                    return activityDate >= last30;
                case 'last90':
                    const last90 = new Date(today);
                    last90.setDate(last90.getDate() - 90);
                    return activityDate >= last90;
            }
        }
        return true;
    });
    updateMonthlyQuantityChart(filtered);
    updatePieChart(filtered, 'paddock', 'paddockDistributionChart');
    updatePieChart(filtered, 'farm', 'farmDistributionChart');
    updatePieChart(filtered, 'responsable', 'responsableDistributionChart');
    updatePieChart(filtered, 'productName', 'productDistributionChart');
}

function updateMonthlyQuantityChart(activities) {
    const ctx = document.getElementById('monthlyPlantedChart').getContext('2d');
    if (window.monthlyPlantedChartInstance) window.monthlyPlantedChartInstance.destroy();
    const monthMap = {};
    activities.forEach(a => {
        const d = new Date(a.date);
        const ym = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        if (!monthMap[ym]) monthMap[ym] = 0;
        monthMap[ym] += parseFloat(a.quantity);
    });
    const months = Object.keys(monthMap).sort();
    const labels = months.map(ym => {
        const [y, m] = ym.split('-');
        return `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(m)-1]} ${y}`;
    });
    const data = months.map(ym => monthMap[ym]);
    window.monthlyPlantedChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Produced (kg)',
                data: data,
                borderColor: '#8e24aa',
                backgroundColor: 'rgba(142,36,170,0.15)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Produced (kg)' } } }
        }
    });
}

function updatePieChart(activities, groupBy, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (window[canvasId + 'Instance']) window[canvasId + 'Instance'].destroy();
    let groupMap = {};
    activities.forEach(a => {
        const key = a[groupBy];
        if (!groupMap[key]) groupMap[key] = 0;
        groupMap[key] += parseFloat(a.quantity);
    });
    const labels = Object.keys(groupMap);
    const data = Object.values(groupMap);
    const colors = [
        '#ffd23f','#6ec6ff','#ff6f91','#8bc34a','#ffb300','#ab47bc','#ff7043','#00bcd4','#f06292','#cddc39','#ff8a65'
    ];
    window[canvasId + 'Instance'] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length)
            }]
        },
        options: {
            responsive: true,
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

// Update render function for the new columns
function renderProduceActivitiesTable(activities = produceActivities) {
    // Filter to only show completed activities
    activities = activities.filter(a => a.status === 'Completed');
    const tbody = document.querySelector('#plantingActivitiesTable tbody');
    tbody.innerHTML = '';

    activities.sort((a, b) => {
        let aVal = a[currentSort.column];
        let bVal = b[currentSort.column];

        if (currentSort.column === 'date') {
            aVal = new Date(a.date);
            bVal = new Date(b.date);
        } else if (currentSort.column === 'quantity') {
            aVal = parseFloat(a.quantity);
            bVal = parseFloat(b.quantity);
        }

        return currentSort.direction === 'asc' ? 
            (aVal > bVal ? 1 : -1) : 
            (aVal < bVal ? 1 : -1);
    });

    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(activity.date).toLocaleDateString()}</td>
            <td>${activity.farm}</td>
            <td>${activity.paddock}</td>
            <td>${activity.productName}</td>
            <td>${activity.batchId}</td>
            <td>${activity.quantity} kg</td>
            <td><span class="badge bg-success">${activity.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-success view-activity" data-id="${activity.id}">
                    View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.view-activity').forEach(button => {
        button.addEventListener('click', () => {
            const activityId = button.dataset.id;
            const activity = produceActivities.find(a => a.id === activityId);
            if (activity) {
                alert(`Viewing activity: ${activity.productName} (Batch: ${activity.batchId}) on ${activity.date}`);
            }
        });
    });
}

function updateFilterDropdown(id, values) {
    const select = document.getElementById(id);
    if (!select) return;
    let currentValue = select.value;
    select.innerHTML = '<option value="">All</option>';
    values.sort().forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
    if (!currentValue) currentValue = '';
    select.value = currentValue;
} 