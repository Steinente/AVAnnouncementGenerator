const defaultSettings = {
    chapter: 'Magdeburg',
    twoLines: false,
    date: '01. Januar 2024',
    time: '14:00 - 18:00 Uhr',
    place: 'Willy-Brandt-Platz'
};

document.getElementById('previewBtn').addEventListener('click', function() {
    generateImage(() => { });
});

document.getElementById('downloadBtn').addEventListener('click', function() {
    const chapterInput = document.getElementById('chapter').value.trim().toLowerCase() || defaultSettings.chapter.toLowerCase();
    const dateInput = document.getElementById('date').value.trim().toLowerCase() || defaultSettings.date.toLowerCase();
    const formattedDate = convertMonthToNumber(dateInput).replace(/\s+/g, '');
    const sanitizedChapter = chapterInput.replace(/\s+/g, '-');
    const fileName = `announcement_${sanitizedChapter}_${formattedDate}.png`;
    
    generateImage((canvas) => {
        const imageUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 1);
});

document.getElementById('helpIcon').addEventListener('click', function() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('modalFillBtn').addEventListener('click', function() {
    let arcLink = document.getElementById('arcLink').value.trim();

    if (!arcLink) {
        showError('Bitte gib eine gültige URL ein.');
        return;
    }

    const eventId = arcLink.split('/').pop();
    const apiLink = `https://animalrightscalendar.org/api/events/${eventId}`;

    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const proxiedApiLink = proxyUrl + encodeURIComponent(apiLink);

    resetFields();

    document.getElementById('modalFillBtn').disabled = true;

    fetch(proxiedApiLink)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fehlerstatus: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const parsedData = JSON.parse(data.contents);

            if (parsedData && parsedData.title && parsedData.start && parsedData.end && parsedData.location) {
                let title = parsedData.title || '';
                title = title.replace(/^[^:]*:\s*/, '').trim();
                title = title.split(',')[0].trim();
                document.getElementById('chapter').value = title;

                const titleWords = title.split(/[\s-]+/);
                document.getElementById('twoLines').checked = titleWords.length === 2;

                const startDate = new Date(parsedData.start);
                document.getElementById('date').value = startDate.toLocaleDateString('de-DE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                const endTime = new Date(parsedData.end);
                document.getElementById('time').value = `${startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`;

                let location = parsedData.location || '';
                location = location.split(',')[0];
                document.getElementById('place').value = location;
            } else {
                throw new Error('Ungültige oder unvollständige Daten von der API erhalten.');
            }

            document.getElementById('arcLink').value = '';
            document.getElementById('arcModal').style.display = 'none';
        })
        .catch(error => {
            if (error.message === 'Failed to fetch' || error.message.includes('NetworkError') || error.message.includes('CORS')) {
                showError('CORS-Fehler: Bitte aktiviere temporären Zugriff unter <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">cors-anywhere.herokuapp.com</a>.');
            } else {
                showError('Fehler beim Abrufen der API. Bitte überprüfe den Link.');
            }
            resetFields();
            console.error('Fehler beim Abrufen der API:', error);
        })
        .finally(() => {
            document.getElementById('modalFillBtn').disabled = false;
        });
});

const arcModal = document.getElementById('arcModal');

document.getElementsByClassName('close')[0].addEventListener('click', () => {
    arcModal.style.display = 'none';
});

document.getElementById('arcBtn').addEventListener('click', () => {
    document.getElementById('arcModal').style.display = 'block';
    document.getElementById('arcLink').focus();
});

window.addEventListener('click', event => {
    if (event.target === arcModal) {
        arcModal.style.display = 'none';
    }
});

document.querySelector('.close-error').addEventListener('click', function() {
    document.getElementById('errorMessage').style.display = 'none';
});

function generateImage(onComplete) {
    const maxFontSize = 200;

    loadFonts(maxFontSize).then(() => {
        const chapterInput = document.getElementById('chapter').value;
        const twoLinesInput = document.getElementById('twoLines').checked;
        const dateInput = document.getElementById('date').value;
        const timeInput = document.getElementById('time').value;
        const placeInput = document.getElementById('place').value;

        const chapter = (chapterInput ? chapterInput : defaultSettings.chapter).toUpperCase().trim();
        const twoLines = (twoLinesInput ? twoLinesInput : defaultSettings.twoLines);
        const date = (dateInput ? dateInput : defaultSettings.date).toUpperCase().trim();
        const time = (timeInput ? timeInput : defaultSettings.time).toUpperCase().trim();
        const place = (placeInput ? placeInput : defaultSettings.place).toUpperCase().trim();

        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = 'https://i.imgur.com/noMa6R2.jpeg';

        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;

            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Chapter
            context.textBaseline = 'top';
            context.textAlign = 'left';
            context.fillStyle = 'rgb(230, 0, 0)';
            const chapterPadding = 235;
            let maxTextWidth = canvas.width - 2 * chapterPadding;
            let font = "SourceSansProSemiBold";
            if (twoLines) {
                const chapterParts = splitTextInTwoLines(chapter);
                drawTwoLineChapter(context, chapterParts, chapterPadding, maxTextWidth, maxFontSize, font);
            } else {
                const chapterFontSize = adjustFontSize(context, chapter, maxTextWidth, maxFontSize, font);
                drawTextWithSpacing(context, chapter, chapterPadding, 885, maxTextWidth, chapterFontSize, font);
            }

            // Date
            context.fillStyle = 'white';
            font = "SourceSansPro";
            const datePadding = 405;
            maxTextWidth = canvas.width - 2 * datePadding;
            const dateAdjustment = adjustFontSizeWithShift(context, date, maxTextWidth, maxFontSize - 80, font);
            const dateYPosition = 1220 + dateAdjustment.yOffset;
            drawTextWithSpacing(context, date, datePadding, dateYPosition, maxTextWidth, dateAdjustment.fontSize, font);

            // Time
            const timePadding = 320;
            maxTextWidth = canvas.width - 2 * timePadding;
            const timeAdjustment = adjustFontSizeWithShift(context, time, maxTextWidth, maxFontSize - 80, font);
            const timeYPosition = 1315 + timeAdjustment.yOffset;
            drawTextWithSpacing(context, time, timePadding, timeYPosition, maxTextWidth, timeAdjustment.fontSize, font);

            // Place
            context.textAlign = 'left';
            font = "SourceSansProSemiBold";
            const placePadding = 235;
            maxTextWidth = canvas.width - 2 * placePadding;
            const placeAdjustment = adjustFontSizeWithShift(context, place, maxTextWidth, maxFontSize - 40, font);
            const placeYPosition = 1405 + placeAdjustment.yOffset;
            drawTextWithSpacing(context, place, placePadding, placeYPosition, maxTextWidth, placeAdjustment.fontSize, font);

            onComplete(canvas);
        };
    }).catch((err) => {
        console.error('Fehler beim Laden der Schriftart:', err);
    });
}

function loadFonts(maxFontSize) {
    const fonts = [
        `SourceSansPro`,
        `SourceSansProSemiBold`
    ];
    return Promise.all(fonts.map(font => document.fonts.load(`${maxFontSize}px ${font}`)));
}

function splitTextInTwoLines(text) {
    const words = text.split(/[\s-]+/);
    const middle = Math.ceil(words.length / 2);
    return [words.slice(0, middle).join(' '), words.slice(middle).join(' ')];
}

function drawTwoLineChapter(context, chapterParts, chapterPadding, maxTextWidth, maxFontSize, font) {
    const widthLine1 = context.measureText(chapterParts[0]).width;
    const widthLine2 = context.measureText(chapterParts[1]).width;

    const longerPart = widthLine1 > widthLine2 ? chapterParts[0] : chapterParts[1];

    const finalFontSize = adjustFontSize(context, longerPart, maxTextWidth, maxFontSize - 50, font);
    context.font = `${finalFontSize}px "${font}"`;

    const targetWidth = maxTextWidth;

    const metricsLine1 = context.measureText(chapterParts[0]);
    const line1Height = metricsLine1.actualBoundingBoxAscent + metricsLine1.actualBoundingBoxDescent;

    drawTextWithSpacing(context, chapterParts[0], chapterPadding, 885, targetWidth, finalFontSize, font);
    drawTextWithSpacing(context, chapterParts[1], chapterPadding, 885 + line1Height + 20, targetWidth, finalFontSize, font);
}

function adjustFontSize(context, text, maxWidth, maxFontSize, font) {
    let fontSize = maxFontSize;
    context.font = `${fontSize}px "${font}"`;
    let textWidth = context.measureText(text).width;

    while (textWidth > maxWidth) {
        fontSize--;
        context.font = `${fontSize}px "${font}"`;
        textWidth = context.measureText(text).width;
    }

    return fontSize;
}

function adjustFontSizeWithShift(context, text, maxWidth, maxFontSize, font) {
    let fontSize = maxFontSize;
    let yOffset = 0;
    let reductionCount = 0;
    context.font = `${fontSize}px "${font}"`;
    let textWidth = context.measureText(text).width;

    while (textWidth > maxWidth) {
        fontSize--;
        reductionCount++;
        if (reductionCount % 3 === 0) {
            yOffset++;
        }
        context.font = `${fontSize}px "${font}"`;
        textWidth = context.measureText(text).width;
    }

    return { fontSize, yOffset };
}

function drawTextWithSpacing(context, text, x, y, maxWidth, fontSize, font) {
    context.font = `${fontSize}px "${font}"`;

    let charWidths = [];
    let totalCharsWidth = 0;

    for (let i = 0; i < text.length; i++) {
        const charWidth = context.measureText(text[i]).width;
        charWidths.push(charWidth);
        totalCharsWidth += charWidth;
    }

    let spacing = 0;
    if (text.length > 1) {
        spacing = (maxWidth - totalCharsWidth) / (text.length - 1);
    }

    let currentX = x + 5; // +5px because the template is not centered
    for (let i = 0; i < text.length; i++) {
        context.fillText(text[i], currentX, y);
        currentX += charWidths[i] + spacing;
    }
}

function convertMonthToNumber(dateString) {
    const months = {
        "januar": "01.",
        "februar": "02.",
        "märz": "03.",
        "april": "04.",
        "mai": "05.",
        "juni": "06.",
        "juli": "07.",
        "august": "08.",
        "september": "09.",
        "oktober": "10.",
        "november": "11.",
        "dezember": "12."
    };

    for (const [month, number] of Object.entries(months)) {
        if (dateString.includes(month)) {
            dateString = dateString.replace(month, number);
        }
    }

    return dateString;
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    errorText.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function resetFields() {
    document.getElementById('chapter').value = '';
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
    document.getElementById('place').value = '';
    document.getElementById('twoLines').checked = false;
}
