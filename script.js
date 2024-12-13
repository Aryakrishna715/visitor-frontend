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

    // Validate the form inputs (ensure all fields are filled)
    if (!visitorName || !noOfPersons || !purpose || !contactNumber || !visitDate) {
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>All fields are required. Please fill out the form completely.</p>
            </div>
        `;
        return;
    }

    // Validate contact number (example: 10 digits for phone number)
    if (!/^[0-9]{10}$/.test(contactNumber)) {
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>Invalid contact number. Please enter a valid 10-digit number.</p>
            </div>
        `;
        return;
    }

    // Validate number of persons (must be a positive number)
    if (isNaN(noOfPersons) || noOfPersons <= 0) {
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>Invalid number of persons. Please enter a valid number greater than 0.</p>
            </div>
        `;
        return;
    }

    // Prepare the form data
    const formData = {
        visitorName,
        noOfPersons: parseInt(noOfPersons, 10), // Convert 'noOfPersons' to a number
        purpose,
        contactNumber,
        visitDate,
    };

    // Debug: Log the form data
    console.log('Form Data:', formData);

    try {
        // Display a loading message while waiting for the server response
        formMessageElement.innerHTML = `
            <div class="loading-message">
                <p>Submitting your information... Please wait.</p>
            </div>
        `;

        // Make a POST request to submit the form data to the backend
        const response = await fetch('https://visitor-backend-20.onrender.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convert the formData object to a JSON string
        });

        // Handle the response from the server
        if (response.ok) {
            const result = await response.json(); // Parse the JSON response
            console.log('Server Response:', result);

            // Show a success message and provide a link to download the E-Pass
            formMessageElement.innerHTML = `
                <div class="success-message">
                    <p>Thank you, ${visitorName}, for submitting your information!</p>
                    <p>You can download your E-Pass by clicking the link below:</p>
                    <a href="${result.downloadLink}" target="_blank" class="download-link">Download E-Pass</a>
                </div>
            `;
        } else {
            // Handle server-side errors
            const errorResult = await response.json(); // Parse the error response
            console.error('Server Error:', errorResult);

            formMessageElement.innerHTML = `
                <div class="error-message">
                    <p>Error: ${errorResult.message || 'An unknown error occurred.'}</p>
                </div>
            `;
        }
    } catch (err) {
        // Handle client-side errors (e.g., network issues)
        console.error('Error handling form submission:', err);
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>Sorry, there was an error submitting your form. Please try again later.</p>
            </div>
        `;
    }
}
