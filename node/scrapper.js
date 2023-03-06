import fs from 'fs';
import request from 'request';
import chrome from 'selenium-webdriver/chrome.js';
import { Builder, Browser, By, Key, until } from 'selenium-webdriver';
import https from 'https';
import path from 'path';

function findUrls(text) {
    var matches, match, urls = [], url;
    text = text.replaceAll(' "', '"');
    matches = text.match(/a [\d\w/\-:.%+?;_&="{},’ ]*href="[\d\w/\-:.%+?;_&=]*"/g);
    for (match in matches) {
        match = matches[match];
        if (match.indexOf(the_base) !== -1) {
            continue;
        }
        url = match.split('href="')[1];
        url = url.split('"')[0];
        try {
            url = decodeURIComponent(url);
        } catch (err) {
            continue;
        }

        if (url[0] == '/') {
            if (url.indexOf('.html') === -1) {
                if (url[url.length - 1] == '/') {
                    text = text.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url.slice(1, -1)) + '.html"');
                } else {
                    text = text.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url.slice(1)) + '.html"');
                }
            } else {
                text = text.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url.slice(1)) + '"');
            }
        } else {
            if (url.indexOf('.html') === -1) {
                if (url[url.length - 1] == '/') {
                    text = text.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url.slice(-1)) + '.html"');
                } else {
                    text = text.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url) + '.html"');
                }
            } else {
                text = text.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url) + '"');
            }
        }
        urls.push(url);
    }
    text = text.replaceAll('"/webpack/"', '"' + the_base + 'webpack/"');
    return [text, urls];
}

function fixUrls(text) {
    var matches, match, urls = [], url;
    text = text.replaceAll(' "', '"');
    matches = text.match(/a [\d\w/\-:.%+?;_&="{},’ ]*href="[\d\w/\-:.%+?;_&=]*"/g);

    for (match in matches) {
        match = matches[match];
        if (match.indexOf(the_base) !== -1) {
            continue;
        }
        url = match.split('href="')[1];
        url = url.split('"')[0];
        try {
            url = decodeURIComponent(url);
        } catch (err) {
            continue;
        }

        if (url[0] == '/' || (url[0] == '.' && url[1] == '/')) {
            text = text.replaceAll('"' + url + '"', '"' + the_scrape_url + url + '"');
        }
    }
    matches = text.match(/"\.\/[\d\w/\-:.%+?;_&=]\.js"*/g);
    for (match in matches) {
        match = matches[match];
        if (match.indexOf(the_base) !== -1) {
            continue;
        }
        url = match.split('"')[1];
        url = url.split('"')[0];
        try {
            url = decodeURIComponent(url);
        } catch (err) {
            continue;
        }

        if (url[0] == '/' || (url[0] == '.' && url[1] == '/')) {
            text = text.replaceAll('"' + url + '"', '"' + the_scrape_url + url + '"');
        }
    }
    text = text.replaceAll('"/webpack/"', '"' + the_scrape_url + '/webpack/"');

    return text;
}
function findCss(text) {
    var matches, match, new_match, urls = [], url;
    matches = text.match(/link rel="stylesheet" .+href="[\d\w/\-:.%+?;&=]*"/g);
    for (match in matches) {
        match = matches[match];
        url = match.split('href="')[1];
        if (!url) {
            continue;
        }
        url = url.split('"')[0];
        try {
            url = decodeURIComponent(url);
        } catch (err) {
            continue;
        }
        if (url[0] == '/') {
            new_match = match.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url.slice(1)) + '"');
        } else {
            new_match = match.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url) + '"');
        }
        text = text.replaceAll(match, new_match);
        urls.push(url);
    }
    return [text, urls];
}

function findJs(text) {
    var matches, match, new_match, urls = [], url;
    matches = text.match(/<script [\d\w/\-:.%+?;&=" ]*src="[\d\w/\-:.%+?;&=]+"/g);
    for (match in matches) {
        match = matches[match];
        url = match.split('src="')[1];
        if (!url) {
            continue;
        }
        url = url.split('"')[0];
        try {
            url = decodeURIComponent(url);
        } catch (err) {
            continue;
        }
        if (url[0] == '/') {
            new_match = match.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url.slice(1)) + '"');
        } else {
            new_match = match.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url) + '"');
        }
        text = text.replaceAll(match, new_match);
        urls.push(url);
    }
    matches = text.match(/"\.\/[\d\w/\-:.%+?;_&=]\.js"*/g);
    for (match in matches) {
        match = matches[match];
        if (match.indexOf(the_base) !== -1) {
            continue;
        }
        url = match.split('"')[1];
        url = url.split('"')[0];
        try {
            url = decodeURIComponent(url);
        } catch (err) {
            continue;
        }
    }
    return [text, urls];
}

function findImg(text) {
    var matches, match, new_match, urls = [], url;
    matches = text.match(/img .+src="[\d\w/\-:.%+?;&=]*"/g);
    for (match in matches) {
        match = matches[match];
        url = match.split('src="')[1];
        if (!url) {
            continue;
        }
        url = url.split('"')[0];
        try {
            url = decodeURIComponent(url);
        } catch (err) {
            continue;
        }
        if (url[0] == '/') {
            new_match = match.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url.slice(1)) + '"');
        } else {
            new_match = match.replaceAll('"' + url + '"', '"' + the_base + removeUrl(url) + '"');
        }
        text = text.replaceAll(match, new_match);
        urls.push(url);
    }
    return [text, urls];
}

function download(uri, filename) {
    if (uri.indexOf('https://') === -1) {
        if (uri.indexOf('//') !== -1) {
            uri = 'https:' + uri;
        } else {
            uri = 'https://' + uri;
        }
    }
    var request = https.get(uri, function (response) {
        if (filename.lastIndexOf("/") == filename.length - 1) {
            filename = filename.slice(0, -1);
            filename += '.html';
        }
        var file_base = filename.split('/').slice(0, -1);
        file_base = file_base.join('/');
        if (!fs.existsSync(file_base)) {
            fs.mkdirSync(file_base, { recursive: true });
        }
        var file = fs.createWriteStream(filename);;
        response.pipe(file);
    }).on('error', (e) => {
    });;
};


function removeScrapeUrl(filename) {
    var scrape_url;
    for (scrape_url in the_scrape_urls) {
        scrape_url = the_scrape_urls[scrape_url];
        filename = filename.replaceAll(scrape_url, '');
    }
    if (filename == '') {
        filename = 'index';
    }
    return filename
}

function removeUrl(filename) {
    var filenames, scrape_url, base = false;
    filenames = filename.split('.com');
    if (filenames.length > 1) {
        filename = filenames[1];
    };

    if (filename == '/') {
        filename = 'index';
    }

    filename = filename.split('?')[0];

    return filename;
}

function addScrapeUrl(filename) {
    var scrape_url;
    for (scrape_url in the_scrape_urls) {
        scrape_url = the_scrape_urls[scrape_url];
        if (filename.indexOf(scrape_url) !== -1) {
            return filename;
        }
    }
    if (filename.indexOf('.com') !== -1) {
        return filename;
    }
    return the_scrape_url + filename;
}

async function scrape(the_url, depth, driver) {
    var source, files, file, urls, url, base = false;
    if (the_url.indexOf('.com') !== -1) {
        for (var scrape_url in the_scrape_urls) {
            scrape_url = the_scrape_urls[scrape_url];
            if (the_url.indexOf(scrape_url) === 0) {
                base = true;
            }
        }
        if (!base) {
            return;
        }
    }
    await driver.get(the_url);
    await driver.wait(function () {
        return driver.executeScript('return document.readyState').then(function (readyState) {
            return readyState === 'complete';
        });
    }); 
    source = await driver.getPageSource();
    source = source.replace('</head>',`<script>
    window.onload = async function(){    
        var a = document.createElement('div');
        a.className = 'custom-translate';
        a.id = 'google_translate_element';
        document.body.appendChild(a);
        a = document.createElement('style');
        a.innerHTML = \`
        body{
            top:0 !important;
        }
        .goog-te-banner-frame,.custom-translate {
                display: none;
        }
        .goog-tooltip {
            display: none !important;
        }
        .goog-tooltip:hover {
            display: none !important;
        }
        .goog-text-highlight {
            background-color: transparent !important;
            border: none !important; 
            box-shadow: none !important;
        }
        .skiptranslate{
            display:none !important;
        }
        \`;
        document.head.appendChild(a);
        a = document.createElement('input');
        a.id = 'translation_completed';
        a.type = 'hidden';
        a.value = 0;
        document.body.appendChild(a);
        a = document.createElement('script');
        a.innerHTML = \`            
            async function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                    pageLanguage: 'en', 
                    includedLanguages: 'hi', 
                    autoDisplay: false
                }, 'google_translate_element');

                console.log('in1');
                document.getElementById('translation_completed').value = '1';
                await loader2();
            }
            var timer = ms => new Promise(res => setTimeout(res, ms))

            async function loader2 () { // We need to wrap the loop into an async function for this to work
                while(document.getElementById('translation_completed').value!=='1'){
                    await timer(1000); // then the created Promise can be awaited
                }
                var a = document.querySelector("#google_translate_element select");
                console.log('in2');
                if(a){
                    a.selectedIndex=0;
                    a.dispatchEvent(new Event('change'));
                }                
            }
        \`;
        document.body.appendChild(a);
        var googleTranslateScript = document.createElement('script');
        googleTranslateScript.type = 'text/javascript';
        googleTranslateScript.async = true;
        googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        ( document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] ).appendChild( googleTranslateScript );
        var timer = ms => new Promise(res => setTimeout(res, ms))

        async function loader () { // We need to wrap the loop into an async function for this to work
            while(document.getElementById('translation_completed').value!=='1'){
                await timer(1000); // then the created Promise can be awaited
            }
            var a = document.querySelector("#google_translate_element select");
            if(a){
                a.selectedIndex=0;
                a.dispatchEvent(new Event('change'));
            }                
        }

        await loader();
    }</script></head>`);
    the_url = removeUrl(the_url);
    if (the_url[the_url.length - 1] == '/') {
        the_url = the_url.slice(0, -1);
    }
    if (the_url == '') {
        the_url = 'index';
    }
    var file_base = (the_base + the_url).split('/');
    if (file_base.length > 1) {
        file_base = file_base.slice(0, -1);
        file_base = file_base.join('/');
    } else {
        file_base = file_base[0];
    }
    if (!fs.existsSync(file_base)) {
        fs.mkdirSync(file_base, { recursive: true });
    }
    [source, files] = findJs(source);
    for (file in files) {
        file = files[file];
        file = decodeURIComponent(file);
        file = file.split('?')[0];
        download(addScrapeUrl(file), the_base + removeUrl(file));
    }
    [source, files] = findCss(source);
    for (file in files) {
        file = files[file];
        file = decodeURIComponent(file);
        file = file.split('?')[0];
        download(addScrapeUrl(file), the_base + removeUrl(file));
    }
    [source, files] = findImg(source);
    for (file in files) {
        file = files[file];
        file = decodeURIComponent(file);
        file = file.split('?')[0];
        download(addScrapeUrl(file), the_base + removeUrl(file));
    }
    depth -= 1;
    if (depth >= 0) {
        console.log(the_url, depth);
        [source, urls] = findUrls(source);
        for (url in urls) {
            url = urls[url];
            if (url == '') {
                continue;
            }
            try {
                url = decodeURIComponent(url);
            } catch (err) {
                continue;
            }
            url = addScrapeUrl(url);
            await scrape(url, depth, driver);
        }
    } else {
        source = fixUrls(source);
    }
    fs.writeFileSync(the_base + the_url + '.html', source);

}

var the_scrape_urls = ['https://www.classcentral.com', 'https://classcentral.com'];
var the_scrape_url = "https://www.classcentral.com";
const __dirname = path.resolve().split('\\').join('/');
var the_base = __dirname + '/scraps/' + the_scrape_url.split('.com')[0].split('https://')[1].split('www.')[1] + '/';

async function start() {
    let driver = new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions()
        .build();
    if (!fs.existsSync(the_base)) {
        fs.mkdirSync(the_base);
    }
    await scrape(the_scrape_url, 1, driver);
    driver.close();
}

start();