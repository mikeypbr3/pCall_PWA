// PDF.js initialization
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

// Load and display PDF
pdfjsLib.getDocument('protocol.pdf').promise.then(function(pdf) {
    const pdfViewer = document.getElementById('pdf-viewer');
    
    // Function to render a page
    function renderPage(pageNumber) {
        pdf.getPage(pageNumber).then(function(page) {
            const scale = 1.5;
            const viewport = page.getViewport({scale: scale});

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            pdfViewer.appendChild(canvas);
            page.render(renderContext);
        });
    }

    // Render all pages
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        renderPage(pageNumber);
    }
});

// PWA installation
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', (e) => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
}