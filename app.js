const form = document.querySelector('form');
const resultDiv = document.querySelector(".result");

form.addEventListener("submit" ,(e) =>
{
    e.preventDefault(); //preventing reload when we click the submit//
    // This prevents the browser's default form-submission behavior, allowing JavaScript to fetch the word without reloading the page.//
    
    getWordInfo(form.elements[0].value);

});


const getWordInfo = async (word) => {
    resultDiv.innerHTML = "<p>Searching...</p>";

    try {
        const response = await fetch(
            `https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(word)}`

            //the word encodeURIComponent(word) means It safely encodes the word before inserting it into the URL.//
        );

        if (!response.ok) {
            throw new Error("Word not found");
        }

        const data = await response.json();
        const entry = data.entries?.[0];  
        // data.entries accesses the array of dictionary entries.//
        const sense = entry?.senses?.[0];

        if (!entry || !sense) {
            resultDiv.textContent = "No definition found.";
            return;
        }

        // Get similar words (synonyms)
        const synonyms = sense.synonyms || [];

        const similarWords = synonyms.length > 0
            ? synonyms.map(item =>
                typeof item === "string" ? item : item.text
              ).filter(Boolean).join(", ")
            : "No similar words found.";

        resultDiv.innerHTML = `
            <h2><strong>Word:</strong> ${data.word || word}</h2> 

            <p><strong>Part of Speech:</strong>
                ${entry.partOfSpeech || "Not available"}
            </p>

            <p><strong>Meaning:</strong>
                ${sense.definition || "No definition found."}
            </p>

            <p><strong>Similar Words:</strong>
                ${similarWords}
            </p>
        `;

    } catch (error) {
        console.error(error);
        resultDiv.textContent =
            "Unable to find the word. Please try another word.";
    }
};

