# type2write

A modern, Apple-inspired web app that converts typed text into realistic, human-like handwriting on ruled paper. Built with HTML, CSS, and JavaScript. Responsive, minimal, and ready for Vercel deployment.

## Features
- **Handwriting Converter:** Instantly turn typed text into handwritten output on A4/ruled paper.
- **Multiple Handwriting Styles:** Choose from several human-like handwriting fonts.
- **Ink Color Options:** Black, blue, and red ink.
- **Download & Print:** Export your handwritten page as an image.
- **Watermark Option:** Subtle watermark for authenticity.
- **Apple-Inspired UI:** Clean, minimal, and modern design with powder blue and black accents.
- **Responsive:** Works beautifully on all devices.
- **Sign Up/Sign In:** Simple authentication UI (demo only).
- **Chatbot:** Integrated Chatbase chatbot for instant help.

## File Structure
```
writeapp/
├── index.html         # Main website page
├── style.css          # All site styles
├── script.js          # Handwriting rendering logic
├── signup.html        # Sign up page
├── signin.html        # Sign in page
├── sample-page.png    # (Optional) Ruled paper background
├── README.md          # This file
```

## How to Use
1. Open `index.html` in your browser to use the converter.
2. Type or paste your text, select handwriting style and ink, and click "Convert to Handwritten".
3. Download the output as an image for printing or sharing.
4. Use the Sign Up/Sign In pages for demo authentication (no backend).
5. Chatbot is available on the main page for instant help.

## Deployment (Vercel)
1. Push this folder to a GitHub/GitLab/Bitbucket repository.
2. Go to [vercel.com](https://vercel.com), sign in, and import your repo.
3. No build command is needed. Set the output/public directory to the root (or leave blank).
4. Click "Deploy". Your site will be live on a vercel.app URL.

## Customization
- To change handwriting styles, edit the `script.js` file.
- To update branding, edit `index.html` and `style.css`.
- To add more features, simply extend the HTML/CSS/JS files.

## License
This project is for educational and personal use. For commercial use, please contact the author.
