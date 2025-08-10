// script.js - Handles conversion and animation


// --- Handwriting Styles ---
const HANDWRITING_STYLES = {
    human1: {
        font: "28px 'Segoe Script', 'Dancing Script', 'Pacifico', 'Bradley Hand', cursive",
        lineHeight: 40,
        jitter: 2.7,
        rotate: 6.5,
        sizeJitter: 1.13
    },
    human2: {
        font: "27px 'Dancing Script', 'Pacifico', 'Segoe Script', 'Bradley Hand', cursive",
        lineHeight: 38,
        jitter: 2.9,
        rotate: 8.5,
        sizeJitter: 1.15
    },
    human3: {
        font: "26px 'Pacifico', 'Dancing Script', 'Segoe Script', 'Bradley Hand', cursive",
        lineHeight: 36,
        jitter: 3.5,
        rotate: 10.5,
        sizeJitter: 1.18
    },
    human4: {
        font: "27px 'Great Vibes', 'Dancing Script', 'Segoe Script', cursive",
        lineHeight: 39,
        jitter: 3.1,
        rotate: 7.5,
        sizeJitter: 1.14
    },
    human5: {
        font: "25px 'Satisfy', 'Pacifico', 'Bradley Hand', cursive",
        lineHeight: 37,
        jitter: 2.5,
        rotate: 9.5,
        sizeJitter: 1.16
    },
    human6: {
        font: "28px 'Caveat', 'Dancing Script', 'Segoe Script', cursive",
        lineHeight: 41,
        jitter: 3.7,
        rotate: 11.5,
        sizeJitter: 1.19
    }
};
const PADDING = 32;
const CANVAS_BG = "#f5f3ea";

const textarea = document.getElementById('typedText');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const styleSelect = document.getElementById('styleSelect');
const colorSelect = document.getElementById('colorSelect');
const canvas = document.getElementById('handwrittenCanvas');
const ctx = canvas.getContext('2d');

// Animate drawing each character like handwriting (with jitter, rotation, and size randomness)
function animateHandwriting(text, x, y, style, inkColor, callback) {
    ctx.save();
    ctx.font = style.font;
    ctx.fillStyle = inkColor;
    let i = 0;
    let currX = x;
    function drawNextChar() {
        if (i < text.length) {
            const char = text[i];
            // Randomize position, rotation, and size for human effect
            const jitterX = (Math.random() - 0.5) * style.jitter * 2;
            const jitterY = (Math.random() - 0.5) * style.jitter * 2;
            const angle = (Math.random() - 0.5) * style.rotate * Math.PI / 180;
            const sizeFactor = 1 + (Math.random() - 0.5) * (style.sizeJitter - 1);
            ctx.save();
            ctx.translate(currX + jitterX, y + jitterY);
            ctx.rotate(angle);
            ctx.font = style.font.replace(/\d+px/, match => Math.round(parseInt(match) * sizeFactor) + 'px');
            ctx.fillText(char, 0, 0);
            ctx.restore();
            currX += ctx.measureText(char).width * sizeFactor;
            i++;
            setTimeout(drawNextChar, 30);
        } else {
            ctx.restore();
            if (callback) callback();
        }
    }
    drawNextChar();
}


// Split text into lines that fit the canvas width
function wrapText(text, maxWidth, style) {
    const words = text.split(' ');
    let lines = [];
    let line = '';
    ctx.font = style.font;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    return lines;
}

// Main conversion function
function convertToHandwritten() {
    const text = textarea.value.trim();
    const style = HANDWRITING_STYLES[styleSelect.value] || HANDWRITING_STYLES.human1;
    const inkColor = colorSelect.value || "#3b2f1c";
    if (!text) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }
    // Set canvas size to A4 at 96dpi (1 inch = 96px): 29.7cm x 21cm = 11.7in x 8.3in
    const A4_WIDTH_PX = Math.round(8.27 * 96); // 793px
    const A4_HEIGHT_PX = Math.round(11.7 * 96); // 1123px
    canvas.width = A4_WIDTH_PX;
    canvas.height = A4_HEIGHT_PX;
    const maxWidth = canvas.width - PADDING * 2;
    const lines = wrapText(text, maxWidth, style);

    // Draw provided ruled page image as background, fallback to plain if missing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bgImg = new window.Image();
    let backgroundDrawn = false;
    bgImg.onload = function() {
        if (bgImg.naturalWidth === 0 || bgImg.naturalHeight === 0) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        }
        backgroundDrawn = true;
        drawHandwritingLines();
    };
    bgImg.onerror = function() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        backgroundDrawn = true;
        drawHandwritingLines();
    };
    bgImg.src = 'sample-page.png';
    // If image is cached and already loaded
    if (bgImg.complete && bgImg.naturalWidth !== 0) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        backgroundDrawn = true;
        drawHandwritingLines();
    }
    function drawHandwritingLines() {
        // Draw blue ruled lines across the page
        ctx.save();
        ctx.strokeStyle = '#b3c6e7';
        ctx.lineWidth = 1.2;
        const lineGap = style.lineHeight;
        for (let y = PADDING + lineGap; y < canvas.height - PADDING; y += lineGap) {
            ctx.beginPath();
            ctx.moveTo(PADDING, y);
            ctx.lineTo(canvas.width - PADDING, y);
            ctx.stroke();
        }
        ctx.restore();
        // Draw handwriting
        let lineIndex = 0;
        function drawLine() {
            if (lineIndex < lines.length) {
                let x = PADDING;
                let y = PADDING + style.lineHeight * (lineIndex + 1) - 10;
                animateHandwriting(lines[lineIndex], x, y, style, inkColor, () => {
                    lineIndex++;
                    drawLine();
                });
            } else {
                // Draw watermark after all lines
                ctx.save();
                ctx.globalAlpha = 0.22;
                ctx.font = "bold 20px 'Segoe UI', Arial, sans-serif";
                ctx.fillStyle = "#bfa76a";
                ctx.textAlign = "right";
                ctx.fillText("typed2handwritten.com", canvas.width - PADDING, canvas.height - PADDING/2);
                ctx.restore();
            }
        }
        drawLine();
    }
}

// Download canvas as image
function downloadHandwritten() {
    const link = document.createElement('a');
    link.download = 'handwritten.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Responsive: redraw on resize if text exists
window.addEventListener('resize', () => {
    if (textarea.value.trim()) {
        convertToHandwritten();
    }
});

convertBtn.addEventListener('click', convertToHandwritten);
downloadBtn.addEventListener('click', downloadHandwritten);

// Optional: Enter key + Ctrl triggers conversion
textarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        convertToHandwritten();
    }
});
