/* ============================================================
   No need to edit this file — all personal content lives in
   config.js. This just wires everything up.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const cfg = window.SITE_CONFIG || {};

  function safe(label, fn){
    try { fn(); }
    catch (err) { console.error('[site error] ' + label + ':', err); }
  }

  /* ---------- offline support (PWA) ---------- */
  safe('service-worker', () => {
    if('serviceWorker' in navigator){
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch((err) => {
          console.error('[site error] service worker registration failed:', err);
        });
      });
    }
  });

  /* ---------- petals ---------- */
  safe('petals', () => {
    const wrap = document.getElementById('petals');
    const count = window.innerWidth < 600 ? 8 : 14;
    for(let i = 0; i < count; i++){
      const p = document.createElement('span');
      p.className = 'petal';
      p.textContent = '❀';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      p.style.fontSize = (10 + Math.random() * 10) + 'px';
      p.style.animationDuration = (14 + Math.random() * 14) + 's';
      p.style.animationDelay = (Math.random() * -20) + 's';
      wrap.appendChild(p);
    }
  });

  /* ---------- header ---------- */
  safe('header', () => {
    document.getElementById('page-title').textContent = cfg.title || 'for you';
    document.getElementById('page-subtitle').textContent = cfg.subtitle || '';
  });

  /* ---------- shared audio player ---------- */
  const audioEl = new Audio();
  const nowPlaying = document.getElementById('now-playing');
  const nowPlayingTitle = document.getElementById('now-playing-title');
  const nowPlayingPause = document.getElementById('now-playing-pause');
  const progressBar = document.getElementById('now-playing-progress-bar');
  let activePlayButtons = [];

  function playSong(src, title, triggerBtn){
    if(!src) return;
    try{
      if(audioEl.src.endsWith(src) && !audioEl.paused){
        audioEl.pause();
        resetPlayButtons();
        nowPlaying.classList.remove('is-active');
        return;
      }
      audioEl.src = src;
      audioEl.play().catch(() => {
        nowPlayingTitle.textContent = `Add "${src.split('/').pop()}" to assets/audio to hear this`;
        nowPlaying.classList.add('is-active');
        setTimeout(() => nowPlaying.classList.remove('is-active'), 3500);
      });
      resetPlayButtons();
      if(triggerBtn){ triggerBtn.classList.add('is-playing'); activePlayButtons.push(triggerBtn); }
      nowPlayingTitle.textContent = title || '';
      nowPlaying.classList.add('is-active');
    } catch(err){ console.error('[site error] playSong:', err); }
  }
  function resetPlayButtons(){
    activePlayButtons.forEach(b => b.classList.remove('is-playing'));
    activePlayButtons = [];
  }
  audioEl.addEventListener('ended', () => {
    resetPlayButtons();
    nowPlaying.classList.remove('is-active');
  });
  audioEl.addEventListener('timeupdate', () => {
    if(audioEl.duration){
      progressBar.style.width = ((audioEl.currentTime / audioEl.duration) * 100) + '%';
    }
  });
  audioEl.addEventListener('loadstart', () => { progressBar.style.width = '0%'; });
  nowPlayingPause.addEventListener('click', () => {
    if(audioEl.paused){ audioEl.play(); } else { audioEl.pause(); }
  });

  function playIcon(){
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  }

  /* ---------- notes jar ---------- */
  safe('jar', () => {
    const moodsWrap = document.getElementById('jar-moods');
    const songWrap = document.getElementById('jar-mood-song');
    const jarBtn = document.getElementById('jar-container');
    const tapLabel = document.getElementById('jar-tap-label');
    const drawnNoteEl = document.getElementById('jar-drawn-note');
    const moods = Array.isArray(cfg.notesJar && cfg.notesJar.moods) ? cfg.notesJar.moods : [];

    let activeId = moods.length ? moods[0].id : null;
    let remainingNotes = [];

    function shuffle(arr){
      const a = arr.slice();
      for(let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function renderMoods(){
      moodsWrap.innerHTML = '';
      moods.forEach((mood) => {
        const btn = document.createElement('button');
        btn.className = 'jar-mood' + (mood.id === activeId ? ' is-active' : '');
        btn.type = 'button';
        btn.textContent = mood.label || mood.id || 'Notes';
        btn.addEventListener('click', () => {
          activeId = mood.id;
          renderMoods();
          selectMood(mood, true);
        });
        moodsWrap.appendChild(btn);
      });
    }

    function renderMoodSong(mood){
      songWrap.innerHTML = '';
      if(!mood.song && !mood.songTitle) return null;
      const row = document.createElement('div');
      row.className = 'memory-song';
      row.innerHTML = `
        <span class="song-title">${mood.songTitle || ''}</span>
        <button class="song-play" aria-label="Play ${mood.songTitle || 'song'}">${playIcon()}</button>
      `;
      songWrap.appendChild(row);
      const btn = row.querySelector('.song-play');
      if(btn){
        btn.addEventListener('click', (e) => playSong(mood.song, mood.songTitle, e.currentTarget));
      }
      return btn;
    }

    function selectMood(mood, autoplay){
      const songBtn = renderMoodSong(mood);
      remainingNotes = shuffle(Array.isArray(mood.notes) ? mood.notes : []);
      drawnNoteEl.classList.remove('is-visible');
      drawnNoteEl.textContent = '';
      tapLabel.textContent = remainingNotes.length ? 'tap the jar' : 'no notes yet';
      jarBtn.disabled = !remainingNotes.length;
      if(autoplay && songBtn && mood.song){
        playSong(mood.song, mood.songTitle, songBtn);
      }
    }

    jarBtn.addEventListener('click', () => {
      const mood = moods.find(m => m.id === activeId);
      if(!mood) return;
      if(!remainingNotes.length){
        remainingNotes = shuffle(Array.isArray(mood.notes) ? mood.notes : []);
        if(!remainingNotes.length) return;
      }
      const note = remainingNotes.pop();
      tapLabel.textContent = remainingNotes.length ? remainingNotes.length + ' left in the jar' : 'that\'s all of them — tap for more';
      jarBtn.classList.add('is-shaking');
      drawnNoteEl.classList.remove('is-visible');
      setTimeout(() => {
        jarBtn.classList.remove('is-shaking');
        drawnNoteEl.textContent = note;
        drawnNoteEl.classList.add('is-visible');
      }, 350);
    });

    if(moods.length){
      renderMoods();
      selectMood(moods[0], false);
    }
  });
});
