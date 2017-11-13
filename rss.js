let feeds = document.getElementsByClassName('rss');
for (let i=0; i<feeds.length; i++) {
    let feed = feeds[i];
    feed.innerHTML = '<i>Loading RSS feed...</i>'
    fetch(feed.dataset['source'])
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
        .then(xml => parseRSS(feed, xml));
}

function parseRSS(feed, xml) {
    items = xml.querySelectorAll('rss > channel > item');
    let maxItems = feed.dataset['limit'];
    if (items.length < maxItems) maxItems = items.length;
    if (maxItems == 0) {
        feed.innerHTML = '<i>No events scheduled</i>';
    } else {
        feed.innerHTML = '';
    }
    for (let i=0; i<maxItems; i++) {
        let item = items[i];
        let title = item.querySelector('title').textContent;
        let link = item.querySelector('link').textContent;
        let description = item.querySelector('description').textContent;
        let short = description;
        if (feed.dataset.hasOwnProperty('delimiter')) {
            short = short.substr(0, short.indexOf(feed.dataset['delimiter']));
        }
        let entry = `<h3>${title}</h3>
        ${short}
        <a href="${link}">Read more...</a>`;
        feed.innerHTML += entry;
    }
}
