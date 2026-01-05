(function () {
	// Find the div with class "m-portlet"
	const portlet = document.querySelector('.m-portlet');

	// Check if the total and obtained marks elements already exist
	let totalMarksElement = portlet.querySelector('h5[data-type="total"]');
	let obtainedMarksElement = portlet.querySelector('h5[data-type="obtained"]');
	let classAverageElement = portlet.querySelector('h5[data-type="classAverage"]');
	let redirectButton = portlet.querySelector('button[data-type="redirect"]');

	// If the elements don't exist, create new ones and append them to the portlet
	if (!isElementExist(totalMarksElement)) {
		totalMarksElement = createElement("h5", "data-type", "total");
		totalMarksElement.style.marginTop = '7px';
		portlet.appendChild(totalMarksElement);
	}

	if (!isElementExist(obtainedMarksElement)) {
		obtainedMarksElement = createElement("h5", "data-type", "obtained");
		portlet.appendChild(obtainedMarksElement);
	}

	if (!isElementExist(classAverageElement)) {
		classAverageElement = createElement("h5", "data-type", "classAverage");
		portlet.appendChild(classAverageElement);
	}

	if (!isElementExist(redirectButton)) {
		redirectButton = document.createElement('button');
		redirectButton.setAttribute('data-type', 'redirect');
		redirectButton.style.color = 'black';
		redirectButton.style.backgroundColor = 'white';
		redirectButton.style.border = 'none';
		redirectButton.style.borderRadius = '5px';
		redirectButton.style.padding = '10px 20px';
		redirectButton.style.fontSize = '16px';
		redirectButton.style.fontWeight = 'bold';
		redirectButton.textContent = 'Redirect to Grade Calculator';

		var containerDiv = document.createElement('div');
		containerDiv.style.display = 'flex';
		containerDiv.style.justifyContent = 'center';
		containerDiv.style.alignItems = 'center';
		containerDiv.style.height = '100%';
		containerDiv.appendChild(redirectButton);

		redirectButton.addEventListener('click', function () {
			window.open('https://fastnugrader.netlify.app/', '_blank');
		});

		portlet.appendChild(containerDiv);
	}


	// Find the div with class "active"
	const activeDiv = document.querySelector('.tab-pane.active');

	// Initialize the total, obtained marks and average to 0
	let totalWeightage = 0;
	let totalObtMarks = 0;
	let totalAverage = 0

	// get all marks table
	let tables = activeDiv.querySelectorAll('.sum_table');

	// iterate over all tables
	for (var i = 0; i < tables.length; i++) {
		var table = tables[i];

		// get all rows in the table
		var rows = table.querySelectorAll(".calculationrow");
		let rowCalculatedAverage = 0
		let tableWeightageSum = 0

		// iterate over all rows
		for (var j = 0; j < rows.length; j++) {

			// extract all weightage, average and total marks elements
			const rowWeight = rows[j].querySelectorAll(".weightage");
			const rowAverageMarks = rows[j].querySelectorAll(".AverageMarks");
			const rowTotalMarks = rows[j].querySelectorAll(".GrandTotal");

			if (isEmptyOrZero(rowWeight) || isEmptyOrZero(rowAverageMarks) || isEmptyOrZero(rowTotalMarks)) {
				continue;
			}
			// calculate the average for the row
			tableWeightageSum += parseFloat(rowWeight[0].textContent);
			rowCalculatedAverage += (parseFloat(rowAverageMarks[0].textContent) / parseFloat(rowTotalMarks[0].textContent)) * parseFloat(rowWeight[0].textContent);

		}

		// calculate the average for the table
		var totalSection = table.querySelectorAll('[class*="totalColumn_"]');
		if (totalSection.length == 1 && tableWeightageSum != 0 && rowCalculatedAverage != 0 && totalSection[0].querySelectorAll(".totalColweightage").length == 1) {
			var tableColWeigtage = totalSection[0].querySelectorAll(".totalColweightage")
			rowCalculatedAverage = rowCalculatedAverage / tableWeightageSum * parseFloat(tableColWeigtage[0].textContent);
			totalAverage += rowCalculatedAverage;
		}

		// calculate the total and obtained marks for the table
		if (totalSection.length == 1) {
			var _tableColWeigtage = totalSection[0].querySelectorAll(".totalColweightage")
			var _tableColObtMarks = totalSection[0].querySelectorAll(".totalColObtMarks")
			if (_tableColWeigtage.length == 1 && _tableColObtMarks.length == 1) {
				totalWeightage += parseFloat(_tableColWeigtage[0].textContent)
				totalObtMarks += parseFloat(_tableColObtMarks[0].textContent)
			}
		}
	}
	// check if average was calculated or not
	var finalCalculateAverage = isNaN(totalAverage) ? "Cannot Calculate, Missing Data" : totalAverage.toFixed(2)

	// Update the content of the total and obtained marks elements
	totalMarksElement.textContent = 'Total Absolutes: ' + totalWeightage.toFixed(2);
	obtainedMarksElement.textContent = 'Obtained Absolutes: ' + totalObtMarks.toFixed(2);
	classAverageElement.textContent = 'Class Average: ' + finalCalculateAverage;

	chrome.runtime.sendMessage('pageChange');
})();


function isElementExist(element) {
	return element !== null && element !== undefined;
}

function createElement(tag, attribute, value) {
	const element = document.createElement(tag);
	element.setAttribute(attribute, value);
	element.style.color = 'white';
	element.style.marginLeft = '30px';
	return element;
}


function isEmptyOrZero(row) {
	return row.length === 0 || row[0].textContent.trim() === "0";
}