async function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect form data from input fields
    const visitorName = document.getElementById('visitorName').value.trim();
    const noOfPersons = document.getElementById('noOfPersons').value.trim();
    const purpose = document.getElementById('purpose').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();
    const visitDate = document.getElementById('visitDate').value.trim();

    const formMessageElement = document.getElementById('formMessage'); // Message container

    // Validate inputs (basic validation)
    if (!visitorName || !noOfPersons || !purpose || !contactNumber || !visitDate) {
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>All fields are required. Please fill out the form completely.</p>
            </div>
        `;
        return;
    }

    // Prepare the form data
    const formData = {
        visitorName,
        noOfPersons: parseInt(noOfPersons, 10),
        purpose,
        contactNumber,
        visitDate,
    };

    try {
        // Show a loading message
        formMessageElement.innerHTML = `
            <div class="loading-message">
                <p>Submitting your information... Please wait.</p>
            </div>
        `;

        // Send data to the server
        const response = await fetch('https://visitor-backend-vgeq.onrender.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json(); // Parse the JSON response
            console.log('Server Response:', result);

            // Automatically open the PDF in a new tab
            window.open(result.pdfURL, '_blank');

            // Provide a download button/link for the PDF
            formMessageElement.innerHTML = `
                <div class="success-message">
                    <p>Thank you, ${visitorName}, for submitting your information!</p>
                    <p>Your E-Pass has been opened in a new tab.</p>
                    <p>
                        You can also download the PDF here: 
                        <a href="${result.pdfURL}" target="_blank" class="download-link">Download PDF</a>
                    </p>
                </div>
            `;
        } else {
            const errorResult = await response.json();
            console.error('Server Error:', errorResult);

            formMessageElement.innerHTML = `
                <div class="error-message">
                    <p>Error: ${errorResult.message || 'An unknown error occurred.'}</p>
                </div>
            `;
        }
    } catch (err) {
        console.error('Error handling form submission:', err);
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>Sorry, there was an error submitting your form. Please try again later.</p>
            </div>
        `;
    }
}

