/**
 * NotDistract V5 — Main Application Logic
 * Philosophy: Search → Watch → Focus → Finish → Leave.
 */

(function () {
  'use strict';

  // ==========================================================================
  // CONFIGURATION & CONSTANTS
  // ==========================================================================
  const STORAGE_KEYS = {
    RECENT_SEARCHES: 'ytHistory',
    SESSIONS: 'notdistract_sessions',
    SETTINGS: 'notdistract_settings',
    ACTIVE_SESSION: 'notdistract_active_session'
  };

  const INVIDIOUS_INSTANCES = [
    'https://invidious.f5.si',
    'https://yewtu.be',
    'https://inv.nadeko.net',
    'https://invidious.private.coffee',
    'https://invidious.nerdvpn.de'
  ];

  const CIRCLE_CIRCUMFERENCE = 471.24; // 2 * PI * 75

  // ==========================================================================
  // APP STATE
  // ==========================================================================
  const state = {
    currentView: 'home',
    searchQuery: '',
    searchResults: [],
    currentVideo: null,
    pendingNavigation: null, // Callback if user leaves during active focus

    timer: {
      totalSeconds: 25 * 60,
      remainingSeconds: 25 * 60,
      isRunning: false,
      isPaused: false,
      intervalId: null,
      targetEndTime: null,
      startTime: null,
      presetMinutes: 25
    },

    settings: {
      apiKey: '',
      defaultDuration: 25,
      soundEnabled: true
    },

    deferredInstallPrompt: null
  };

  // ==========================================================================
  // DOM ELEMENTS
  // ==========================================================================
  const elements = {
    // Views
    homeView: document.getElementById('homeView'),
    resultsView: document.getElementById('resultsView'),
    focusView: document.getElementById('focusView'),

    // Header & Nav
    brandHomeLink: document.getElementById('brandHomeLink'),
    activeFocusPill: document.getElementById('activeFocusPill'),
    activeFocusPillText: document.getElementById('activeFocusPillText'),
    openHistoryBtn: document.getElementById('openHistoryBtn'),
    openSettingsBtn: document.getElementById('openSettingsBtn'),
    installPwaBtn: document.getElementById('installPwaBtn'),

    // Home / Search
    searchForm: document.getElementById('searchForm'),
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    searchSubmitBtn: document.getElementById('searchSubmitBtn'),
    recentSearchesBox: document.getElementById('recentSearchesBox'),
    recentTagsList: document.getElementById('recentTagsList'),
    clearRecentBtn: document.getElementById('clearRecentBtn'),

    // Results
    resultsQueryTitle: document.getElementById('resultsQueryTitle'),
    resultsCount: document.getElementById('resultsCount'),
    backToHomeBtn: document.getElementById('backToHomeBtn'),
    videosGrid: document.getElementById('videosGrid'),
    resultsLoading: document.getElementById('resultsLoading'),
    resultsEmpty: document.getElementById('resultsEmpty'),
    resultsError: document.getElementById('resultsError'),
    errorStateTitle: document.getElementById('errorStateTitle'),
    errorStateDesc: document.getElementById('errorStateDesc'),
    errorRetryBtn: document.getElementById('errorRetryBtn'),
    errorSettingsBtn: document.getElementById('errorSettingsBtn'),
    emptyStateSearchBtn: document.getElementById('emptyStateSearchBtn'),

    // Focus View
    leaveFocusBtn: document.getElementById('leaveFocusBtn'),
    focusStatusBadge: document.getElementById('focusStatusBadge'),
    focusStatusBadgeText: document.getElementById('focusStatusBadgeText'),
    focusPlayer: document.getElementById('focusPlayer'),
    focusVideoTitle: document.getElementById('focusVideoTitle'),
    focusChannelName: document.getElementById('focusChannelName'),
    sessionIntentionInput: document.getElementById('sessionIntentionInput'),
    finishSessionBtn: document.getElementById('finishSessionBtn'),

    // Timer Elements
    presetBtns: document.querySelectorAll('.preset-btn'),
    customPresetBtn: document.getElementById('customPresetBtn'),
    customDurationWrapper: document.getElementById('customDurationWrapper'),
    customMinutesInput: document.getElementById('customMinutesInput'),
    applyCustomMinBtn: document.getElementById('applyCustomMinBtn'),
    timerProgressCircle: document.getElementById('timerProgressCircle'),
    timerDigits: document.getElementById('timerDigits'),
    timerSubtext: document.getElementById('timerSubtext'),
    timerToggleBtn: document.getElementById('timerToggleBtn'),
    timerToggleIcon: document.getElementById('timerToggleIcon'),
    timerToggleLabel: document.getElementById('timerToggleLabel'),
    timerResetBtn: document.getElementById('timerResetBtn'),

    // Modals
    distractionModal: document.getElementById('distractionModal'),
    distractionVideoName: document.getElementById('distractionVideoName'),
    stayFocusedBtn: document.getElementById('stayFocusedBtn'),
    continueLeaveBtn: document.getElementById('continueLeaveBtn'),

    completedModal: document.getElementById('completedModal'),
    completedVideoName: document.getElementById('completedVideoName'),
    completedDurationText: document.getElementById('completedDurationText'),
    finishAndLeaveBtn: document.getElementById('finishAndLeaveBtn'),
    keepWatchingBtn: document.getElementById('keepWatchingBtn'),

    historyModal: document.getElementById('historyModal'),
    closeHistoryBtn: document.getElementById('closeHistoryBtn'),
    closeHistoryBottomBtn: document.getElementById('closeHistoryBottomBtn'),
    todaySessionsCount: document.getElementById('todaySessionsCount'),
    todayTotalFocusTime: document.getElementById('todayTotalFocusTime'),
    historyListContainer: document.getElementById('historyListContainer'),
    clearAllHistoryBtn: document.getElementById('clearAllHistoryBtn'),

    settingsModal: document.getElementById('settingsModal'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    settingsApiKeyInput: document.getElementById('settingsApiKeyInput'),
    settingsDefaultDuration: document.getElementById('settingsDefaultDuration'),
    settingsSoundToggle: document.getElementById('settingsSoundToggle'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn')
  };

  // ==========================================================================
  // STORAGE HELPERS
  // ==========================================================================
  const Storage = {
    getRecentSearches: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES)) || [];
      } catch (e) {
        return [];
      }
    },
    saveRecentSearch: function (query) {
      if (!query || typeof query !== 'string') return;
      let list = Storage.getRecentSearches();
      list = list.filter(item => item.toLowerCase() !== query.toLowerCase());
      list.unshift(query);
      list = list.slice(0, 8);
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(list));
    },
    removeRecentSearch: function (query) {
      let list = Storage.getRecentSearches();
      list = list.filter(item => item !== query);
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(list));
    },
    clearRecentSearches: function () {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    },

    getSessions: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS)) || [];
      } catch (e) {
        return [];
      }
    },
    saveSession: function (session) {
      const list = Storage.getSessions();
      list.unshift(session);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(list));
    },
    clearSessions: function () {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    },

    getSettings: function () {
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
        return Object.assign({ apiKey: '', defaultDuration: 25, soundEnabled: true }, data);
      } catch (e) {
        return { apiKey: '', defaultDuration: 25, soundEnabled: true };
      }
    },
    saveSettings: function (newSettings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    },

    getActiveSession: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION));
      } catch (e) {
        return null;
      }
    },
    saveActiveSession: function (sessionData) {
      if (!sessionData) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      } else {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(sessionData));
      }
    }
  };

  // ==========================================================================
  // AUDIO CHIME (Self-contained Web Audio API)
  // ==========================================================================
  function playCompletionChime() {
    if (!state.settings.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5

      osc2.frequency.setValueAtTime(880, now + 0.15); // A5
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.5); // D6

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.15);
      osc1.stop(now + 0.7);
      osc2.stop(now + 1.1);
    } catch (e) {
      console.warn('Audio playback not permitted or unavailable', e);
    }
  }

  // ==========================================================================
  // YOUTUBE LINK PARSER
  // ==========================================================================
  const YouTubeParser = {
    extractVideoId: function (input) {
      if (!input || typeof input !== 'string') return null;
      input = input.trim();

      // Check if raw 11-char ID
      if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
        return input;
      }

      // Check standard watch URLs
      const watchMatch = input.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (watchMatch && watchMatch[1]) {
        return watchMatch[1];
      }

      // Check shorts / live URLs
      const shortMatch = input.match(/youtube\.com\/(?:shorts|live)\/([^"&?\/\s]{11})/i);
      if (shortMatch && shortMatch[1]) {
        return shortMatch[1];
      }

      return null;
    }
  };

  // ==========================================================================
  // SEARCH SERVICE
  // ==========================================================================
  const SearchService = {
    // Fetch video info via oEmbed
    fetchOEmbed: async function (videoId) {
      try {
        const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('oEmbed error');
        const data = await res.json();
        return {
          id: videoId,
          title: data.title || 'YouTube Video',
          channel: data.author_name || 'YouTube Creator',
          thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          durationText: 'Direct Link',
          viewsText: '',
          publishedText: ''
        };
      } catch (e) {
        return {
          id: videoId,
          title: `Video (${videoId})`,
          channel: 'YouTube Video',
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          durationText: 'Direct Link',
          viewsText: '',
          publishedText: ''
        };
      }
    },

    // Search via Google YouTube Data API v3
    searchWithGoogleApi: async function (query, apiKey) {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&type=video&q=${encodeURIComponent(query)}&key=${apiKey}`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) {
        const errData = await searchRes.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API HTTP ${searchRes.status}`);
      }
      const searchData = await searchRes.json();
      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      const videoIds = searchData.items.map(item => item.id.videoId).join(',');
      let videoStats = {};

      try {
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
        const videosRes = await fetch(videosUrl);
        if (videosRes.ok) {
          const vData = await videosRes.json();
          (vData.items || []).forEach(v => {
            videoStats[v.id] = {
              duration: formatIsoDuration(v.contentDetails?.duration),
              views: formatViews(v.statistics?.viewCount)
            };
          });
        }
      } catch (e) {
        console.warn('Could not fetch video details', e);
      }

      return searchData.items.map(item => {
        const id = item.id.videoId;
        const details = videoStats[id] || {};
        return {
          id: id,
          title: decodeHtmlEntities(item.snippet.title),
          channel: decodeHtmlEntities(item.snippet.channelTitle),
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          durationText: details.duration || '',
          viewsText: details.views || '',
          publishedText: formatDateAgo(item.snippet.publishedAt)
        };
      });
    },

    // Search via Invidious public instances (no API key required)
    searchWithInvidious: async function (query) {
      let lastError = null;

      for (const instance of INVIDIOUS_INSTANCES) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const url = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (!res.ok) continue;

          const data = await res.json();
          if (!Array.isArray(data)) continue;

          // Limit to max 12 items for controlled results
          const videos = data.filter(item => item.type === 'video').slice(0, 12);
          return videos.map(item => {
            let thumb = `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`;
            if (item.videoThumbnails && item.videoThumbnails.length > 0) {
              const best = item.videoThumbnails.find(t => t.quality === 'high' || t.quality === 'medium') || item.videoThumbnails[0];
              if (best && best.url) thumb = best.url;
            }

            return {
              id: item.videoId,
              title: decodeHtmlEntities(item.title),
              channel: decodeHtmlEntities(item.author || ''),
              thumbnail: thumb,
              durationText: formatSeconds(item.lengthSeconds),
              viewsText: item.viewCountText || (item.viewCount ? formatViews(item.viewCount) : ''),
              publishedText: item.publishedText || ''
            };
          });
        } catch (e) {
          lastError = e;
          // Continue to next instance
        }
      }

      throw lastError || new Error('All search instances are temporarily unreachable.');
    }
  };

  // Helper formatting functions
  function decodeHtmlEntities(str) {
    if (!str) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  function formatSeconds(secs) {
    if (!secs || isNaN(secs)) return '';
    const s = parseInt(secs, 10);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const remS = s % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${remS < 10 ? '0' : ''}${remS}`;
    }
    return `${m}:${remS < 10 ? '0' : ''}${remS}`;
  }

  function formatIsoDuration(isoDuration) {
    if (!isoDuration) return '';
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';
    const h = parseInt(match[1] || 0, 10);
    const m = parseInt(match[2] || 0, 10);
    const s = parseInt(match[3] || 0, 10);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function formatViews(views) {
    if (!views) return '';
    const num = parseInt(views, 10);
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M views';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K views';
    return num + ' views';
  }

  function formatDateAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  // ==========================================================================
  // VIEW ROUTER
  // ==========================================================================
  function switchView(viewName) {
    state.currentView = viewName;

    elements.homeView.classList.remove('active');
    elements.resultsView.classList.remove('active');
    elements.focusView.classList.remove('active');

    if (viewName === 'home') {
      elements.homeView.classList.add('active');
      renderRecentSearches();
      elements.searchInput.focus();
    } else if (viewName === 'results') {
      elements.resultsView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'focus') {
      elements.focusView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateActiveFocusPill();
  }

  function updateActiveFocusPill() {
    if (state.timer.isRunning || (state.timer.isPaused && state.currentVideo)) {
      elements.activeFocusPill.style.display = 'inline-flex';
      const m = Math.floor(state.timer.remainingSeconds / 60);
      const s = state.timer.remainingSeconds % 60;
      const formatted = `${m}:${s < 10 ? '0' : ''}${s}`;
      elements.activeFocusPillText.textContent = `Focusing • ${formatted}`;
    } else {
      elements.activeFocusPill.style.display = 'none';
    }
  }

  // ==========================================================================
  // SEARCH EXECUTION & UI
  // ==========================================================================
  async function handleSearch(rawQuery) {
    if (!rawQuery) return;
    const query = rawQuery.trim();
    if (!query) return;

    // Check if user entered a direct YouTube video URL or Video ID
    const directVideoId = YouTubeParser.extractVideoId(query);
    if (directVideoId) {
      Storage.saveRecentSearch(query);
      renderRecentSearches();
      elements.searchInput.value = '';
      updateSearchClearBtn();

      // Directly enter focus mode for this video
      await openFocusModeById(directVideoId);
      return;
    }

    // Normal keyword search
    state.searchQuery = query;
    Storage.saveRecentSearch(query);
    renderRecentSearches();

    switchView('results');
    elements.resultsQueryTitle.textContent = `Results for "${query}"`;
    elements.resultsCount.textContent = 'Searching...';

    // Show loading skeleton
    elements.videosGrid.innerHTML = '';
    elements.resultsLoading.style.display = 'grid';
    elements.resultsEmpty.style.display = 'none';
    elements.resultsError.style.display = 'none';

    try {
      let videos = [];
      if (state.settings.apiKey) {
        videos = await SearchService.searchWithGoogleApi(query, state.settings.apiKey);
      } else {
        videos = await SearchService.searchWithInvidious(query);
      }

      elements.resultsLoading.style.display = 'none';

      if (!videos || videos.length === 0) {
        elements.resultsCount.textContent = '0 videos';
        elements.resultsEmpty.style.display = 'block';
        return;
      }

      state.searchResults = videos;
      elements.resultsCount.textContent = `${videos.length} videos found (Finite list)`;
      renderVideosGrid(videos);
    } catch (err) {
      console.error('Search failed:', err);
      elements.resultsLoading.style.display = 'none';
      elements.resultsError.style.display = 'block';
      elements.errorStateTitle.textContent = 'Search Connection Error';
      elements.errorStateDesc.textContent =
        'Public search is temporarily unavailable. You can paste any direct YouTube link/ID into the search box, or add your free personal YouTube API key in Settings.';
    }
  }

  function renderVideosGrid(videos) {
    elements.videosGrid.innerHTML = '';

    videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.setAttribute('role', 'article');

      card.innerHTML = `
        <div class="thumbnail-wrapper" tabindex="0" role="button" aria-label="Start Focus Mode on ${escapeHtml(video.title)}">
          <img class="thumbnail-img" src="${escapeHtml(video.thumbnail)}" alt="${escapeHtml(video.title)}" loading="lazy">
          ${video.durationText ? `<span class="duration-badge">${escapeHtml(video.durationText)}</span>` : ''}
          <div class="play-hover-overlay">
            <div class="play-hover-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </div>
        <div class="video-card-body">
          <h3 class="video-title" title="${escapeHtml(video.title)}">${escapeHtml(video.title)}</h3>
          <div class="channel-name">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>${escapeHtml(video.channel)}</span>
          </div>
          <div class="video-meta-row">
            ${video.viewsText ? `<span>${escapeHtml(video.viewsText)}</span>` : ''}
            ${video.viewsText && video.publishedText ? `<span class="meta-dot">•</span>` : ''}
            ${video.publishedText ? `<span>${escapeHtml(video.publishedText)}</span>` : ''}
          </div>
          <button class="focus-start-btn" type="button">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Start Focus Mode</span>
          </button>
        </div>
      `;

      // Event listeners to start focus mode
      const thumb = card.querySelector('.thumbnail-wrapper');
      const title = card.querySelector('.video-title');
      const btn = card.querySelector('.focus-start-btn');

      const triggerFocus = () => enterFocusMode(video);
      thumb.addEventListener('click', triggerFocus);
      thumb.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') triggerFocus(); });
      title.addEventListener('click', triggerFocus);
      btn.addEventListener('click', triggerFocus);

      elements.videosGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // RECENT SEARCHES UI
  // ==========================================================================
  function renderRecentSearches() {
    const list = Storage.getRecentSearches();
    if (list.length === 0) {
      elements.recentSearchesBox.style.display = 'none';
      elements.recentTagsList.innerHTML = '';
      return;
    }

    elements.recentSearchesBox.style.display = 'block';
    elements.recentTagsList.innerHTML = '';

    list.forEach(query => {
      const pill = document.createElement('div');
      pill.className = 'recent-pill';
      pill.innerHTML = `
        <span class="pill-text">${escapeHtml(query)}</span>
        <button type="button" class="remove-pill-btn" aria-label="Remove ${escapeHtml(query)}">&times;</button>
      `;

      pill.querySelector('.pill-text').addEventListener('click', () => {
        elements.searchInput.value = query;
        updateSearchClearBtn();
        handleSearch(query);
      });

      pill.querySelector('.remove-pill-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        Storage.removeRecentSearch(query);
        renderRecentSearches();
      });

      elements.recentTagsList.appendChild(pill);
    });
  }

  function updateSearchClearBtn() {
    if (elements.searchInput.value.trim().length > 0) {
      elements.searchClearBtn.classList.add('visible');
    } else {
      elements.searchClearBtn.classList.remove('visible');
    }
  }

  // ==========================================================================
  // FOCUS MODE (SIGNATURE FEATURE)
  // ==========================================================================
  async function openFocusModeById(videoId) {
    const video = await SearchService.fetchOEmbed(videoId);
    enterFocusMode(video);
  }

  function enterFocusMode(video) {
    state.currentVideo = video;

    // Set video details in UI
    elements.focusVideoTitle.textContent = video.title;
    elements.focusChannelName.textContent = video.channel;
    elements.sessionIntentionInput.value = '';

    // Set embed player URL with distraction-free parameters:
    // youtube-nocookie, autoplay=1, rel=0 (no outside related videos), modestbranding=1
    const embedUrl = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
    elements.focusPlayer.src = embedUrl;

    // Setup timer preset from settings if not actively running
    if (!state.timer.isRunning && !state.timer.isPaused) {
      const defaultMinutes = parseInt(state.settings.defaultDuration, 10) || 25;
      setTimerDuration(defaultMinutes);
      Timer.updateDisplay();
    }

    switchView('focus');
    Timer.persistActiveSession();
  }

  // ==========================================================================
  // FOCUS TIMER
  // ==========================================================================
  const Timer = {
    setDuration: function (minutes) {
      minutes = Math.max(1, Math.min(180, parseInt(minutes, 10) || 25));
      state.timer.presetMinutes = minutes;
      state.timer.totalSeconds = minutes * 60;
      state.timer.remainingSeconds = minutes * 60;
      state.timer.isRunning = false;
      state.timer.isPaused = false;
      if (state.timer.intervalId) {
        clearInterval(state.timer.intervalId);
        state.timer.intervalId = null;
      }
      Timer.updateControlsUI();
      Timer.updateDisplay();
      Timer.persistActiveSession();
    },

    start: function () {
      state.timer.isRunning = true;
      state.timer.isPaused = false;
      state.timer.startTime = Date.now();
      state.timer.targetEndTime = Date.now() + state.timer.remainingSeconds * 1000;

      if (state.timer.intervalId) {
        clearInterval(state.timer.intervalId);
      }

      state.timer.intervalId = setInterval(Timer.tick, 500);

      Timer.updateControlsUI();
      Timer.persistActiveSession();
      updateActiveFocusPill();

      elements.focusStatusBadge.className = 'focus-status-indicator active';
      elements.focusStatusBadgeText.textContent = 'Focus Session Active';
    },

    pause: function () {
      if (!state.timer.isRunning) return;
      state.timer.isRunning = false;
      state.timer.isPaused = true;

      if (state.timer.intervalId) {
        clearInterval(state.timer.intervalId);
        state.timer.intervalId = null;
      }

      Timer.updateControlsUI();
      Timer.persistActiveSession();
      updateActiveFocusPill();

      elements.focusStatusBadge.className = 'focus-status-indicator';
      elements.focusStatusBadgeText.textContent = 'Session Paused';
    },

    resume: function () {
      Timer.start();
    },

    reset: function () {
      Timer.setDuration(state.timer.presetMinutes);
      elements.focusStatusBadge.className = 'focus-status-indicator';
      elements.focusStatusBadgeText.textContent = 'Ready to Focus';
    },

    tick: function () {
      if (!state.timer.isRunning) return;

      const now = Date.now();
      const diffMs = state.timer.targetEndTime - now;
      const remaining = Math.max(0, Math.ceil(diffMs / 1000));

      state.timer.remainingSeconds = remaining;
      Timer.updateDisplay();
      updateActiveFocusPill();

      if (remaining <= 0) {
        Timer.completeSession();
      }
    },

    updateDisplay: function () {
      const total = state.timer.totalSeconds || 1;
      const remaining = state.timer.remainingSeconds;

      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      elements.timerDigits.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;

      // Update circular SVG stroke
      const progressFraction = Math.max(0, Math.min(1, remaining / total));
      const offset = CIRCLE_CIRCUMFERENCE * (1 - progressFraction);
      elements.timerProgressCircle.style.strokeDashoffset = offset.toFixed(2);

      // Subtext
      if (state.timer.isRunning) {
        elements.timerSubtext.textContent = 'In Progress';
      } else if (state.timer.isPaused) {
        elements.timerSubtext.textContent = 'Paused';
      } else {
        elements.timerSubtext.textContent = 'Ready';
      }
    },

    updateControlsUI: function () {
      if (state.timer.isRunning) {
        elements.timerToggleLabel.textContent = 'Pause';
        elements.timerToggleIcon.innerHTML = `
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        `;
      } else if (state.timer.isPaused) {
        elements.timerToggleLabel.textContent = 'Resume';
        elements.timerToggleIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      } else {
        elements.timerToggleLabel.textContent = 'Start Focus';
        elements.timerToggleIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      }
    },

    completeSession: function () {
      if (state.timer.intervalId) {
        clearInterval(state.timer.intervalId);
        state.timer.intervalId = null;
      }
      state.timer.isRunning = false;
      state.timer.isPaused = false;

      Timer.updateControlsUI();
      Timer.persistActiveSession();
      updateActiveFocusPill();

      playCompletionChime();

      // Log session to history
      const durationMin = Math.max(1, Math.round(state.timer.totalSeconds / 60));
      HistoryManager.recordSession({
        videoId: state.currentVideo ? state.currentVideo.id : '',
        title: state.currentVideo ? state.currentVideo.title : 'Focus Session',
        channel: state.currentVideo ? state.currentVideo.channel : 'YouTube',
        durationMinutes: durationMin,
        completed: true,
        intention: elements.sessionIntentionInput.value.trim()
      });

      // Clear active session storage
      Storage.saveActiveSession(null);

      // Show completed modal
      elements.completedVideoName.textContent = state.currentVideo ? state.currentVideo.title : 'Session';
      elements.completedDurationText.textContent = `${durationMin} min focus block completed`;
      elements.completedModal.classList.add('active');
    },

    finishEarly: function () {
      if (state.timer.intervalId) {
        clearInterval(state.timer.intervalId);
        state.timer.intervalId = null;
      }
      state.timer.isRunning = false;
      state.timer.isPaused = false;

      const elapsedSeconds = state.timer.totalSeconds - state.timer.remainingSeconds;
      const elapsedMin = Math.max(1, Math.round(elapsedSeconds / 60));

      if (state.currentVideo) {
        HistoryManager.recordSession({
          videoId: state.currentVideo.id,
          title: state.currentVideo.title,
          channel: state.currentVideo.channel,
          durationMinutes: elapsedMin,
          completed: true,
          intention: elements.sessionIntentionInput.value.trim()
        });
      }

      Storage.saveActiveSession(null);
      elements.focusPlayer.src = '';
      updateActiveFocusPill();

      elements.completedVideoName.textContent = state.currentVideo ? state.currentVideo.title : 'Session';
      elements.completedDurationText.textContent = `${elapsedMin} min focused`;
      elements.completedModal.classList.add('active');
    },

    persistActiveSession: function () {
      if (!state.currentVideo) {
        Storage.saveActiveSession(null);
        return;
      }

      Storage.saveActiveSession({
        video: state.currentVideo,
        timer: {
          totalSeconds: state.timer.totalSeconds,
          remainingSeconds: state.timer.remainingSeconds,
          isRunning: state.timer.isRunning,
          isPaused: state.timer.isPaused,
          targetEndTime: state.timer.targetEndTime,
          presetMinutes: state.timer.presetMinutes
        },
        intention: elements.sessionIntentionInput.value.trim()
      });
    },

    restoreSessionIfAny: function () {
      const saved = Storage.getActiveSession();
      if (!saved || !saved.video) return;

      state.currentVideo = saved.video;
      state.timer.totalSeconds = saved.timer.totalSeconds;
      state.timer.presetMinutes = saved.timer.presetMinutes || 25;
      elements.sessionIntentionInput.value = saved.intention || '';

      if (saved.timer.isRunning && saved.timer.targetEndTime) {
        const diff = Math.ceil((saved.timer.targetEndTime - Date.now()) / 1000);
        if (diff > 0) {
          state.timer.remainingSeconds = diff;
          enterFocusMode(saved.video);
          Timer.start();
        } else {
          // Completed while page was closed
          state.timer.remainingSeconds = 0;
          enterFocusMode(saved.video);
          Timer.completeSession();
        }
      } else if (saved.timer.isPaused) {
        state.timer.remainingSeconds = saved.timer.remainingSeconds;
        state.timer.isPaused = true;
        enterFocusMode(saved.video);
        Timer.updateControlsUI();
        Timer.updateDisplay();
      }
    }
  };

  function setTimerDuration(minutes) {
    Timer.setDuration(minutes);
    elements.presetBtns.forEach(btn => {
      if (btn.dataset.minutes === String(minutes)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    elements.customDurationWrapper.classList.remove('visible');
  }

  // ==========================================================================
  // DISTRACTION WARNING INTERVENTION
  // ==========================================================================
  const DistractionShield = {
    checkAndNavigate: function (navigationAction) {
      // If timer is running or actively paused in focus mode:
      if (state.currentView === 'focus' && (state.timer.isRunning || (state.timer.isPaused && state.timer.remainingSeconds > 0))) {
        state.pendingNavigation = navigationAction;
        elements.distractionVideoName.textContent = state.currentVideo ? state.currentVideo.title : 'Current Video';
        elements.distractionModal.classList.add('active');
        return false;
      }

      // Safe to navigate
      navigationAction();
      return true;
    },

    handleStayFocused: function () {
      elements.distractionModal.classList.remove('active');
      state.pendingNavigation = null;
    },

    handleContinueAndLeave: function () {
      elements.distractionModal.classList.remove('active');

      // Record interrupted session in history
      const elapsedSeconds = state.timer.totalSeconds - state.timer.remainingSeconds;
      const elapsedMin = Math.max(1, Math.round(elapsedSeconds / 60));

      if (state.currentVideo) {
        HistoryManager.recordSession({
          videoId: state.currentVideo.id,
          title: state.currentVideo.title,
          channel: state.currentVideo.channel,
          durationMinutes: elapsedMin,
          completed: false,
          intention: elements.sessionIntentionInput.value.trim()
        });
      }

      // Stop timer and clear active session
      if (state.timer.intervalId) {
        clearInterval(state.timer.intervalId);
        state.timer.intervalId = null;
      }
      state.timer.isRunning = false;
      state.timer.isPaused = false;
      Storage.saveActiveSession(null);
      elements.focusPlayer.src = '';
      updateActiveFocusPill();

      if (typeof state.pendingNavigation === 'function') {
        const action = state.pendingNavigation;
        state.pendingNavigation = null;
        action();
      } else {
        switchView('home');
      }
    }
  };

  // Browser level beforeunload intervention
  window.addEventListener('beforeunload', (e) => {
    if (state.timer.isRunning) {
      e.preventDefault();
      e.returnValue = 'You have an active focus session in progress.';
    }
  });

  // ==========================================================================
  // SESSION HISTORY MANAGER
  // ==========================================================================
  const HistoryManager = {
    recordSession: function ({ videoId, title, channel, durationMinutes, completed, intention }) {
      const session = {
        id: 'sess_' + Date.now(),
        videoId: videoId,
        title: title,
        channel: channel,
        durationMinutes: durationMinutes,
        completed: !!completed,
        intention: intention || '',
        timestamp: Date.now(),
        dateFormatted: formatHistoryDate(Date.now())
      };
      Storage.saveSession(session);
    },

    renderModal: function () {
      const sessions = Storage.getSessions();
      const today = new Date().toDateString();

      // Calculate today's stats
      let todayCount = 0;
      let todayTotalMinutes = 0;

      sessions.forEach(sess => {
        const sessDate = new Date(sess.timestamp).toDateString();
        if (sessDate === today) {
          if (sess.completed) todayCount++;
          todayTotalMinutes += (sess.durationMinutes || 0);
        }
      });

      elements.todaySessionsCount.textContent = todayCount;
      if (todayTotalMinutes >= 60) {
        const h = Math.floor(todayTotalMinutes / 60);
        const m = todayTotalMinutes % 60;
        elements.todayTotalFocusTime.textContent = `${h}h ${m}m`;
      } else {
        elements.todayTotalFocusTime.textContent = `${todayTotalMinutes}m`;
      }

      // Render items
      if (sessions.length === 0) {
        elements.historyListContainer.innerHTML = `
          <div class="history-empty-message">
            No focus sessions recorded yet. Start a video and complete a timer block!
          </div>
        `;
        return;
      }

      elements.historyListContainer.innerHTML = '';
      sessions.forEach(sess => {
        const row = document.createElement('div');
        row.className = 'history-item-row';

        const isCompleted = sess.completed;
        const iconHtml = isCompleted
          ? `<div class="history-status-icon completed" title="Completed session">
               <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                 <polyline points="20 6 9 17 4 12"></polyline>
               </svg>
             </div>`
          : `<div class="history-status-icon partial" title="Interrupted session">
               <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                 <rect x="6" y="6" width="12" height="12" rx="2"></rect>
               </svg>
             </div>`;

        row.innerHTML = `
          <div class="history-item-left">
            ${iconHtml}
            <div class="history-details">
              <div class="history-item-title" title="${escapeHtml(sess.title)}">${escapeHtml(sess.title)}</div>
              <div class="history-item-sub">
                <span>${escapeHtml(sess.channel || 'YouTube')}</span>
                <span>•</span>
                <span>${escapeHtml(sess.dateFormatted)}</span>
                ${sess.intention ? `<span>• Goal: ${escapeHtml(sess.intention)}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="history-item-right">
            <span class="history-duration-tag">${sess.durationMinutes}m</span>
            ${sess.videoId ? `<button type="button" class="history-refocus-btn" data-video-id="${sess.videoId}">Re-focus</button>` : ''}
          </div>
        `;

        const refocusBtn = row.querySelector('.history-refocus-btn');
        if (refocusBtn) {
          refocusBtn.addEventListener('click', () => {
            elements.historyModal.classList.remove('active');
            DistractionShield.checkAndNavigate(async () => {
              await openFocusModeById(sess.videoId);
            });
          });
        }

        elements.historyListContainer.appendChild(row);
      });
    }
  };

  function formatHistoryDate(timestamp) {
    const d = new Date(timestamp);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return 'Today ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // ==========================================================================
  // EVENT LISTENERS & INITIALIZATION
  // ==========================================================================
  function setupEventListeners() {
    // Brand Link (Home)
    elements.brandHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      DistractionShield.checkAndNavigate(() => switchView('home'));
    });

    // Active Focus Pill in Header
    elements.activeFocusPill.addEventListener('click', () => {
      switchView('focus');
    });

    // Search Form Submit
    elements.searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = elements.searchInput.value.trim();
      if (q) handleSearch(q);
    });

    // Search Input Clear Button
    elements.searchInput.addEventListener('input', updateSearchClearBtn);
    elements.searchClearBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      updateSearchClearBtn();
      elements.searchInput.focus();
    });

    // Clear Recent Searches Button
    elements.clearRecentBtn.addEventListener('click', () => {
      if (confirm('Clear all recent searches?')) {
        Storage.clearRecentSearches();
        renderRecentSearches();
      }
    });

    // Back to Home from Results
    elements.backToHomeBtn.addEventListener('click', () => {
      switchView('home');
    });

    // Empty state retry button
    elements.emptyStateSearchBtn.addEventListener('click', () => {
      switchView('home');
    });

    // Error retry button
    elements.errorRetryBtn.addEventListener('click', () => {
      if (state.searchQuery) handleSearch(state.searchQuery);
    });

    // Error settings button
    elements.errorSettingsBtn.addEventListener('click', () => {
      elements.settingsModal.classList.add('active');
    });

    // Exit Focus Button (Top bar)
    elements.leaveFocusBtn.addEventListener('click', () => {
      DistractionShield.checkAndNavigate(() => {
        elements.focusPlayer.src = '';
        switchView(state.searchResults.length > 0 ? 'results' : 'home');
      });
    });

    // Finish Session & Leave Button (Inside Timer card)
    elements.finishSessionBtn.addEventListener('click', () => {
      Timer.finishEarly();
    });

    // Timer Preset Buttons
    elements.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.minutes;
        if (val === 'custom') {
          elements.presetBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          elements.customDurationWrapper.classList.add('visible');
          elements.customMinutesInput.focus();
        } else {
          setTimerDuration(parseInt(val, 10));
        }
      });
    });

    // Apply Custom Minutes Button
    elements.applyCustomMinBtn.addEventListener('click', () => {
      const val = parseInt(elements.customMinutesInput.value, 10);
      if (val > 0 && val <= 180) {
        Timer.setDuration(val);
      }
    });

    // Timer Toggle (Start / Pause / Resume)
    elements.timerToggleBtn.addEventListener('click', () => {
      if (state.timer.isRunning) {
        Timer.pause();
      } else if (state.timer.isPaused) {
        Timer.resume();
      } else {
        Timer.start();
      }
    });

    // Timer Reset
    elements.timerResetBtn.addEventListener('click', () => {
      Timer.reset();
    });

    // Distraction Modal Actions
    elements.stayFocusedBtn.addEventListener('click', () => {
      DistractionShield.handleStayFocused();
    });

    elements.continueLeaveBtn.addEventListener('click', () => {
      DistractionShield.handleContinueAndLeave();
    });

    // Completed Modal Actions
    elements.finishAndLeaveBtn.addEventListener('click', () => {
      elements.completedModal.classList.remove('active');
      elements.focusPlayer.src = '';
      switchView('home');
    });

    elements.keepWatchingBtn.addEventListener('click', () => {
      elements.completedModal.classList.remove('active');
    });

    // History Modal Open & Close
    elements.openHistoryBtn.addEventListener('click', () => {
      HistoryManager.renderModal();
      elements.historyModal.classList.add('active');
    });

    elements.closeHistoryBtn.addEventListener('click', () => {
      elements.historyModal.classList.remove('active');
    });

    elements.closeHistoryBottomBtn.addEventListener('click', () => {
      elements.historyModal.classList.remove('active');
    });

    elements.clearAllHistoryBtn.addEventListener('click', () => {
      if (confirm('Clear your entire local session history? This cannot be undone.')) {
        Storage.clearSessions();
        HistoryManager.renderModal();
      }
    });

    // Settings Modal Open, Close, Save
    elements.openSettingsBtn.addEventListener('click', () => {
      elements.settingsApiKeyInput.value = state.settings.apiKey || '';
      elements.settingsDefaultDuration.value = String(state.settings.defaultDuration || 25);
      elements.settingsSoundToggle.checked = !!state.settings.soundEnabled;
      elements.settingsModal.classList.add('active');
    });

    elements.closeSettingsBtn.addEventListener('click', () => {
      elements.settingsModal.classList.remove('active');
    });

    elements.saveSettingsBtn.addEventListener('click', () => {
      const newSettings = {
        apiKey: elements.settingsApiKeyInput.value.trim(),
        defaultDuration: parseInt(elements.settingsDefaultDuration.value, 10) || 25,
        soundEnabled: elements.settingsSoundToggle.checked
      };
      state.settings = newSettings;
      Storage.saveSettings(newSettings);
      elements.settingsModal.classList.remove('active');
    });

    // Close modals on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (elements.distractionModal.classList.contains('active')) {
          DistractionShield.handleStayFocused();
        } else {
          elements.historyModal.classList.remove('active');
          elements.settingsModal.classList.remove('active');
          elements.completedModal.classList.remove('active');
        }
      }
    });

    // PWA Install Prompt Capture
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredInstallPrompt = e;
      elements.installPwaBtn.style.display = 'inline-flex';
    });

    elements.installPwaBtn.addEventListener('click', async () => {
      if (!state.deferredInstallPrompt) return;
      state.deferredInstallPrompt.prompt();
      const choice = await state.deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        elements.installPwaBtn.style.display = 'none';
      }
      state.deferredInstallPrompt = null;
    });
  }

  // ==========================================================================
  // SERVICE WORKER REGISTRATION
  // ==========================================================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('NotDistract Service Worker registered:', reg.scope))
          .catch(err => console.warn('Service Worker registration failed:', err));
      });
    }
  }

  // ==========================================================================
  // APP INITIALIZATION
  // ==========================================================================
  function init() {
    state.settings = Storage.getSettings();
    setupEventListeners();
    renderRecentSearches();
    Timer.restoreSessionIfAny();
    registerServiceWorker();
  }

  // Expose NotDistract API
  window.NotDistract = {
    state,
    handleSearch,
    enterFocusMode,
    openFocusModeById,
    Timer,
    HistoryManager,
    Storage,
    DistractionShield
  };

  // Start app
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
