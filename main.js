// Fetch placements.csv, parse it, and populate #table div with a generated table.
document.addEventListener('DOMContentLoaded', function() {
	fetch('placements.csv')
		.then(response => response.text())
		.then(csvText => {
			const lines = csvText.trim().split('\n');
			const headers = lines[0].split(',');
			const data = lines.slice(1).map(line => {
				const values = line.split(',');
				let obj = {};
				headers.forEach((header, i) => {
					obj[header.trim()] = values[i]?.trim();
				});
				return obj;
			});

			// Generate HTML table
			let tableHtml = '<table><thead><tr>';
			headers.forEach(header => {
				if (header.trim() !== 'userID') {
					tableHtml += `<th>${header.trim()}</th>`;
				}
			});
			tableHtml += '</tr></thead><tbody>';
			data.forEach(row => {
				tableHtml += '<tr>';
				headers.forEach(header => {
					if (header.trim() === 'Player' && row['userID']) {
						tableHtml += `<td><a href="https://osu.ppy.sh/u/${row['userID']}" target="_blank">${row[header.trim()]}</a></td>`;
					} else if (header.trim() !== 'userID') {
						if (header.trim() === 'Points') {
							tableHtml += `<td><b>${row[header.trim()]}</b></td>`;
						} else {
							tableHtml += `<td>${row[header.trim()]}</td>`;
						}
					}
				});
				tableHtml += '</tr>';
			});
			tableHtml += '</tbody></table>';

			document.getElementById('table').innerHTML = tableHtml;
		})
		.catch(err => {
			document.getElementById('table').innerHTML = '<p>Error loading placements.csv</p>';
			console.error(err);
		});
});
