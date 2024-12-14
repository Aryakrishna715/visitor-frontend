async function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect form data from input fields
    const visitorName = document.getElementById('visitorName').value.trim();
    const noOfPersons = document.getElementById('noOfPersons').value.trim();
    const purpose = document.getElementById('purpose').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();
    const visitDate = document.getElementById('visitDate').value.trim();

    // Display element to show messages
    const formMessageElement = document.getElementById('formMessage');

    // Validate inputs
    if (!visitorName || !noOfPersons || !purpose || !contactNumber || !visitDate) {
        formMessageElement.innerHTML = `<p class="error-message">All fields are required.</p>`;
        return;
    }
    if (!/^[0-9]{10}$/.test(contactNumber)) {
        formMessageElement.innerHTML = `<p class="error-message">Invalid contact number. Please enter a valid 10-digit number.</p>`;
        return;
    }
    if (isNaN(noOfPersons) || noOfPersons <= 0) {
        formMessageElement.innerHTML = `<p class="error-message">Invalid number of persons. Enter a valid number greater than 0.</p>`;
        return;
    }

    const formData = {
        visitorName,
        noOfPersons: parseInt(noOfPersons, 10),
        purpose,
        contactNumber,
        visitDate,
    };

    try {
        // Show a loading message
        formMessageElement.innerHTML = `<p class="loading-message">Submitting your information... Please wait.</p>`;

        // Make the POST request
        const response = await fetch('https://visitor-backend-vgeq.onrender.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Server Response:', result);

            // Open the PDF in a new tab
            const newTab = window.open(result.pdfURL, '_blank');
            if (!newTab) {
                alert('Popup blocked! Please allow popups to view your E-Pass.');
            }

            // Success message
            formMessageElement.innerHTML = `
                <p class="success-message">
                    Thank you, ${visitorName}, for submitting your information!
                </p>
                <p>Your E-Pass has been opened in a new tab.</p>
                <p>
                    If it did not open, <a href="${result.pdfURL}" target="_blank">click here</a>.
                </p>
            `;
        } else {
            const errorResult = await response.json();
            console.error('Server Error:', errorResult);
            formMessageElement.innerHTML = `<p class="error-message">Error: ${errorResult.message || 'An unknown error occurred.'}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        formMessageElement.innerHTML = `<p class="error-message">An error occurred. Please try again later.</p>`;
    }
}
