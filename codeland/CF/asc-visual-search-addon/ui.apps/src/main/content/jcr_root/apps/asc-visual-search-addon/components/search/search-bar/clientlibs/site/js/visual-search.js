
document.addEventListener('DOMContentLoaded', function () {
    const similarButton = document.getElementById('search-similar');

    if (similarButton) {

        similarButton.addEventListener('click', function () {
            console.log("*******fired*********");
            
            handleSearch(this); 
        });
    } else {
        console.log("Search Similar button not found!");
    }
})

/**
 * Function to handle the search operation
 */
function handleSearch() {

    // Retrieve the asset path: i have to change this
    const fullAssetPath = getAssetPathFromUrl();


    if (!fullAssetPath) {
        console.log("Asset path not found!");
        return;
    }

    const assetPath = extractAssetPath(fullAssetPath);

    if (!assetPath) {
        console.error("Invalid asset path.");
        return;
    }

    console.log("Final Asset Path: ", assetPath);

    const apiUrl = new URL('/bin/visualsearch/get_nearest_neighbors', window.location.origin);

    // Add the `use_asc_table` parameter
    const useAscTable = true;
    apiUrl.searchParams.append('asc_request', useAscTable);
    apiUrl.searchParams.append('path', assetPath);

    showLoader();

    fetch(apiUrl.toString())
        .then(response => response.json())
        .then(data => {
            hideLoader(); 

            if (!data || (Array.isArray(data) && data.length === 0) || data.error) {
                displayNoResultsMessage();
            } else {
                displaySimilarImages(data);
            }
        })
        .catch(error => {
            hideLoader();
            console.error('Error fetching similar images:', error);
        });
}

/**
 * Function to extract the asset path from the full URL.
 * @returns {string} - The asset path
 */
function getAssetPathFromUrl() {
    const fullUrl = window.location.href; // Get the full URL of the page
    console.log("Current page URL:", fullUrl);

    // Extract the asset path from the URL (after '/content/dam')
    const assetPath = extractAssetPath(fullUrl);
    return assetPath;
}

/**
 * Function to extract the asset path from the full URL.
 * @param {string} fullUrl - The full URL
 * @returns {string} - The asset path
 */
function extractAssetPath(fullUrl) {
    const startIdx = fullUrl.indexOf('/content/dam');

    if (startIdx !== -1) {
        return fullUrl.substring(startIdx);  // Extract asset path from the URL
    } else {
        console.error("Asset path could not be extracted from the full URL.");
        return null;
    }
}



 /**
 * Function to display similar images based on the response from the API.
 * Reuses the Asset Share Commons image card structure.
 * @param {Array} data - Array of objects containing image paths and scores.
 */
function displaySimilarImages(data) {
    const resultContainer = document.getElementById('single-similar-images-container');
    if (!resultContainer) {
        console.log('Container for  similar images not found.');
        return;
    }

    resultContainer.innerHTML = '';

    // current mode (dark or light)
    const currentPath = window.location.pathname;
    const isDarkMode = currentPath.includes('/dark');
    const modePath = isDarkMode ? 'dark' : 'light';

    data.forEach(item => {
        const assetPath = item.imagepath;
        const imageScore = item.score;

        // Create article element (image card)
        const card = document.createElement('article');
        card.classList.add('ui', 'card', 'cmp-card');
        card.setAttribute('data-asset-share-asset', assetPath);

        // Create anchor tag for image with link
        const imageWrapper = document.createElement('a');
        imageWrapper.classList.add('image', 'cmp-image__wrapper--card');
        imageWrapper.href = assetPath;

        const img = document.createElement('img');
        img.src = assetPath;
        img.classList.add('cmp-image--card');
        img.alt = 'Similar Image';
        imageWrapper.appendChild(img);

         //redirect to the details 
         imageWrapper.addEventListener('click', function (event) {
            event.preventDefault(); 

            const detailsUrl = `/content/asset-share-commons/en/${modePath}/details/image.html${assetPath}`;
            window.location.href = detailsUrl;
        })

        // Add score overlay to image
        const scoreOverlay = document.createElement('div');
        scoreOverlay.classList.add('score-overlay');
        scoreOverlay.textContent = `${parseFloat(imageScore).toFixed(2)}`;
        imageWrapper.appendChild(scoreOverlay);

        card.appendChild(imageWrapper);

        // Create content section (title, meta information)
        const content = document.createElement('div');
        content.classList.add('content');

        // Add title (image name)
        const title = document.createElement('h3');
        title.classList.add('header');
        const titleLink = document.createElement('a');
        titleLink.href = assetPath;
        titleLink.textContent = 'Similar Image';
        title.appendChild(titleLink);
        content.appendChild(title);

        card.appendChild(content);

        // Create extra content section (buttons for Download, Share, Add to Cart)
        const extraContent = document.createElement('div');
        extraContent.classList.add('extra', 'content');

        const buttonList = document.createElement('ul');
        buttonList.classList.add('cmp_card__action-buttons');

        // Download button
        const downloadButton = document.createElement('button');
        downloadButton.classList.add('ui', 'link', 'button');
        downloadButton.textContent = 'Download';
        downloadButton.setAttribute('data-asset-share-id', 'download-asset');
        downloadButton.setAttribute('data-asset-share-asset', assetPath);
        buttonList.appendChild(downloadButton);

        // Share button
        const shareButton = document.createElement('button');
        shareButton.classList.add('ui', 'link', 'button');
        shareButton.textContent = 'Share';
        shareButton.setAttribute('data-asset-share-id', 'share-asset');
        shareButton.setAttribute('data-asset-share-asset', assetPath);
        buttonList.appendChild(shareButton);

        // Add to Cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('ui', 'link', 'button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.setAttribute('data-asset-share-id', 'add-to-cart');
        addToCartButton.setAttribute('data-asset-share-asset', assetPath);
        buttonList.appendChild(addToCartButton);

        extraContent.appendChild(buttonList);
        card.appendChild(extraContent);

        // Append the card to the result container
        resultContainer.appendChild(card);
    })
}


    /**
     * Utility function to show a loading indicator.
     */
    function showLoader() {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.style.display = 'block';
        }
    }

    /**
     * Utility function to hide the loading indicator.
     */
    function hideLoader() {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.style.display = 'none';
        }
    }


    /**
 * Function to display a "No similar images found" message.
 */
function displayNoResultsMessage() {
    const resultContainer = document.getElementById('single-similar-images-container');
    if (!resultContainer) {
        console.log('Container for displaying similar images not found.');
        return;
    }

    // Clear existing content
    resultContainer.innerHTML = '';

    // Create and display a message element
    const message = document.createElement('p');
    message.classList.add('no-results-message');
    message.textContent = 'No similar images found!';
    resultContainer.appendChild(message);
}


//search field here

window.visualSearchBar = function () {

    // Function to detect the browser type
    function detectBrowser() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes("Firefox")) {
            return "Firefox";
        } else if (userAgent.includes("Chrome") || userAgent.includes("CriOS")) {
            return "Chrome";
        } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
            return "Safari";
        } else if (userAgent.includes("Brave")) {
            return "Brave";
        }
        return "Unknown";
    }

    // Adjust input behavior based on the browser
    function adjustInputForBrowser() {
        const browser = detectBrowser();
        const imageInput = document.getElementById("image-upload-input");

        if (imageInput) {
            if (browser === "Firefox" || browser === "Safari") {
                imageInput.setAttribute("accept", "image/*");
            } else if (browser === "Chrome" || browser === "Brave") {
                imageInput.setAttribute("accept", "image/*;capture=camera");
            }
        }
    }

    // Function to handle the search logic
    function handleSearch(isTextSearch = false) {
        const apiUrl = new URL(`${SERVLET_URL}`); //to be changed
        const username = basic_auth_username; //to be removed : i have to use the one from osgi
        const password = basic_auth_password;//to be removed

        showLoader();
        toggleSectionVisibility(false); 

        const useAscTable = true;
        apiUrl.searchParams.append("asc_request", useAscTable);

        if (isTextSearch) {
            const searchedImageContainer = document.getElementById('searched-image-container');
            searchedImageContainer.innerHTML = ""; 

            const queryText = document.querySelector('.ui.input input').value.trim();
            if (!queryText) {
                alert("Please enter a text query.");
                hideLoader();
                return;
            }
            apiUrl.searchParams.append("text_query", queryText);

            fetch(apiUrl.toString(), {
                method: 'POST',
                headers: {
                    Authorization: "Basic " + btoa(`${username}:${password}`)
                }
            })
                .then(response => response.json())
                .then(data => {
                    hideLoader();
                    displaySimilarImages(data);
                })
                .catch(error => {
                    hideLoader();
                    console.error("Error:", error);
                });
        } else {
            const imageFile = document.getElementById('image-upload-input').files[0];
            if (imageFile) {
                resizeImage(imageFile, 1000, 1000, 0.7, (resizedImageBlob) => {
                    const formData = new FormData();
                    formData.append('file', resizedImageBlob, imageFile.name);

                    fetch(apiUrl.toString(), {
                        method: 'POST',
                        headers: {
                            Authorization: "Basic " + btoa(`${username}:${password}`)
                        },
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            hideLoader();
                            displaySearchedImage(resizedImageBlob);
                            displaySimilarImages(data);
                        })
                        .catch(error => {
                            hideLoader();
                            console.error("Error:", error);
                        });
                });
            }
        }
    }

    function displaySimilarImages(data) {
    const resultContainer = document.getElementById('similar-images-container');
    if (!resultContainer) {
        console.log('Container for displaying similar images not found.');
        return;
    }

    resultContainer.innerHTML = '';

    // current mode (dark or light)
    const currentPath = window.location.pathname;
    const isDarkMode = currentPath.includes('/dark.html');
    const modePath = isDarkMode ? 'dark' : 'light';


    data.forEach(item => {
        const assetPath = item.imagepath;
        const imageScore = item.score;

        // Create article element (image card)
        const card = document.createElement('article');
        card.classList.add('ui', 'card', 'cmp-card');
        card.setAttribute('data-asset-share-asset', assetPath);

        // Create anchor tag for image with link
        const imageWrapper = document.createElement('a');
        imageWrapper.classList.add('image', 'cmp-image__wrapper--card');
        imageWrapper.href = assetPath;

        const img = document.createElement('img');
        img.src = item.imagepath;
        img.classList.add('cmp-image--card');
        img.alt = 'Similar Image';
        imageWrapper.appendChild(img);

         //redirect to the details page dynamically
        imageWrapper.addEventListener('click', function (event) {
            event.preventDefault(); 

            const detailsUrl = `/content/asset-share-commons/en/${modePath}/details/image.html${assetPath}`;
            window.location.href = detailsUrl;
        });

        //todo: score overlay
        const scoreOverlay = document.createElement('div');
        scoreOverlay.classList.add('score-overlay');
        scoreOverlay.textContent = `${parseFloat(imageScore).toFixed(2)}`;
        imageWrapper.appendChild(scoreOverlay);

        card.appendChild(imageWrapper);

        // Create content section (title, meta information)
        const content = document.createElement('div');
        content.classList.add('content');

        // Add title (image name)
        const title = document.createElement('h3');
        title.classList.add('header');
        const titleLink = document.createElement('a');
        titleLink.href = assetPath;
        titleLink.textContent = `Similar image`;//todo: ADD IMAGE SEARCH SCORE RESULT ON THE CARDS
        title.appendChild(titleLink);
        content.appendChild(title);

         // Add meta info (size, type, resolution)
        // const meta = document.createElement('div');
        // meta.classList.add('meta');
        // meta.innerHTML = `
           
        //     <div class="property three">
        //         TYPE: <span class="value">jpg</span> <!-- Placeholder, replace if info is available -->
        //     </div>
        //      <div class="property three">
        //         SIZE: <span class="value">Unknown</span> <!-- Placeholder, replace if info is available -->
        //     </div>
        //     `;
        // content.appendChild(meta);

        card.appendChild(content);

        // Create extra content section (buttons for Download, Share, Add to Cart)
        const extraContent = document.createElement('div');
        extraContent.classList.add('extra', 'content');

        const buttonList = document.createElement('ul');
        buttonList.classList.add('cmp_card__action-buttons');

        // Download button
        const downloadButton = document.createElement('button');
        downloadButton.classList.add('ui', 'link', 'button');
        downloadButton.textContent = 'Download';
        downloadButton.setAttribute('data-asset-share-id', 'download-asset');
        downloadButton.setAttribute('data-asset-share-asset', assetPath);
        buttonList.appendChild(downloadButton);

        // Share button
        const shareButton = document.createElement('button');
        shareButton.classList.add('ui', 'link', 'button');
        shareButton.textContent = 'Share';
        shareButton.setAttribute('data-asset-share-id', 'share-asset');
        shareButton.setAttribute('data-asset-share-asset', assetPath);
        buttonList.appendChild(shareButton);

        // Add to Cart button
        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('ui', 'link', 'button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.setAttribute('data-asset-share-id', 'add-to-cart');
        addToCartButton.setAttribute('data-asset-share-asset', assetPath);
        buttonList.appendChild(addToCartButton);

        extraContent.appendChild(buttonList);
        card.appendChild(extraContent);

        // Append the card to the result container
        resultContainer.appendChild(card);
    });
}

function displaySearchedImage(imageBlob) {
    const searchedImageContainer = document.getElementById('searched-image-container');
    if (!searchedImageContainer) {
        console.log('Div not found.');
        return;
    }
    searchedImageContainer.innerHTML = ""; 

    const imgElement = document.createElement("img");
    imgElement.src = URL.createObjectURL(imageBlob);
    imgElement.alt = "Searched Image";
    imgElement.classList.add("searched-image");
    searchedImageContainer.appendChild(imgElement);
}


   // Utility function to show a loading indicator.
   function showLoader() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.style.display = 'block';
    }
}

// Utility function to hide the loading indicator.
function hideLoader() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Utility function to toggle the visibility of results-content and similar-images-section
function toggleSectionVisibility(showResultsContent) {
    const resultsContent = document.getElementById('results-content');
    console.log("******************");
    
    const similarImagesSection = document.querySelector('.similar-images-section');

    if (showResultsContent) {
        resultsContent.style.display = 'block';
        similarImagesSection.style.display = 'none';
    } else {
        resultsContent.style.display = 'none';
        similarImagesSection.style.display = 'block';
    }
}

    // Function to resize images
    function resizeImage(file, maxWidth, maxHeight, quality, callback) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
        };
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
                const aspectRatio = width / height;
                if (width > height) {
                    width = maxWidth;
                    height = Math.round(width / aspectRatio);
                } else {
                    height = maxHeight;
                    width = Math.round(height * aspectRatio);
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                callback(blob);
            }, 'image/jpeg', quality);
        };

        reader.readAsDataURL(file);
    }

    // Event listener for the search bar
    function init() {
        const customSearchBarContainer = document.querySelector('[data-component="asc-visual-search-bar"]');
        if (!customSearchBarContainer) {
            console.log('Custom Search Bar Container not found.');
            return;
        }

        adjustInputForBrowser();

        // Check for `fulltext` in the URL and trigger a search if present
        const urlParams = new URLSearchParams(window.location.search);
        const fulltextQuery = urlParams.get("fulltext");
        if (fulltextQuery) {
            const textSearchInput = customSearchBarContainer.querySelector('.ui.input input');
            if (textSearchInput) {
                textSearchInput.value = fulltextQuery;
                console.log("Detected fulltext query:", textSearchInput.value);
                handleSearch(true); // Trigger text search
            }
        }

        // Add event listeners for interactions
        const imageUploadInput = document.getElementById('image-upload-input');
        if (imageUploadInput) {
            imageUploadInput.addEventListener('change', () => handleSearch());
        }

        const searchIcon = document.getElementById('search-button');
        if (searchIcon) {
            searchIcon.addEventListener('click', () => handleSearch(true));
        }

        const textSearchInput = customSearchBarContainer.querySelector('.ui.input input');
        if (textSearchInput) {
            textSearchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    handleSearch(true);
                }
            });
        }
    }

    // Trigger initialization when the page loads
    window.addEventListener('DOMContentLoaded', init);
    

    // Return public methods if needed for external calls
    return {
        init: init
    };

}();

// Initialize only if the component is on the page
window.addEventListener('load', () => {
    if (document.querySelector('[data-component="asc-visual-search-bar"]')) {
        window.visualSearchBar.init();
    }
});






