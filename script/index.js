function acceptCookies() {
    document.getElementById('cookieBanner').style.display = 'none';
    // Set a cookie or use local storage to remember user's preference
    // Example: document.cookie = 'cookiesAccepted=true; expires=Fri, 31 Dec 9999 23:59:59 GMT';
}

// Check if cookies are accepted or show the banner
if (document.cookie.indexOf('cookiesAccepted=true') === -1) {
    document.getElementById('cookieBanner').style.display = 'block';
}