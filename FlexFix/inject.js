(function () {
	const portlet = document.querySelector('.m-portlet');

	let totalAbsolutesElement = portlet.querySelector('h5[data-type="total"]');
	let obtainedAbsolutesElement = portlet.querySelector('h5[data-type="obtained"]');
	let averageAbsolutesElement = portlet.querySelector('h5[data-type="classAverage"]');
	let redirectButton = portlet.querySelector('button[data-type="redirect"]');

	if (!isElementExist(totalAbsolutesElement)) {
		totalAbsolutesElement = createElement("h5", "data-type", "total");
		totalAbsolutesElement.style.marginTop = '7px';
		portlet.appendChild(totalAbsolutesElement);
	}

	if (!isElementExist(obtainedAbsolutesElement)) {
		obtainedAbsolutesElement = createElement("h5", "data-type", "obtained");
		portlet.appendChild(obtainedAbsolutesElement);
	}

	if (!isElementExist(averageAbsolutesElement)) {
		averageAbsolutesElement = createElement("h5", "data-type", "classAverage");
		portlet.appendChild(averageAbsolutesElement);
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

	const currentSubjectDiv = document.querySelector('.tab-pane.active');

	let totalWeightage = 0;
	let totalObtainedAbsolutes = 0;
	let totalAverageAbsolutes = 0;

	let tables = currentSubjectDiv.querySelectorAll('.sum_table');

	for (let i = 0; i < tables.length; i++) {
		const table = tables[i];

		const tableRows = table.querySelectorAll(".calculationrow");
		let rowsCalculatedAverage = 0
		let tableWeightageSum = 0

		for (let j = 0; j < tableRows.length; j++) {

			const rowWeight = tableRows[j].querySelectorAll(".weightage");
			const rowAverageMarks = tableRows[j].querySelectorAll(".AverageMarks");
			const rowTotalMarks = tableRows[j].querySelectorAll(".GrandTotal");

			if (isEmptyOrZero(rowWeight) || isEmptyOrZero(rowAverageMarks) || isEmptyOrZero(rowTotalMarks)) {
				continue;
			}

			tableWeightageSum += parseFloat(rowWeight[0].textContent);
			rowsCalculatedAverage += (parseFloat(rowAverageMarks[0].textContent) / parseFloat(rowTotalMarks[0].textContent)) * parseFloat(rowWeight[0].textContent);
		}

		const totalSection = table.querySelectorAll('[class*="totalColumn_"]');

		if (totalSection.length !== 1) {
			continue;
		}

		const tableTotalWeigtage = totalSection[0].querySelectorAll(".totalColweightage");
		const tableTotalObtMarks = totalSection[0].querySelectorAll(".totalColObtMarks");

		if (tableTotalObtMarks.length !== 1 || tableTotalWeigtage.length !== 1) {
			continue;
		}

		if (tableWeightageSum != 0) {
			rowsCalculatedAverage = rowsCalculatedAverage / tableWeightageSum * parseFloat(tableTotalWeigtage[0].textContent);
			totalAverageAbsolutes += rowsCalculatedAverage;
		}

		totalWeightage += parseFloat(tableTotalWeigtage[0].textContent)
		totalObtainedAbsolutes += parseFloat(tableTotalObtMarks[0].textContent)
	}

	const finalCalculateAverage = isNaN(totalAverageAbsolutes) ? "Cannot Calculate, Missing Data" : totalAverageAbsolutes.toFixed(2)

	totalAbsolutesElement.textContent = 'Total Absolutes: ' + totalWeightage.toFixed(2);
	obtainedAbsolutesElement.textContent = 'Obtained Absolutes: ' + totalObtainedAbsolutes.toFixed(2);
	averageAbsolutesElement.textContent = 'Class Average: ' + finalCalculateAverage;

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