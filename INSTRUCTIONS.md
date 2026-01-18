# AI Diagnostic Assessment Tool - Instructions

## Quick Start

1. **Upload the file** `ai-diagnostic-tool.html` to your website, or open it directly in a browser to test
2. **Update your booking link** (see Customisation section below)
3. Share the link with your audience

---

## How to Access Submitted Responses

### Method 1: Admin Panel (Built-in)
- Click the **"View Responses"** button in the bottom-right corner of the page
- This shows all responses saved in the browser's local storage
- Click **"Export All as CSV"** to download a spreadsheet with all responses

### Method 2: Browser Storage (Advanced)
1. Open the page in Chrome or Firefox
2. Press `F12` to open Developer Tools
3. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Look for **Local Storage** → your website URL
5. Find the key `aiDiagnosticResponses`

### Important Notes on Data Storage
- Responses are stored **locally in each visitor's browser**
- The admin panel shows responses from the **current browser only**
- For production use, you may want to connect this to a backend service or use a form service

### Recommended: Connect to a Form Service
For reliable data collection, consider integrating with:
- **Typeform** or **Tally** (embed the tool, sync responses)
- **Zapier** (trigger on form submission)
- **GoHighLevel** (use the CSV export to import contacts)

---

## How to Update the Calendar Booking Link

1. Open `ai-diagnostic-tool.html` in a text editor
2. Find this line near the top of the `<script>` section (around line 580):
   ```javascript
   const CONFIG = {
       bookingLink: 'YOUR_BOOKING_LINK_HERE',
   };
   ```
3. Replace `YOUR_BOOKING_LINK_HERE` with your actual booking link, for example:
   ```javascript
   const CONFIG = {
       bookingLink: 'https://calendly.com/elainegold/15min',
   };
   ```
4. Save the file and re-upload to your website

---

## How to Customise Text

### Changing Question Text
1. Search for `question-text` in the HTML file
2. Find the question you want to change
3. Edit the text between the `<h2 class="question-text">` tags

### Changing Option Labels
1. Find the relevant `options-list` section
2. Edit the text within `<span class="option-text">` tags

### Changing Report Content

**Situation descriptions** (Section 1):
- Search for `situationTexts` in the JavaScript
- Edit the text for each response option

**Next step recommendations** (Section 3):
- Search for `nextStepTexts` in the JavaScript
- Edit the text for each response option

**Weekly action items** (Section 4):
- Search for `tryThisWeekTexts` in the JavaScript
- Edit the text for each role type

### Changing Colours
Find the `:root` section at the top of the `<style>` block:
```css
:root {
    --primary: #dd722a;        /* Main orange */
    --background: #fefaec;     /* Cream background */
    --teal: #319795;           /* Accent teal */
}
```

---

## Hosting Options

### Option 1: Standalone Page
Upload `ai-diagnostic-tool.html` directly to your web server or hosting platform.

### Option 2: Embed in Existing Website
Add an iframe to your page:
```html
<iframe
    src="ai-diagnostic-tool.html"
    width="100%"
    height="800"
    frameborder="0"
    style="max-width: 720px; margin: 0 auto; display: block;">
</iframe>
```

### Option 3: Website Builders
- **Squarespace**: Use a Code Block to embed
- **WordPress**: Upload to Media Library or use an HTML block
- **Wix**: Use the HTML iFrame embed feature
- **Webflow**: Upload as a static page or embed

---

## Features Summary

| Feature | Status |
|---------|--------|
| Mobile responsive | Yes |
| Progress indicator | Yes |
| Back navigation | Yes |
| Data validation | Yes |
| Personalised report | Yes |
| PDF download | Yes |
| Local storage | Yes |
| CSV export | Yes |
| Email capture | Yes (stored locally) |

---

## Troubleshooting

### PDF Download Not Working
- The PDF library loads from a CDN; check your internet connection
- Some ad blockers may interfere; try disabling them temporarily

### Responses Not Saving
- Check that JavaScript is enabled in the browser
- Local storage may be disabled in private/incognito mode

### Styling Looks Wrong
- Clear your browser cache
- Check that no other CSS on your site is conflicting

---

## Support

For questions or customisation help:
- Email: elaine@elainegold.co.uk
- Website: www.elainegold.co.uk

---

*Tool created for Elaine Gold Consulting*
