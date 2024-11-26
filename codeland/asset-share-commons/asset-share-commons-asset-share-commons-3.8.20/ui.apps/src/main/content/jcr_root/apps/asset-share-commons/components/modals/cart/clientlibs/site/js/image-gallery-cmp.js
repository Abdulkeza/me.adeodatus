(function (document, $) {
    'use strict';

    /**
     * Function to search for similar images when the "Search Similar" button is clicked.
     * @param {HTMLElement} button - The button element that was clicked.
     */
    window.searchSimilar = function (button) {
        // Retrieve the asset path from the data attribute
        const assetPath = button.getAttribute('data-asset-share-asset');

        console.log("************** Search by similar *************", assetPath);

        if (!assetPath) {
            console.error("Asset path not found.");
            return;
        }

        // Construct the web service endpoint URL
        const apiUrl = `http://127.0.0.1:5000/get_nearest_neighbors?path=${encodeURIComponent(assetPath)}`;

        // Basic authentication details
        const username = 'golem';
        const password = 'washere';

        // Basic Auth encoding
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));

        // Show a loading indicator while fetching data
        showLoader();

        // Perform the API call
        fetch(apiUrl, {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(data => {
            hideLoader(); // Hide the loader once the data is received
            displaySimilarImages(data); // Call function to display similar images
        })
        .catch(error => {
            hideLoader();
            console.error('Error fetching similar images:', error);
        });
    };

    /**
     * Function to display similar images based on the response from the API.
     * Reuses the Asset Share Commons image card structure.
     * @param {Array} data - Array of objects containing image paths and scores.
     */
    function displaySimilarImages(data) {

        const resultContainer = document.getElementById('similar-images-container');
        if (!resultContainer) {
            console.error('Container for displaying similar images not found.');
            return;
        }

        // Clear existing content
        resultContainer.innerHTML = '';

        // Reuse card structure from Asset Share Commons for displaying similar images
        data.forEach(item => {
            const assetPath = item.imagepath;

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

            card.appendChild(imageWrapper);

            // Create content section (title, meta information)
            const content = document.createElement('div');
            content.classList.add('content');

            // Add title (image name)
            const title = document.createElement('h3');
            title.classList.add('header');
            const titleLink = document.createElement('a');
            titleLink.href = assetPath;
            titleLink.textContent = 'Similar Image'; // Modify this to use actual image name if available
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

})(document, jQuery);
