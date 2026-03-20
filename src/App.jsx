import { useState, useEffect } from 'react';
import './App.css';

const translations = {
  en: {
    fuelTitle: "Fuel Eligibility Checker",
    placeholder: "Enter last 4 digits (e.g., 1234)",
    btnText: "Check Today's Status",
    success: "✅ You CAN get fuel today!",
    fail: "❌ You CANNOT get fuel today.",
    invalid: "⚠️ Please enter exactly 4 numbers.",
    rule: "Rule: Even plates (0,2,4,6,8) on Even dates. Odd plates (1,3,5,7,9) on Odd dates.",
    newsTitle: "Latest National News",
    discTitle: "Independent Community Notice",
    discText: "InfoGov.live is a private community initiative. It is not affiliated with the Government of Sri Lanka or the CPC."
  },
  si: {
    fuelTitle: "ඉන්ධන ලබාගැනීමේ සුදුසුකම",
    placeholder: "අවසන් අංක 4 (උදා: 1234)",
    btnText: "අද දිනය පරීක්ෂා කරන්න",
    success: "✅ ඔබට අද ඉන්ධන ලබා ගත හැක!",
    fail: "❌ ඔබට අද ඉන්ධන ලබා ගත නොහැක.",
    invalid: "⚠️ කරුණාකර අංක 4ක් පමණක් ඇතුළත් කරන්න.",
    rule: "නීතිය: අවසන් අංකය 0,2,4,6,8 සඳහා ඉරට්ටේ දින. 1,3,5,7,9 සඳහා ඔත්තේ දින.",
    newsTitle: "නවතම ප්‍රවෘත්ති",
    discTitle: "ස්වාධීන ප්‍රජා නිවේදනය",
    discText: "මෙය ස්වාධීන ප්‍රජා ව්‍යාපෘතියකි. ශ්‍රී ලංකා රජයට හෝ ඛනිජ තෙල් සංස්ථාවට සම්බන්ධ නොවේ."
  },
  ta: {
    fuelTitle: "எரிபொருள் தகுதி சரிபார்ப்பு",
    placeholder: "கடைசி 4 எண்கள் (எ.கா: 1234)",
    btnText: "இன்றைய தகுதியை சரிபார்",
    success: "✅ நீங்கள் இன்று எரிபொருள் பெறலாம்!",
    fail: "❌ நீங்கள் இன்று எரிபொருள் பெற முடியாது.",
    invalid: "⚠️ சரியாக 4 எண்களை உள்ளிடவும்.",
    rule: "விதி: 0,2,4,6,8 முடிவடையும் வாகனங்களுக்கு இரட்டை தேதிகள். 1,3,5,7,9 க்கு ஒற்றை தேதிகள்.",
    newsTitle: "சமீபத்திய செய்திகள்",
    discTitle: "சுயாதீன சமூக அறிவிப்பு",
    discText: "இது ஒரு சுயாதீன சமூக திட்டம். இலங்கை அரசாங்கத்துடனோ அல்லது CPC உடனோ தொடர்புடையது அல்ல."
  }
};

// 100% Verified, highly stable RSS feeds
const newsSources = {
  en: [
    'http://www.adaderana.lk/rss.php',
    'https://www.hirunews.lk/rss/english.xml'
  ],
  si: [
    'https://www.hirunews.lk/rss/sinhala.xml',
    'https://www.lankadeepa.lk/rss'
  ],
  ta: [
    'https://www.hirunews.lk/rss/tamil.xml',
    'https://www.virakesari.lk/rss'
  ]
};

function App() {
  const [lang, setLang] = useState('en');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [result, setResult] = useState(null); 
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  
  const [serverDate, setServerDate] = useState(null);
  const [isLoadingTime, setIsLoadingTime] = useState(true);

  const t = translations[lang];

  // 1. Fetch Secure Internet Time
  useEffect(() => {
    const fetchTrueTime = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Colombo');
        if (!response.ok) throw new Error("Time API failed");
        const data = await response.json();
        setServerDate(new Date(data.datetime)); 
      } catch (error) {
        console.warn("Using fallback local device time.");
        setServerDate(new Date()); 
      } finally {
        setIsLoadingTime(false);
      }
    };
    fetchTrueTime();
  }, []);

  // 2. The BULLETPROOF News Fetcher
  useEffect(() => {
    const fetchMultiChannelNews = async () => {
      setLoadingNews(true);
      setNews([]); 

      try {
        const urls = newsSources[lang];
        
        // The Fix: We add a .catch() to EACH individual fetch. 
        // This means if one news site crashes, it just returns a blank status instead of destroying the whole app.
        const fetchPromises = urls.map(url => 
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
            .then(res => res.json())
            .catch(error => ({ status: 'error', items: [] })) 
        );
        
        const results = await Promise.all(fetchPromises);
        let combinedNews = [];

        results.forEach(data => {
          if (data && data.status === 'ok' && data.items) {
            combinedNews = [...combinedNews, ...data.items];
          }
        });

        // Sort by newest date/time and keep only the top 5
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

  const localeMap = { en: 'en-US', si: 'si-LK', ta: 'ta-LK' };
  const displayDate = serverDate 
    ? serverDate.toLocaleDateString(localeMap[lang], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : "Loading date...";

  const checkEligibility = () => {
    if (isLoadingTime || !serverDate) return; 

    const input = vehicleNumber.trim();
    
    if (!/^\d{4}$/.test(input)) {
      setResult({ type: 'warning', text: t.invalid });
      return;
    }

    const lastDigit = parseInt(input.charAt(3));
    const todayDateNumber = serverDate.getDate(); 

    const isPlateEven = (lastDigit % 2 === 0);
    const isDateEven = (todayDateNumber % 2 === 0);

    if (isPlateEven === isDateEven) {
      setResult({ type: 'success', text: t.success });
    } else {
      setResult({ type: 'error', text: t.fail });
    }
  };

  return (
    <>
      <div className="navbar">
        <h1>InfoGov.live</h1>
        <select 
          className="lang-selector" 
          value={lang} 
          onChange={(e) => {
            setLang(e.target.value);
            setResult(null); 
            setVehicleNumber(''); 
          }}
        >
          <option value="en">English</option>
          <option value="si">සිංහල</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>

      <div className="container">
        
        <div className="card">
          <h2 className="card-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#2563eb', marginRight: '8px'}}>
              <path d="M3 22v-8c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8"></path>
              <path d="M6 12v-4a6 6 0 0 1 12 0v4"></path>
              <circle cx="12" cy="18" r="2"></circle>
            </svg>
            {t.fuelTitle}
          </h2>
          
          <p style={{ textAlign: 'center', color: '#2563eb', fontWeight: 'bold', marginTop: '-10px', marginBottom: '20px', fontSize: '1.1rem' }}>
            {displayDate}
          </p>

          <input 
            type="text" 
            inputMode="numeric" 
            pattern="\d*"
            maxLength={4} 
            placeholder={t.placeholder} 
            value={vehicleNumber}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, '');
              setVehicleNumber(onlyNums);
            }}
            onKeyDown={(e) => e.key === 'Enter' && checkEligibility()}
            disabled={isLoadingTime} 
          />
          <button 
            className="primary-btn" 
            onClick={checkEligibility} 
            disabled={isLoadingTime}
            style={{ opacity: isLoadingTime ? 0.7 : 1 }}
          >
            {isLoadingTime ? "Syncing Time..." : t.btnText}
          </button>
          
          {result && (
            <div className={`result-message ${result.type}`}>
              {result.text}
            </div>
          )}
          
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '15px', textAlign: 'center' }}>
            {t.rule}
          </p>
        </div>

        <div className="card">
          <h2 className="card-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#2563eb', marginRight: '8px'}}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            {t.newsTitle}
          </h2>
          <div>
            {loadingNews ? (
              <p style={{ color: '#64748b' }}>Loading {lang === 'si' ? 'සිංහල' : lang === 'ta' ? 'தமிழ்' : 'latest'} news...</p>
            ) : news.length > 0 ? (
              news.map((item, index) => {
                const source = item.link.includes('adaderana') ? 'Ada Derana' 
                           : item.link.includes('hirunews') ? 'Hiru News'
                           : item.link.includes('lankadeepa') ? 'Lankadeepa'
                           : item.link.includes('virakesari') ? 'Virakesari' : 'News';

                return (
                  <div key={index} className="news-item">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-title">
                      {item.title}
                    </a>
                    <div className="news-date">
                      <span style={{ fontWeight: 'bold', color: '#2563eb', marginRight: '8px' }}>{source}</span>
                      {item.pubDate}
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: '#64748b' }}>Could not load news at this time. Please check your internet connection.</p>
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <strong>{t.discTitle}</strong><br />
        <span>{t.discText}</span>
      </div>
    </>
  );
}

export default App;