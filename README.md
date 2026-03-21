# InfoGov.live — Sri Lanka Fuel Eligibility Checker

[![Live Site](https://img.shields.io/badge/Live%20Site-infogov.live-2dd4bf?style=for-the-badge)](https://infogov.live)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Cloudflare](https://img.shields.io/badge/Hosted%20on-Cloudflare-F38020?style=for-the-badge&logo=cloudflare)](https://cloudflare.com)

A fast, mobile-friendly web app that helps Sri Lankan vehicle owners check their fuel eligibility based on the odd/even number plate rule. Available in **Sinhala**, **Tamil**, and **English** with dark/light mode support.

---

## 🌐 Live Site

**[https://infogov.live](https://infogov.live)**

---

## ✨ Features

- ✅ **Fuel Eligibility Checker** — Enter your last 4 plate digits to instantly check if you can get fuel today
- 🕐 **Accurate Date Sync** — Uses the WorldTimeAPI to get the correct Sri Lanka time, not device time
- 📰 **Live News Feed** — Latest national news from Ada Derana & BBC
- 🌙 **Dark / Light Mode** — Toggle between themes
- 🌍 **Trilingual** — Sinhala (default), Tamil, and English
- 📱 **Fully Responsive** — Works on all screen sizes from small phones to wide desktops
- ⚡ **Fast** — Hosted on Cloudflare's global CDN

---

## 🔢 How the Fuel Rule Works

| Last digit of plate | Eligible days |
|---|---|
| 0, 2, 4, 6, 8 (Even) | Even dates (2, 4, 6...) |
| 1, 3, 5, 7, 9 (Odd) | Odd dates (1, 3, 5...) |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| CSS Variables | Theming (dark/light mode) |
| WorldTimeAPI | Accurate Sri Lanka time |
| RSS2JSON API | News feed parsing |
| Cloudflare Workers | Hosting & CDN |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Kaveeshdil/info_fuel-Live-.git

# Navigate into the project
cd info_fuel-Live-

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

---

## 📁 Project Structure

```
infogov-fuel/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx        # Main app component
│   ├── App.css        # All styles with theme variables
│   ├── main.jsx       # React entry point
│   └── index.css      # Global reset
├── index.html         # HTML entry with SEO meta tags
├── wrangler.toml      # Cloudflare Workers config
├── vite.config.js     # Vite configuration
└── package.json
```

---

## 🔄 Deployment

This project is connected to **Cloudflare Workers** via GitHub. Every push to the `master` branch automatically triggers a build and deployment.

```bash
# Deploy by simply pushing to master
git add .
git commit -m "Your changes"
git push origin master
```

---

## 📰 News Sources

| Language | Sources |
|---|---|
| English | Ada Derana, BBC World |
| Sinhala | Ada Derana (English fallback — Sinhala feed coming soon) |
| Tamil | Ada Derana (English fallback — Tamil feed coming soon) |

---

## ⚠️ Disclaimer

InfoGov.live is a **private community initiative**. It is not affiliated with the Government of Sri Lanka or the Ceylon Petroleum Corporation (CPC). Always verify fuel availability with your local station.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! If you know of reliable Sinhala or Tamil RSS feeds, please open an issue or pull request.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/sinhala-news`)
3. Commit your changes (`git commit -m "Add Sinhala news feed"`)
4. Push to the branch (`git push origin feature/sinhala-news`)
5. Open a Pull Request

---

<p align="center">Made with ❤️ for Sri Lanka</p>