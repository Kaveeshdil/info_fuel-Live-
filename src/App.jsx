import { useState, useEffect } from 'react';
import './App.css';

const translations = {
  en: {
    fuelTitle: "Fuel Eligibility Checker",
    placeholder: "Enter last 4 digits (e.g., 1234)",
    btnText: "Check Today's Status",
    success: "You CAN get fuel today!",
    fail: "You CANNOT get fuel today.",
    invalid: "Please enter exactly 4 numbers.",
    rule: "Even plates (0,2,4,6,8) on Even dates. Odd plates (1,3,5,7,9) on Odd dates.",
    newsTitle: "Latest National News",
    discTitle: "Independent Community Notice",
    discText: "InfoGov.live is a private community initiative. It is not affiliated with the Government of Sri Lanka or the CPC."
  },
  si: {
    fuelTitle: "ඉන්ධන ලබාගැනීමේ සුදුසුකම",
    placeholder: "අවසන් අංක 4 (උදා: 1234)",
    btnText: "අද දිනය පරීක්ෂා කරන්න",
    success: "ඔබට අද ඉන්ධන ලබා ගත හැක!",
    fail: "ඔබට අද ඉන්ධන ලබා ගත නොහැක.",
    invalid: "කරුණාකර අංක 4ක් පමණක් ඇතුළත් කරන්න.",
    rule: "අවසන් අංකය 0,2,4,6,8 සඳහා ඉරට්ටේ දින. 1,3,5,7,9 සඳහා ඔත්තේ දින.",
    newsTitle: "නවතම ප්‍රවෘත්ති",
    discTitle: "ස්වාධීන ප්‍රජා නිවේදනය",
    discText: "මෙය ස්වාධීන ප්‍රජා ව්‍යාපෘතියකි. ශ්‍රී ලංකා රජයට හෝ ඛනිජ තෙල් සංස්ථාවට සම්බන්ධ නොවේ."
  },
  ta: {
    fuelTitle: "எரிபொருள் தகுதி சரிபார்ப்பு",
    placeholder: "கடைசி 4 எண்கள் (எ.கா: 1234)",
    btnText: "இன்றைய தகுதியை சரிபார்",
    success: "நீங்கள் இன்று எரிபொருள் பெறலாம்!",
    fail: "நீங்கள் இன்று எரிபொருள் பெற முடியாது.",
    invalid: "சரியாக 4 எண்களை உள்ளிடவும்.",
    rule: "0,2,4,6,8 முடிவடையும் வாகனங்களுக்கு இரட்டை தேதிகள். 1,3,5,7,9 க்கு ஒற்றை தேதிகள்.",
    newsTitle: "சமீபத்திய செய்திகள்",
    discTitle: "சுயாதீன சமூக அறிவிப்பு",
    discText: "இது ஒரு சுயாதீன சமூக திட்டம். இலங்கை அரசாங்கத்துடனோ அல்லது CPC உடனோ தொடர்புடையது அல்ல."
  }
};

const newsSources = {
  en: [
    'https://www.adaderana.lk/rss.php',
    'https://feeds.bbci.co.uk/news/world/rss.xml'
  ],
  si: [
    'https://www.adaderana.lk/rss.php',
    'https://feeds.bbci.co.uk/news/world/rss.xml'
  ],
  ta: [
    'https://www.adaderana.lk/rss.php',
    'https://feeds.bbci.co.uk/news/world/rss.xml'
  ]
};

const getSourceName = (link = '', feedUrl = '') => {
  if (link.includes('adaderana') || feedUrl.includes('adaderana')) return 'Ada Derana';
  if (link.includes('bbc.co.uk')  || feedUrl.includes('bbc.co.uk'))  return 'BBC News';
  if (link.includes('hirunews')   || feedUrl.includes('hirunews'))   return 'Hiru News';
  if (link.includes('lankadeepa') || feedUrl.includes('lankadeepa')) return 'Lankadeepa';
  if (link.includes('virakesari') || feedUrl.includes('virakesari')) return 'Virakesari';
  return 'News';
};

const FuelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22v-8c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8"/>
    <path d="M6 12v-4a6 6 0 0 1 12 0v4"/>
    <circle cx="12" cy="18" r="2"/>
  </svg>
);

const NewsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function App() {
  const [lang, setLang]                   = useState('si');
  const [dark, setDark]                   = useState(true);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [result, setResult]               = useState(null);
  const [news, setNews]                   = useState([]);
  const [loadingNews, setLoadingNews]     = useState(true);
  const [feedErrors, setFeedErrors]       = useState([]);
  const [serverDate, setServerDate]       = useState(null);
  const [isLoadingTime, setIsLoadingTime] = useState(true);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const fetchTrueTime = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Colombo');
        if (!response.ok) throw new Error("Time API failed");
        const data = await response.json();
        setServerDate(new Date(data.datetime));
      } catch {
        setServerDate(new Date());
      } finally {
        setIsLoadingTime(false);
      }
    };
    fetchTrueTime();
  }, []);

  useEffect(() => {
    const fetchMultiChannelNews = async () => {
      setLoadingNews(true);
      setNews([]);
      setFeedErrors([]);
      try {
        const urls = newsSources[lang];
        const fetchPromises = urls.map(url =>
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
            .then(res => res.json())
            .then(data => ({ ...data, _sourceUrl: url }))
            .catch(() => ({ status: 'error', items: [], _sourceUrl: url }))
        );
        const results = await Promise.all(fetchPromises);
        let combinedNews = [];
        const errors = [];
        results.forEach(data => {
          if (data?.status === 'ok' && data.items?.length > 0) {
            combinedNews = [...combinedNews, ...data.items.map(item => ({ ...item, _feedUrl: data._sourceUrl }))];
          } else {
            errors.push(data._sourceUrl);
          }
        });
        setFeedErrors(errors);
        combinedNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        setNews(combinedNews.slice(0, 5));
      } catch (error) {
        console.error("Critical error in news fetcher", error);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchMultiChannelNews();
  }, [lang]);

  const localeMap   = { en: 'en-US', si: 'si-LK', ta: 'ta-LK' };
  const displayDate = serverDate
    ? serverDate.toLocaleDateString(localeMap[lang], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Loading date...';

  const checkEligibility = () => {
    if (isLoadingTime || !serverDate) return;
    const input = vehicleNumber.trim();
    if (!/^\d{4}$/.test(input)) {
      setResult({ type: 'warning', text: t.invalid });
      return;
    }
    const lastDigit       = parseInt(input.charAt(3));
    const todayDateNumber = serverDate.getDate();
    const isPlateEven     = lastDigit % 2 === 0;
    const isDateEven      = todayDateNumber % 2 === 0;
    setResult(isPlateEven === isDateEven
      ? { type: 'success', text: t.success }
      : { type: 'error',   text: t.fail }
    );
  };

  return (
    <div className="app-root">

      {/* NAVBAR */}
      <nav className="navbar">
        <span className="brand">InfoGov.live</span>
        <div className="nav-right">
          <div className="lang-tabs">
            {[['en','EN'], ['si','සි'], ['ta','த']].map(([code, label]) => (
              <button
                key={code}
                className={`lang-tab ${lang === code ? 'active' : ''}`}
                onClick={() => { setLang(code); setResult(null); setVehicleNumber(''); }}
              >{label}</button>
            ))}
          </div>
          <button className="theme-toggle" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="container">

        {/* FUEL CARD */}
        <div className="card">
          <div className="card-header">
            <span className="card-icon"><FuelIcon /></span>
            <h2 className="card-title">{t.fuelTitle}</h2>
          </div>

          <p className="date-display">{displayDate}</p>

          <div className="input-group">
            <label className="input-label">LAST 4 DIGITS</label>
            <input
              className="digit-input"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={4}
              placeholder={t.placeholder}
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.replace(/[^0-9]/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && checkEligibility()}
              disabled={isLoadingTime}
            />
          </div>

          <button className="primary-btn" onClick={checkEligibility} disabled={isLoadingTime}>
            <span className="btn-inner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              {isLoadingTime ? 'Syncing Time...' : t.btnText}
            </span>
          </button>

          {result && (
            <div className={`result-badge ${result.type}`}>
              <span className="result-icon">
                {result.type === 'success' ? '✓' : result.type === 'error' ? '✗' : '⚠'}
              </span>
              {result.text}
            </div>
          )}

          <p className="rule-text">{t.rule}</p>
        </div>

        {/* NEWS CARD */}
        <div className="card">
          <div className="card-header">
            <span className="card-icon"><NewsIcon /></span>
            <h2 className="card-title">{t.newsTitle}</h2>
          </div>

          <div className="news-list">
            {loadingNews ? (
              <div className="news-loading">
                <span className="spinner" />
                <span>Loading news...</span>
              </div>
            ) : news.length > 0 ? (
              <>
                {feedErrors.length > 0 && feedErrors.length < newsSources[lang].length && (
                  <p className="feed-warning">⚠ Some sources unavailable. Showing partial results.</p>
                )}
                {news.map((item, index) => (
                  <div key={index} className="news-item">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-title">
                      {item.title}
                    </a>
                    <div className="news-meta">
                      <span className="news-source">{getSourceName(item.link, item._feedUrl || '')}</span>
                      <span className="news-date">{item.pubDate}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="news-empty">Could not load news. Please check your connection.</p>
            )}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <strong className="footer-title">{t.discTitle}</strong>
        <p className="footer-text">{t.discText}</p>
      </footer>

    </div>
  );
}

export default App;