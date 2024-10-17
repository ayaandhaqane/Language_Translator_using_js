const apiKey = '9028f5971amsh37ee03973a33ab9p17b4f9jsn1047fac51847'; 
const apiHost = 'microsoft-translator-text-api3.p.rapidapi.com'; 

const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const translateBtn = document.getElementById('translate-btn');
const textArea = document.getElementById('translate-text');
const resultDiv = document.getElementById('input-translated');

// Function to fetch supported languages and populate dropdowns
const fetchLanguages = async () => {
    const url = `https://${apiHost}/languages?api-version=3.0&scope=translation`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost
        }
    };

    try {
        const response = await fetch(url, options);
        console.log('Response Status:', response.status); // Log status to see if the request is successful
        if (response.ok) {
            const data = await response.json();
         
            populateLanguageSelect(data.translation);      // Pass the fetched languages to populate the dropdown
        } else {
            throw new Error(`Error fetching languages: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching languages:', error);  // Log the error in the console
    }
};

// Function to populate the language dropdowns
const populateLanguageSelect = (languages) => {
    for (const code in languages) {
        const name = languages[code].name;

        const optionFrom = document.createElement('option');
        const optionTo = document.createElement('option');

        optionFrom.value = code;
        optionFrom.textContent = name;
        fromSelect.appendChild(optionFrom);

        optionTo.value = code;
        optionTo.textContent = name;
        toSelect.appendChild(optionTo);
    }
};



// Function to call the Microsoft Translator API and translate text
const translateText = async (text, fromLang, toLang) => {
    const url = `https://${apiHost}/translate?to=${toLang}&from=${fromLang}&textType=plain&api-version=3.0`;

    const options = {
        method: 'POST',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ Text: text }])
    };

    try {
        const response = await fetch(url, options);

        // Log response status and URL
        // console.log('Translation Request Status:', response.status);
        // console.log('Translation Request URL:', url);

        if (response.ok) {
            const data = await response.json();
            const translatedText = data[0].translations[0].text;
            resultDiv.innerHTML = translatedText; // Display the translated text
        } else {
            const errorData = await response.json();
            console.error('Translation API Error:', errorData);
            resultDiv.innerHTML = `Translation failed. Error: ${errorData.error.message || 'Unknown error occurred'}`;
        }
    } catch (error) {
        console.error('Error translating text:', error);
        resultDiv.innerHTML = 'Translation failed. Please try again.';
    }
};

// Event listener for translate button
translateBtn.addEventListener('click', () => {
    const text = textArea.value.trim();
    const fromLang = fromSelect.value;
    const toLang = toSelect.value;

    if (text && fromLang && toLang) {
        translateText(text, fromLang, toLang);
    } else {
        resultDiv.innerHTML = 'Please make sure to select both languages and enter text to translate.';
    }
});

// Fetch and populate languages when the page loads
fetchLanguages();
