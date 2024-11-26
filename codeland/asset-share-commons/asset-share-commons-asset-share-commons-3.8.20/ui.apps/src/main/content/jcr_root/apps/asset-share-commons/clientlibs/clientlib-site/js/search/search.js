/*
 * Asset Share Commons
 *
 * Copyright [2017]  Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global jQuery: false, AssetShare: false, window: false */

AssetShare.Search = (function (window, $, ns, ajax) {
    "use strict";

    var EVENT_SEARCH_TYPE_FULL = "search",
        EVENT_SEARCH_TYPE_LOAD_MORE = "load-more",

        ACTION_SEARCH = "search",
        ACTION_DEEP_LINK = "deep-link",
        ACTION_LOAD_MORE = "load-more",
        ACTION_SORT = "sort",
        ACTION_SWITCH_LAYOUT = "switch-layout",

        running = false,

        form = ns.Search.Form(ns);

    function getForm() {
        return form;
    }

    function trigger(eventType, params) {
        $("body").trigger(eventType, params);
    }

    function setAddressBar(queryParams) {
        if (ns.Util.isSameOrigin()) {
            ns.Navigation.addressBar(window.top.location.pathname + "?" + queryParams);
        } else {
            ns.Navigation.addressBar(window.location.pathname + "?" + queryParams);
        }
        ns.Navigation.returnUrl(window.location.pathname + "?" + queryParams);
    }

    function processSearch(fragmentHtml) {
        ns.Elements.update(fragmentHtml, ACTION_SEARCH);
        ns.Navigation.gotoTop();
        setAddressBar(form.serializeFor(ACTION_DEEP_LINK));
        trigger(ns.Events.SEARCH_END, [EVENT_SEARCH_TYPE_FULL]);
        running = false;
    }

    function displayResults(data) {
        const resultContainer = document.getElementById('search-results-container');
        if (!resultContainer) {
            console.error('Container for displaying search results not found.');
            return;
        }

        resultContainer.innerHTML = ''; // Clear existing content

        data.forEach(item => {
            const assetPath = item.imagepath;

            const card = document.createElement('article');
            card.classList.add('ui', 'card', 'cmp-card');
            card.setAttribute('data-asset-share-asset', assetPath);

            const imageWrapper = document.createElement('a');
            imageWrapper.classList.add('image', 'cmp-image__wrapper--card');
            imageWrapper.href = assetPath;

            const img = document.createElement('img');
            img.src = item.imagepath;
            img.classList.add('cmp-image--card');
            img.alt = 'Search Result Image';
            imageWrapper.appendChild(img);
            card.appendChild(imageWrapper);

            const content = document.createElement('div');
            content.classList.add('content');

            const title = document.createElement('h3');
            title.classList.add('header');
            const titleLink = document.createElement('a');
            titleLink.href = assetPath;
            titleLink.textContent = 'Search Result Image';
            title.appendChild(titleLink);
            content.appendChild(title);

            const meta = document.createElement('div');
            meta.classList.add('meta');
            meta.innerHTML = `
                <div class="property three">
                    TYPE: <span class="value">jpg</span>
                </div>
                <div class="property three">
                    SIZE: <span class="value">Unknown</span>
                </div>
            `;
            content.appendChild(meta);
            card.appendChild(content);

            const extraContent = document.createElement('div');
            extraContent.classList.add('extra', 'content');
            const buttonList = document.createElement('ul');
            buttonList.classList.add('cmp_card__action-buttons');

            const downloadButton = document.createElement('button');
            downloadButton.classList.add('ui', 'link', 'button');
            downloadButton.textContent = 'Download';
            downloadButton.setAttribute('data-asset-share-id', 'download-asset');
            downloadButton.setAttribute('data-asset-share-asset', assetPath);
            buttonList.appendChild(downloadButton);

            const shareButton = document.createElement('button');
            shareButton.classList.add('ui', 'link', 'button');
            shareButton.textContent = 'Share';
            shareButton.setAttribute('data-asset-share-id', 'share-asset');
            shareButton.setAttribute('data-asset-share-asset', assetPath);
            buttonList.appendChild(shareButton);

            const addToCartButton = document.createElement('button');
            addToCartButton.classList.add('ui', 'link', 'button');
            addToCartButton.textContent = 'Add to Cart';
            addToCartButton.setAttribute('data-asset-share-id', 'add-to-cart');
            addToCartButton.setAttribute('data-asset-share-asset', assetPath);
            buttonList.appendChild(addToCartButton);

            extraContent.appendChild(buttonList);
            card.appendChild(extraContent);

            resultContainer.appendChild(card);
        });
    }

    function search(e) {
        console.log("********************searching...");
    
        if (e) {
            e.preventDefault();
        }
    
        var query = $("#text-search-field").val();
        console.log("*******path here*******", query); 
    
        if (!running) {
            running = true;
    
            var url = 'http://127.0.0.1:5000/get_temporary_neighbors?text_query=' + encodeURIComponent(query);
    
            $.ajax({
                url: url,
                method: 'POST',
                beforeSend: function(xhr) {
                    var username = 'golem';
                    var password = 'washere';
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
                },
                success: function(response) {
                    console.log("Search results:", response);
                    displayResults(response);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("Search failed:", textStatus, errorThrown);
                    running = false;
                }
            });
        }
    }

    function loadMore(e) {
        if (e) {
            e.preventDefault();
        }
        if (!running) {
            running = true;
            if (form.submit(ACTION_LOAD_MORE, false, processSearch)) {
                trigger(ns.Events.SEARCH_BEGIN, [EVENT_SEARCH_TYPE_LOAD_MORE]);
            } else {
                trigger(ns.Events.SEARCH_INVALID, [EVENT_SEARCH_TYPE_LOAD_MORE]);
                running = false;
            }
        }
    }

    function sortResults(e) {
        if (e) {
            e.preventDefault();
        }
        if (!running) {
            running = true;
            if (form.submit(ACTION_SORT, false, processSearch)) {
                trigger(ns.Events.SEARCH_BEGIN, [EVENT_SEARCH_TYPE_FULL]);
            } else {
                trigger(ns.Events.SEARCH_INVALID, [EVENT_SEARCH_TYPE_FULL]);
                running = false;
            }
        }
    }

    function switchLayout(e) {
        e.preventDefault();
        if (!running) {
            running = true;

            ns.Data.val("layout", $(this).val());
            if (form.submit(ACTION_SWITCH_LAYOUT, false, processSearch)) {
                trigger(ns.Events.SEARCH_BEGIN, [EVENT_SEARCH_TYPE_FULL]);
            } else {
                trigger(ns.Events.SEARCH_INVALID, [EVENT_SEARCH_TYPE_FULL]);
                running = false;
            }
        }
    }

    (function() {
        if (ns.Elements.element("form").length > 0) {
            ns.Navigation.returnUrl(window.location.pathname + window.location.search);
        }
    }());

    (function registerEvents() {
        var formId = getForm().id();

        $("body").on("submit", "#" + formId, search);
        $("body").on("click", ns.Elements.selector("load-more"), loadMore);
        $("body").on("change", ns.Elements.selector("sort"), sortResults);
        $("body").on("click", ns.Elements.selector("switch-layout"), switchLayout);

        $("body").on("change", "[data-asset-share-search-on='change']", search);
        $("body").on("click", "[data-asset-share-search-on='click']", search);

        $("button[form='" + formId + "']").on("click", search);
        $("input[form='" + formId + "']").keypress(function(e) {
            if ((e.keyCode || e.which) === 13) {
                search(e);
            }
        });

        window.addEventListener('popstate', function(event) {
            if (getForm()) { window.location.reload(); }
        });
    }());

    return {
        loadMore: loadMore,
        search: search,
        sortResults: sortResults,
        switchLayout: switchLayout,
        form: getForm
    };

}(window, jQuery, AssetShare, AssetShare.Ajax));


