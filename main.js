// Global variables for sorting state
let currentSortColumn = 'Points';
let isReversed = false;
let tableData = [];

// Function to sort table data
function sortTableData(column) {
    if (currentSortColumn === column) {
        isReversed = !isReversed;
    } else {
        currentSortColumn = column;
        isReversed = column
    }

    tableData.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        // Convert to numbers for numeric columns
        if (['Points', 'Firsts', 'Seconds', 'Thirds'].includes(column)) {
            valA = parseInt(valA) || 0;
            valB = parseInt(valB) || 0;
        }

        if (valA < valB) return isReversed ? 1 : -1;
        if (valA > valB) return isReversed ? -1 : 1;
        return 0;
    });

    renderTable();
}

// Function to render the table
function renderTable() {
    let tableHtml = '<table><thead><tr>';
    const headers = Object.keys(tableData[0]).filter(header => header !== 'userID');
    
    headers.forEach(header => {
        const arrow = currentSortColumn === header ? (isReversed ? '↓' : '↑') : '';
		if (arrow) {
			tableHtml = tableHtml += `<th class="sorted" onclick="sortTableData('${header}')" style="cursor: pointer">${header} ${arrow}</th>`;
		}
		else {
			tableHtml += `<th onclick="sortTableData('${header}')" style="cursor: pointer">${header} ${arrow}</th>`;
		}
    });
    
    tableHtml += '</tr></thead><tbody>';
    
    tableData.forEach(row => {
        tableHtml += '<tr>';
        headers.forEach(header => {
            if (header === 'Player' && row['userID']) {
                tableHtml += `<td><a href="https://osu.ppy.sh/u/${row['userID']}" target="_blank">${row[header]}</a></td>`;
            } else if (header === 'Points') {
                tableHtml += `<td><b>${row[header]}</b></td>`;
            } else {
                tableHtml += `<td>${row[header]}</td>`;
            }
        });
        tableHtml += '</tr>';
    });
    
    tableHtml += '</tbody></table>';
    document.getElementById('table').innerHTML = tableHtml;
}

// Fetch placements.csv, parse it, and populate #table div with a generated table.
document.addEventListener('DOMContentLoaded', function() {
    fetch('placements.csv')
        .then(response => response.text())
        .then(csvText => {
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(',');
            tableData = lines.slice(1).map(line => {
                const values = line.split(',');
                let obj = {};
                headers.forEach((header, i) => {
                    obj[header.trim()] = values[i]?.trim();
                });
                return obj;
            });
            
            // Initial sort by Points (descending)
            sortTableData('Points');
        })
        .catch(err => {
            document.getElementById('table').innerHTML = '<p>Error loading placements.csv</p>';
            console.error(err);
        });
});
