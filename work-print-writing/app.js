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
    }
  ];

  // --- 状態管理 ---
  let appData = {
    class: "",
    number: "",
    name: "",
    values: {},
    enabledKeys: CONFIG.map(c => c.key) // Default all enabled
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

  // --- 初期化 ---
  loadData();
  renderSettingsItems();
  renderWorkItems();
  updateInputsFromData();

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

  document.getElementById('btn-print').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('btn-save-pdf').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const target = document.getElementById('printable-area');

    // PDF保存用に一時的に影を消す
    target.style.boxShadow = 'none';

    html2canvas(target, {
      scale: 2, // 解像度を上げる
      useCORS: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // A4のアスペクト比 (210:297)
      const pdfAspectRatio = pdfWidth / pdfHeight;
      // canvasのアスペクト比
      const canvasAspectRatio = canvasWidth / canvasHeight;

      let imgWidth, imgHeight;

      // canvasのアスペクト比がA4より縦長の場合、幅を基準に合わせる
      if (canvasAspectRatio > pdfAspectRatio) {
        imgWidth = pdfWidth;
        imgHeight = imgWidth / canvasAspectRatio;
      } else { // A4より横長の場合、高さを基準に合わせる
        imgHeight = pdfHeight;
        imgWidth = imgHeight * canvasAspectRatio;
      }
      
      // 中央に配置するための座標計算
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save('worksheet.pdf');

      // 元のスタイルに戻す
      target.style.boxShadow = '';
    });
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
      const box = document.createElement('div');
      box.className = 'work-item-box';

      const h4 = document.createElement('h4');
      h4.textContent = item.label;
      box.appendChild(h4);

      // 大きな表示エリア
      const displayContainer = document.createElement('div');
      displayContainer.className = 'selected-display';
      displayContainer.id = `display-${item.key}`;
      displayContainer.innerHTML = '<p class="text">えらんでね</p>';
      box.appendChild(displayContainer);

      // ボタンのグリッド
      const grid = document.createElement('div');
      grid.className = 'options-grid';

      item.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        if (appData.values[item.key] && appData.values[item.key].val === opt.label) {
          btn.classList.add('active');
        }
        
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
        if (appData.values[item.key] && appData.values[item.key].type === "other") {
          otherBtn.classList.add('active');
        }
        
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
      workItemsContainer.appendChild(box);
    });
  }

  function selectOption(item, label, iconOrEmoji) {
    const isOther = label === "__OTHER__";
    
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
        if (!parsed.enabledKeys) {
          parsed.enabledKeys = CONFIG.map(c => c.key);
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
      if (data) {
        updateDisplay(item.key, data.val || (data.type === "other" ? "" : ""), data.icon || data.emoji);
        if (data.type === "other") {
          const text = document.getElementById(`text-${item.key}`);
          if (text) {
            text.value = data.val;
            text.classList.add('visible');
          }
        }
      }
    });
  }
});
