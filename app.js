document.addEventListener('DOMContentLoaded', () => {
  // --- データ定義 ---
  const CONFIG = [
    {
      key: "sakugyo",
      label: "さぎょう",
      options: [
        { label: "おり", icon: "icons/origami.png" },
        { label: "のうさぎょう", icon: "icons/farming.png" },
        { label: "えんげい", icon: "icons/gardening.png" },
        { label: "とうげい", icon: "icons/pottery.png" },
        { label: "きそ", icon: "icons/construction.png" },
        { label: "かみすき", icon: "icons/papermaking.png" },
        { label: "メモちょう", icon: "icons/notepad.png" }
      ],
      allowText: true,
      textLabel: "そのほか",
      textIcon: "blank"
    },
    {
      key: "kakari",
      label: "かかり",
      options: [
        { label: "ゴミすて", icon: "icons/trash_disposal.png" },
        { label: "だいふき", icon: "icons/table_wiping.png" },
        { label: "トレイあらい", icon: "icons/tray_washing.png" },
        { label: "スイッチ", icon: "icons/light_switch.png" },
        { label: "こくばん", icon: "icons/chalkboard.png" },
        { label: "カレンダー", icon: "icons/calendar.png" },
        { label: "ほけん", icon: "icons/healthcare.png" },
        { label: "てつだい", icon: "icons/helping.png" }
      ],
      allowText: true,
      textLabel: "そのほか",
      textIcon: "blank"
    },
    {
      key: "bus",
      label: "スクールバス",
      options: [
        { label: "1ごうしゃ", icon: "icons/school_bus.png" },
        { label: "2ごうしゃ", icon: "icons/school_bus.png" },
        { label: "3ごうしゃ", icon: "icons/school_bus.png" },
        { label: "4ごうしゃ", icon: "icons/school_bus.png" },
        { label: "5ごうしゃ", icon: "icons/school_bus.png" },
        { label: "6ごうしゃ", icon: "icons/school_bus.png" },
        { label: "7ごうしゃ", icon: "icons/school_bus.png" },
        { label: "なし", emoji: "❌" }
      ],
      allowText: false
    },
    {
      key: "inkai",
      label: "いいんかい",
      options: [
        { label: "としょいいん", icon: "icons/library.png" },
        { label: "ほけんいいん", icon: "icons/hoken_committee.png" },
        { label: "ほうそういいん", icon: "icons/broadcasting.png" },
        { label: "がっきゅういいん", icon: "icons/class_committee.png" },
        { label: "せいとかいしっこうぶ", icon: "icons/student_council.png" },
        { label: "ふくかいちょう", icon: "icons/vice_president.png" },
        { label: "なし", emoji: "❌" }
      ],
      allowText: false
    },
    {
      key: "jiritsu",
      label: "じりつかつどうグループ",
      options: [
        { label: "かかわり1", icon: "icons/social_interaction.png" },
        { label: "かかわり2", icon: "icons/social_interaction.png" },
        { label: "うんどう", icon: "icons/sports.png" },
        { label: "かだい1", icon: "icons/task_assignment.png" },
        { label: "かだい2", icon: "icons/task_assignment.png" }
      ],
      allowText: false
    },
    {
      key: "nissei",
      label: "にっせいじりつグループ",
      options: [
        { label: "オレンジ", icon: "icons/orange_circle.png" },
        { label: "しろ", icon: "icons/white_circle.png" },
        { label: "あおみどり", icon: "icons/bluegreen_circle.png" }
      ],
      allowText: false
    },
    {
      key: "yuuyuu",
      label: "ゆうゆう",
      options: [
        { label: "ダンス", icon: "icons/dance.png" },
        { label: "ヨガストレッチ", icon: "icons/yoga.png" },
        { label: "パソコン", icon: "icons/computer.png" },
        { label: "ゆうぎ", icon: "icons/music_play.png" },
        { label: "ウォーキング", icon: "icons/walking.png" },
        { label: "スポーツ", icon: "icons/sports.png" },
        { label: "しゅげい", icon: "icons/handicraft.png" }
      ],
      allowText: true,
      textLabel: "その他",
      textIcon: "blank"
    },
    {
      key: "gekou",
      label: "げこうほうほう",
      type: "weekly",
      days: ["月", "火", "水", "木", "金"],
      options: [
        { label: "バス", icon: "icons/school_bus.png" },
        { label: "デイサービス", icon: "icons/dayservice.png", hasDetail: true },
        { label: "おむかえ", icon: "icons/omukae.png" }
      ]
    }
  ];

  // --- 状態管理 ---
  let appData = {
    class: "",
    number: "",
    name: "",
    values: {},
    enabledKeys: CONFIG.map(c => c.key), // Default all enabled
    speechEnabled: false,
    nazoriModeEnabled: false
  };

  // --- 要素の取得 ---
  const screens = {
    start: document.getElementById('screen-start'),
    settings: document.getElementById('screen-settings'),
    work: document.getElementById('screen-work')
  };

  const modalGate = document.getElementById('modal-gate');
  const gateQ = document.getElementById('gate-question');
  const gateA = document.getElementById('gate-answer');
  const gateStatus = document.getElementById('gate-status');

  const workItemsContainer = document.getElementById('work-items-container');
  const settingsItemsList = document.getElementById('settings-items-list');
  const photoInput = document.getElementById('photo-input');
  const photoDisplay = document.getElementById('photo-display');
  const classSelect = document.getElementById('class-select');
  const numberSelect = document.getElementById('number-select');
  const nameInput = document.getElementById('name-input');
  const speechToggle = document.getElementById('speech-toggle');
  const nazoriModeToggle = document.getElementById('nazori-mode-toggle');

  // --- 初期化 ---
  loadData();
  renderSettingsItems();
  renderWorkItems();
  updateInputsFromData();
  speechToggle.checked = appData.speechEnabled;
  nazoriModeToggle.checked = appData.nazoriModeEnabled;

  // --- 音声読み上げ ---
  function speak(text) {
    if (!appData.speechEnabled || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis failed.', e);
    }
  }

  // --- 画面切り替え ---
  function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
    
    if (screenId === 'work') {
      renderWorkItems();
      updateInputsFromData();
    }
  }

  // --- 九九認証（ペアレンタルゲート） ---
  let gateCallback = null;
  let correctCount = 0;
  let currentAnswer = 0;

  function openGate(callback) {
    gateCallback = callback;
    correctCount = 0;
    gateA.value = '';
    gateStatus.textContent = '';
    nextGateQuestion();
    modalGate.classList.add('active');
    gateA.focus();
  }

  function nextGateQuestion() {
    const a = Math.floor(Math.random() * 8) + 2; // 2-9
    const b = Math.floor(Math.random() * 8) + 2; // 2-9
    currentAnswer = a * b;
    gateQ.textContent = `${a} × ${b} = ?`;
    gateA.value = '';
    gateStatus.textContent = ``;
  }

  document.getElementById('btn-gate-submit').addEventListener('click', checkGateAnswer);
  gateA.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkGateAnswer();
  });

  function checkGateAnswer() {
    if (parseInt(gateA.value) === currentAnswer) {
      correctCount++;
      if (correctCount >= 1) {
        modalGate.classList.remove('active');
        if (gateCallback) gateCallback();
      } else {
        nextGateQuestion();
      }
    } else {
      gateStatus.textContent = 'まちがい！はじめから。';
      correctCount = 0;
      setTimeout(nextGateQuestion, 1000);
    }
  }

  document.getElementById('btn-gate-cancel').addEventListener('click', () => {
    modalGate.classList.remove('active');
  });

  // --- 印刷＆PDF保存の前処理・後処理 ---
  function prepareForPrint() {
    const printableArea = document.getElementById('printable-area');
    if (appData.nazoriModeEnabled) {
      printableArea.classList.add('nazori-mode');
    }

    // --- 名前の処理 ---
    const printedNameEl = document.getElementById('printed-name');
    const handwritingBoxEl = document.querySelector('.handwriting-box');
    if (appData.name) {
      printedNameEl.textContent = appData.name;
      printedNameEl.style.display = 'block';
      handwritingBoxEl.style.display = 'none';
    } else {
      printedNameEl.style.display = 'none';
      handwritingBoxEl.style.display = 'block';
    }

    // --- 下校方法の詳細入力の値を、印刷用要素に反映 ---
    const weeklyContainer = document.getElementById('weekly-gekou');
    if (weeklyContainer) {
      const weeklyConfig = CONFIG.find(c => c.key === 'gekou');
      weeklyConfig.days.forEach(day => {
        const row = weeklyContainer.querySelector(`.weekly-row[data-day="${day}"]`);
        if (!row) return;

        // まず、すべての詳細テキストをクリア
        row.querySelectorAll('.print-detail-text').forEach(el => el.textContent = '');

        const dayData = appData.values.gekou ? appData.values.gekou[day] : null;
        if (!dayData || !dayData.label) return;

        const selectedOptionConfig = weeklyConfig.options.find(opt => opt.label === dayData.label);
        if (!selectedOptionConfig || !selectedOptionConfig.hasDetail) return;
        
        const detailInput = row.querySelector('.weekly-detail-input');
        if (detailInput && detailInput.value) {
          // 選択されているオプションの印刷用ビューの中の .print-detail-text を特定
          const printView = row.querySelector(`.print-for-${dayData.label.replace(/\s/g, '-')}`);
          if (printView) {
            const printDetailEl = printView.querySelector('.print-detail-text');
            if (printDetailEl) {
              printDetailEl.textContent = ` (${detailInput.value})`;
            }
          }
        }
      });
    }
  }

  function cleanupAfterPrint() {
    const printableArea = document.getElementById('printable-area');
    printableArea.classList.remove('nazori-mode');

    // 名前の表示を元に戻す
    const printedNameEl = document.getElementById('printed-name');
    const handwritingBoxEl = document.querySelector('.handwriting-box');
    if(printedNameEl) printedNameEl.style.display = 'none';
    if(handwritingBoxEl) handwritingBoxEl.style.display = 'block';
  }

  // --- イベントリスナー ---
  document.getElementById('btn-start').addEventListener('click', () => showScreen('work'));
  document.getElementById('btn-to-settings').addEventListener('click', () => {
    openGate(() => showScreen('settings'));
  });

  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => showScreen('start'));
  });

  document.getElementById('btn-clear-data').addEventListener('click', () => {
    openGate(() => {
      localStorage.removeItem('workData');
      location.reload();
    });
  });

  speechToggle.addEventListener('change', () => {
    appData.speechEnabled = speechToggle.checked;
    saveData();
    if (appData.speechEnabled) {
      speak('おんせい よみあげを オンにしました');
    }
  });

  nazoriModeToggle.addEventListener('change', () => {
    appData.nazoriModeEnabled = nazoriModeToggle.checked;
    saveData();
    if (appData.nazoriModeEnabled) {
      speak('なぞり もーどを オンにしました');
    } else {
      speak('なぞり もーどを オフにしました');
    }
  });

  document.getElementById('btn-print').addEventListener('click', () => {
    prepareForPrint();
    // 印刷ダイアログが完全に準備ができてから印刷を開始するための短い遅延
    setTimeout(() => {
      window.print();
      cleanupAfterPrint();
    }, 50);
  });

  // フォーム入力の監視
  if (classSelect) {
    classSelect.addEventListener('change', (e) => {
      appData.class = e.target.value;
      saveData();
    });
  }
  if (numberSelect) {
    numberSelect.addEventListener('change', (e) => {
      appData.number = e.target.value;
      saveData();
    });
  }
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      appData.name = e.target.value;
      saveData();
    });
  }

  // 写真アップロード
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        photoDisplay.innerHTML = `<img src="${event.target.result}" alt="かおしゃしん">`;
      };
      reader.readAsDataURL(file);
    }
  });

  // --- 設定項目の生成 ---
  function renderSettingsItems() {
    settingsItemsList.innerHTML = '';
    CONFIG.forEach(item => {
      const label = document.createElement('label');
      label.className = 'settings-item-checkbox';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = appData.enabledKeys.includes(item.key);
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          if (!appData.enabledKeys.includes(item.key)) {
            appData.enabledKeys.push(item.key);
          }
        } else {
          appData.enabledKeys = appData.enabledKeys.filter(k => k !== item.key);
        }
        saveData();
      });

      const span = document.createElement('span');
      span.textContent = item.label;

      label.appendChild(checkbox);
      label.appendChild(span);
      settingsItemsList.appendChild(label);
    });
  }

  // --- ワーク項目の生成 ---
  function renderWorkItems() {
    workItemsContainer.innerHTML = '';
    const enabledItems = CONFIG.filter(item => appData.enabledKeys.includes(item.key));
    
    enabledItems.forEach(item => {
      let box;
      if (item.type === 'weekly') {
        box = renderWeeklyItem(item);
      } else {
        box = renderStandardItem(item);
      }
      workItemsContainer.appendChild(box);
    });
  }

  function renderStandardItem(item) {
    const box = document.createElement('div');
    box.className = 'work-item-box';

    const h4 = document.createElement('h4');
    h4.textContent = item.label;
    box.appendChild(h4);

    const displayContainer = document.createElement('div');
    displayContainer.className = 'selected-display';
    displayContainer.id = `display-${item.key}`;
    displayContainer.innerHTML = '<p class="text">えらんでね</p>';
    box.appendChild(displayContainer);

    const grid = document.createElement('div');
    grid.className = 'options-grid';

    item.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn';
      
      let iconEl = '';
      if (opt.icon === 'blank') {
        iconEl = '<span class="icon icon-blank"></span>';
      } else if (opt.icon) {
        iconEl = `<img src="${opt.icon}" class="icon">`;
      } else if (opt.emoji) {
        iconEl = `<span class="emoji">${opt.emoji}</span>`;
      }
      btn.innerHTML = `${iconEl}<span class="label">${opt.label}</span>`;
      
      btn.addEventListener('click', () => {
        selectOption(item, opt.label, opt.icon || opt.emoji);
      });
      grid.appendChild(btn);
    });

    if (item.allowText) {
      const otherBtn = document.createElement('button');
      otherBtn.className = 'opt-btn';
      
      let iconEl = '';
      if (item.textIcon === 'blank') {
        iconEl = '<span class="icon icon-blank"></span>';
      } else if (item.textIcon) {
        iconEl = `<img src="${item.textIcon}" class="icon">`;
      } else if (item.textEmoji) {
        iconEl = `<span class="emoji">${item.textEmoji}</span>`;
      }
      otherBtn.innerHTML = `${iconEl}<span class="label">${item.textLabel}</span>`;
      
      otherBtn.addEventListener('click', () => {
        selectOption(item, "__OTHER__", item.textIcon || item.textEmoji);
      });
      grid.appendChild(otherBtn);

      const otherInput = document.createElement('input');
      otherInput.type = 'text';
      otherInput.id = `text-${item.key}`;
      otherInput.className = 'other-input';
      otherInput.placeholder = `${item.textLabel}を にゅうりょく`;
      otherInput.addEventListener('input', () => {
         appData.values[item.key] = { type: "other", val: otherInput.value, icon: item.textIcon, emoji: item.textEmoji };
         updateDisplay(item.key, otherInput.value, item.textIcon || item.textEmoji);
         saveData();
      });
      box.appendChild(otherInput);
    }

    box.appendChild(grid);
    return box;
  }

  function renderWeeklyItem(item) {
    const box = document.createElement('div');
    box.className = 'work-item-box weekly-box';

    const h4 = document.createElement('h4');
    h4.textContent = item.label;
    box.appendChild(h4);

    const weeklyContainer = document.createElement('div');
    weeklyContainer.className = 'weekly-container';
    weeklyContainer.id = `weekly-${item.key}`;

    item.days.forEach(day => {
      const row = document.createElement('div');
      row.className = 'weekly-row';
      row.dataset.day = day;

      const dayLabel = document.createElement('div');
      dayLabel.className = 'weekly-day-label';
      dayLabel.textContent = day;
      row.appendChild(dayLabel);

      // --- 操作用UI ---
      const optionsWrapper = document.createElement('div');
      optionsWrapper.className = 'weekly-options-wrapper';

      const optionsContainer = document.createElement('div');
      optionsContainer.className = 'weekly-options-container';
      item.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.dataset.label = opt.label;
        btn.innerHTML = `<img src="${opt.icon}" class="icon"><span class="label">${opt.label}</span>`;
        btn.addEventListener('click', () => selectWeeklyOption(item, day, opt));
        optionsContainer.appendChild(btn);
      });
      optionsWrapper.appendChild(optionsContainer);

      const detailInput = document.createElement('input');
      detailInput.type = 'text';
      detailInput.className = 'weekly-detail-input';
      detailInput.placeholder = 'なまえを にゅうりょく';
      detailInput.addEventListener('input', (e) => {
        if(appData.values[item.key] && appData.values[item.key][day]) {
          appData.values[item.key][day].detail = e.target.value;
          saveData();
        }
      });
      optionsWrapper.appendChild(detailInput);
      row.appendChild(optionsWrapper);

      // --- 印刷用UI (あらかじめ全パターン生成) ---
      const printWrapper = document.createElement('div');
      printWrapper.className = 'weekly-print-wrapper';
      item.options.forEach(opt => {
        const printView = document.createElement('div');
        printView.className = `selected-print-view print-for-${opt.label.replace(/\s/g, '-')}`;
        
        let detailSpan = '';
        if (opt.hasDetail) {
          detailSpan = `<span class="print-detail-text"></span>`;
        }
        
        printView.innerHTML = `
          <img src="${opt.icon}" class="icon">
          <span class="label">${opt.label}</span>${detailSpan}
        `;
        printWrapper.appendChild(printView);
      });
      row.appendChild(printWrapper);

      weeklyContainer.appendChild(row);
    });

    box.appendChild(weeklyContainer);
    return box;
  }
  
  function selectWeeklyOption(item, day, opt) {
    speak(opt.label);

    if (!appData.values[item.key]) {
      appData.values[item.key] = {};
    }

    const currentDetail = appData.values[item.key][day]?.detail || '';
    appData.values[item.key][day] = {
      label: opt.label,
      detail: opt.hasDetail ? currentDetail : ''
    };
    saveData();

    // --- UI Update ---
    const row = document.querySelector(`.weekly-row[data-day="${day}"]`);
    if (!row) return;

    // 選択状態を示すクラスをリセット
    item.options.forEach(option => {
      row.classList.remove(`selected-${option.label.replace(/\s/g, '-')}`);
    });
    // 新しい選択状態のクラスを追加
    row.classList.add(`selected-${opt.label.replace(/\s/g, '-')}`);

    // ボタンのactiveクラスを更新
    row.querySelectorAll('.opt-btn').forEach(btn => btn.classList.remove('active'));
    const clickedBtn = row.querySelector(`.opt-btn[data-label="${opt.label}"]`);
    if (clickedBtn) {
      clickedBtn.classList.add('active');
    }

    // 詳細入力欄の表示/非表示
    const detailInput = row.querySelector('.weekly-detail-input');
    if (detailInput) {
      detailInput.style.display = opt.hasDetail ? 'block' : 'none';
      if(opt.hasDetail) detailInput.focus();
    }
  }

  function selectOption(item, label, iconOrEmoji) {
    const isOther = label === "__OTHER__";
    
    const textToSpeak = isOther ? item.textLabel : label;
    speak(textToSpeak);

    if (isOther) {
      appData.values[item.key] = { type: "other", val: "" };
    } else {
      appData.values[item.key] = { type: "option", val: label };
    }
    
    if (iconOrEmoji === 'blank' || (typeof iconOrEmoji === 'string' && iconOrEmoji.includes('/'))) {
      appData.values[item.key].icon = iconOrEmoji;
    } else {
      appData.values[item.key].emoji = iconOrEmoji;
    }
    
    // 状態を保存
    saveData();
    
    // UIを部分的に更新（再描画による不具合を防止）
    updateDisplay(item.key, isOther ? item.textLabel : label, iconOrEmoji);
    
    // 該当項目の全ボタンからactiveを外し、クリックされたボタンに付与
    const box = document.getElementById(`display-${item.key}`).closest('.work-item-box');
    if (box) {
      const btns = box.querySelectorAll('.opt-btn');
      btns.forEach(btn => btn.classList.remove('active'));
      
      const otherInput = box.querySelector('.other-input');
      if (otherInput) {
        if (isOther) otherInput.classList.add('visible');
        else otherInput.classList.remove('visible');
      }
      
      // クリックされたボタンを特定してactiveにする
      btns.forEach(btn => {
        const btnLabel = btn.querySelector('.label');
        if (btnLabel && (btnLabel.textContent === label || (isOther && btnLabel.textContent === item.textLabel))) {
          btn.classList.add('active');
        }
      });
    }
  }

  function updateDisplay(key, label, iconOrEmoji) {
    const disp = document.getElementById(`display-${key}`);
    if (!disp) return;

    const actualLabel = label === "__OTHER__" ? "" : label;
    
    let content = '';
    if (iconOrEmoji === 'blank') {
      content = '<span class="icon-large icon-blank"></span>';
    } else if (typeof iconOrEmoji === 'string' && iconOrEmoji.includes('/')) {
      content = `<img src="${iconOrEmoji}" class="icon-large">`;
    } else if (iconOrEmoji) {
      content = `<span class="emoji">${iconOrEmoji}</span>`;
    }
    
    disp.innerHTML = `${content}<span class="text">${actualLabel}</span>`;
  }

  // --- データの読み書き ---
  function saveData() {
    try {
      localStorage.setItem('workData', JSON.stringify(appData));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  }

  function loadData() {
    try {
      const stored = localStorage.getItem('workData');
      if (stored) {
        const parsed = JSON.parse(stored);
        // 互換性のためのデフォルト値設定
        if (!parsed.enabledKeys) {
          parsed.enabledKeys = CONFIG.map(c => c.key);
        }
        if (parsed.speechEnabled === undefined) {
          parsed.speechEnabled = false;
        }
        if (parsed.nazoriModeEnabled === undefined) {
          parsed.nazoriModeEnabled = false;
        }
        if (!parsed.values.gekou) {
          parsed.values.gekou = {};
        }
        appData = parsed;
      }
    } catch (e) {
      console.error('Failed to load data', e);
    }
  }

  function updateInputsFromData() {
    if (classSelect) classSelect.value = appData.class || "";
    if (numberSelect) numberSelect.value = appData.number || "";
    if (nameInput) nameInput.value = appData.name || "";

    CONFIG.forEach(item => {
      const data = appData.values[item.key];
      if (!data) return;

      if (item.type === 'weekly') {
        const weeklyContainer = document.getElementById(`weekly-${item.key}`);
        if (!weeklyContainer) return;

        item.days.forEach(day => {
          const dayData = data[day];
          if (!dayData) return;

          const row = weeklyContainer.querySelector(`.weekly-row[data-day="${day}"]`);
          if (!row) return;
          
          // 選択状態のクラスを付与
          row.classList.add(`selected-${dayData.label.replace(/\s/g, '-')}`);

          // ボタンをアクティブに
          const btn = row.querySelector(`.opt-btn[data-label="${dayData.label}"]`);
          if (btn) btn.classList.add('active');

          // 詳細入力欄の処理
          const detailInput = row.querySelector('.weekly-detail-input');
          const optionConfig = item.options.find(opt => opt.label === dayData.label);
          if (detailInput && optionConfig?.hasDetail) {
            detailInput.style.display = 'block';
            detailInput.value = dayData.detail || '';
          }
        });
      } else {
        updateDisplay(item.key, data.val || (data.type === "other" ? "" : ""), data.icon || data.emoji);
        if (data.type === "other") {
          const text = document.getElementById(`text-${item.key}`);
          if (text) {
            text.value = data.val;
            text.classList.add('visible');
          }
        }
        const box = document.getElementById(`display-${item.key}`)?.closest('.work-item-box');
        if (box) {
            const btns = box.querySelectorAll('.opt-btn');
            btns.forEach(btn => {
                const btnLabel = btn.querySelector('.label');
                if (btnLabel && (btnLabel.textContent === data.val || (data.type === "other" && btnLabel.textContent === item.textLabel))) {
                    btn.classList.add('active');
                }
            });
        }
      }
    });
  }
});
