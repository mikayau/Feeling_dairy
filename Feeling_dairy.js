let currentRecord = null;
let currentDateStr = null;
// 導覽平滑滾動
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelector(link.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

// 封面動畫
document.getElementById("arrow-btn").addEventListener("click", () => {
  const cover = document.getElementById("cover"); /* 獲取封面元素 */
  const mainMenu = document.getElementById("main-menu"); /* 獲取主菜單元素 */
  cover.classList.add("fade-out"); /* 添加淡出效果 */
  setTimeout(() => {
    cover.style.display = "none"; /* 隱藏封面 */
    mainMenu.classList.add("show");
  }, 700); // 與 CSS transition 時間一致
});

// 今日心情頁面切換
document.getElementById("today_feeling-btn").addEventListener("click", () => {
  const mainMenu = document.getElementById("main-menu"); /* 獲取封面元素 */
  const moodSelect =
    document.getElementById("mood-select"); /* 獲取主菜單元素 */
  mainMenu.classList.add("fade-out"); /* 添加淡出效果 */
  setTimeout(() => {
    mainMenu.style.display = "none"; /* 隱藏封面 */
    moodSelect.style.display = "flex"; /* 保障顯示 */
    setTimeout(() => {
      moodSelect.classList.add("show");
    }, 700);
  }, 700); // 與 CSS transition 時間一致
});

let selectedMood = null; /* 初始化選擇的心情為空 */
// 監聽每個 mood-item
document.querySelectorAll(".mood-item").forEach(function (div) {
  div.addEventListener("click", function () {
    // 取消其他選擇
    document
      .querySelectorAll(".mood-item")
      .forEach((d) => d.classList.remove("selected"));
    // 標記目前選擇
    this.classList.add("selected");
    selectedMood = this.dataset.mood;
    // 啟用完成按鈕
    document.getElementById("submit-mood-btn").disabled = false;
  });
});

// 完成按鈕送出
document
  .getElementById("submit-mood-btn")
  .addEventListener("click", function () {
    if (!selectedMood) return;
    // 自動取得今天日期
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${dd}-${mm}-${yyyy}`;

    // 新增這行，送出前先 alert
    // alert(`送出資料：user=testUser, mood=${selectedMood}, date=${dateStr}`);

    fetch("http://localhost:3000/api/submit-mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: "testUser",
        mood: selectedMood,
        time: new Date().toISOString(),
        date: dateStr, // 新增這行
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("心情已經存儲");
        // 跳轉到 mood-select
        document
          .querySelectorAll(".mood-item")
          .forEach((b) => b.classList.remove("selected"));
        document.getElementById("mood-select").style.display = "none"; // 隱藏今日記錄
        const moodSelect = document.getElementById("main-menu");
        moodSelect.style.display = "flex";
        setTimeout(() => {
          moodSelect.classList.add("show");
        }, 10); // 觸發動畫（如有）
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

// 日期同步
document.getElementById("today_record-btn").addEventListener("click", () => {
  const mainMenu = document.getElementById("main-menu"); /* 獲取封面元素 */
  const todayRecord =
    document.getElementById("today-record"); /* 獲取主菜單元素 */
  mainMenu.classList.add("fade-out"); /* 添加淡出效果 */
  setTimeout(() => {
    mainMenu.style.display = "none"; /* 隱藏封面 */
    todayRecord.style.display = "flex"; /* 保障顯示 */
    setTimeout(() => {
      todayRecord.classList.add("show");
    }, 700);
  }, 700); // 與 CSS transition 時間一致
});
// 天氣選定
document.querySelectorAll(".weather-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".weather-btn")
      .forEach((b) => b.classList.remove("selected"));
    this.classList.add("selected");
  });
});

// 取得今天日期並顯示在 .record-date
window.addEventListener("DOMContentLoaded", function () {
  const dateElem = document.getElementById("record-date"); /* 獲取日期元素 */
  const today = new Date();
  // 格式：DD-MM-YYYY
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // 月份補0
  const dd = String(today.getDate()).padStart(2, "0"); // 日期補0
  dateElem.textContent = `${dd}-${mm}-${yyyy}`; // 設定日期格式
});

// 讓貓跟著滑桿移動，並改變已選區域顏色
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("mood-slider");
  const catContainer = document.querySelector(".cat-container"); // 獲取貓容器
  const cat = document.getElementById("cat-img");
  const catWidth = 36; // 獲取貓圖片的寬度

  function updateCatAndBar() {
    const slider = document.getElementById("mood-slider");
    const catContainer = document.querySelector(".cat-container"); // 獲取貓容器
    const catWidth = 36;
    const min = parseInt(slider.min); // 獲取滑桿最小值
    const max = parseInt(slider.max); // 獲取滑桿最大值
    const val = parseInt(slider.value); // 獲取滑桿當前值
    const percent = (val - min) / (max - min);
    // 計算貓的位置（避免超出邊界）
    const sliderWidth = slider.offsetWidth - catWidth;
    const left = percent * sliderWidth;
    catContainer.style.left = `${left}px`;
    // 改變滑桿已選區域顏色
    slider.style.background = `linear-gradient(to right, #ffd6a0 0%,rgb(243, 104, 104) ${percent * 100
      }%, #fff ${percent * 100}%, #fff 100%)`;
  }

  slider.addEventListener("input", updateCatAndBar); // 當滑桿值改變時更新貓和已選區域
  window.addEventListener("resize", updateCatAndBar); // 視窗縮放時也更新
  updateCatAndBar();
});

//送出按鈕事件
document
  .querySelector(".record-submit-btn")
  .addEventListener("click", function () {
    //取得資料
    const date = document.querySelector(".record-date").textContent;
    const weather = document.querySelector(".weather-btn.selected")?.textContent || "";
    const mood = document.getElementById("mood-slider").value;
    const content = document.querySelector(".record-textarea").value;

    //組成物件
    const data = { date, weather, mood, content };

    //test
    if (!date || !weather || !mood || !content) {
      alert("請完整填寫所有欄位！");
      return;
    }

    //傳送到雲端
    fetch("http://localhost:3000/api/saveRecord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        alert("儲存成功！");
        document.getElementById("today-record").classList.remove("show");
        document.getElementById("today-record").style.display = "none"; // 隱藏今日記錄
        //重新reset
        document.querySelector(".record-textarea").value = "";
        document.getElementById("mood-slider").value = 1; // 或預設值
        document
          .querySelectorAll(".weather-btn")
          .forEach((b) => b.classList.remove("selected"));
        // 若有貓動畫也要重設
        //跳轉
        if (typeof updateCatAndBar === "function") updateCatAndBar();
        // 跳轉到 mood-select
        const moodSelect = document.getElementById("main-menu");
        moodSelect.style.display = "flex";
        setTimeout(() => {
          moodSelect.classList.add("show");
        }, 10); // 觸發動畫（如有）
      })
      //失敗message
      .catch((err) => {
        alert("儲存失敗");
        console.error(err);
      });
  });

// 今日心情頁面切換
document.getElementById("tomorrow-btn").addEventListener("click", () => {
  const mainMenu = document.getElementById("main-menu"); /* 獲取封面元素 */
  const tomorrowBlock =
    document.getElementById("tomorrow-block"); /* 獲取主菜單元素 */
  mainMenu.classList.add("fade-out"); /* 添加淡出效果 */
  setTimeout(() => {
    mainMenu.style.display = "none"; /* 隱藏封面 */
    tomorrowBlock.style.display = "flex"; /* 保障顯示 */
    setTimeout(() => {
      tomorrowBlock.classList.add("show");
    }, 700);
  }, 700); // 與 CSS transition 時間一致
});

//卡片選擇與動畫控制
document.querySelectorAll(".card-item").forEach((card) => {
  card.addEventListener("click", function () {
    // 防止重複點擊
    if (card.classList.contains("selected")) return;

    // 1. 先讓被選卡片 bounce
    card.classList.add("bounce");

    // 2.1 其他卡片淡出
    document.querySelectorAll(".card-item").forEach((c) => {
      if (c !== card) c.classList.add("fade-out");
    });
    // 2.2 文字淡出
    document.querySelectorAll(".choose-cards").forEach((c) => {
      if (c !== card) c.classList.add("fade-out");
    });

    // 3. bounce 結束後，滑到右邊
    setTimeout(() => {
      card.classList.remove("bounce");
      card.classList.add("selected");
      // 讓所有卡片都不能再點擊
      document.querySelectorAll('.card-item').forEach(c => c.classList.add('locked'));
      // 顯示該卡片內的 textarea
      const textarea = card.querySelector('textarea');
      if (textarea) textarea.style.display = 'block';
    }, 450); // bounce 動畫時間

    // 4. 卡片滑到右邊後，貼紙一個個淡入
    setTimeout(() => {
      document.querySelectorAll(".sticker").forEach((sticker) => {
        sticker.classList.add("show");
      });
    }, 1200); // 450ms(bounce) + 750ms(滑動)

    // 5. 讓說明文字和按鈕也慢慢出現
    setTimeout(() => {
      document.querySelector(".choose-stickers").classList.add("show");
      document.getElementById("sticker-btn").classList.add("show");
    }, 1200); // 可依貼紙動畫延遲調整
  });
});
// 貼紙點擊選擇與複製到卡片
document.querySelectorAll('.sticker').forEach(sticker => {
  sticker.addEventListener('click', function () {
    const selectedCard = document.querySelector('.card-item.selected');
    if (!selectedCard) return;

    // 如果這個貼紙已經被選中，則取消選取並移除卡片上的貼紙
    if (sticker.classList.contains('selected')) {
      sticker.classList.remove('selected');
      const old = selectedCard.querySelector('.card-sticker');
      if (old) old.remove();
      return;
    }
    // 1. 先移除所有貼紙的 selected 狀態
    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('selected'));
    // 2. 給目前這個貼紙加上 selected
    sticker.classList.add('selected');

    // 3. 複製貼紙到卡片（假設只複製到已選的卡片）
    if (selectedCard) {
      // 先移除卡片上舊的貼紙（如果有的話）
      let old = selectedCard.querySelector('.card-sticker');
      if (old) old.remove();

      // 複製一個新的貼紙 img
      const newSticker = sticker.cloneNode(true);
      newSticker.classList.remove('selected'); // 不要有 hover 效果
      newSticker.classList.add('card-sticker');
      newSticker.style.position = 'absolute';
      newSticker.style.right = '16px';
      newSticker.style.bottom = '16px';
      newSticker.style.transform = 'scale(1.1)';
      newSticker.style.pointerEvents = 'none';

      // 加到卡片裡
      selectedCard.appendChild(newSticker);
    }
  });
});

// 前端收集資料
document.getElementById('sticker-btn').addEventListener('click', function () {
  // 取得被選的卡片，按按鈕
  const selectedCard = document.querySelector('.card-item.selected');
  // 自動取得今天日期
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateStr = `${dd}-${mm}-${yyyy}`;
  if (!selectedCard) {
    alert('請先選擇卡片');
    // 如果沒有選擇到卡片
    return;
  }

  // 取得卡片款式
  const cardType = selectedCard.getAttribute('data-card');

  // 取得輸入文字
  const textarea = selectedCard.querySelector('textarea');
  const text = textarea ? textarea.value : '';

  // 取得貼紙款式（可選）
  const selectedSticker = document.querySelector('.sticker.selected');
  const stickerType = selectedSticker ? selectedSticker.getAttribute('data-sticker') : null;

  // 組成要送出的資料
  const data = {
    cardType: cardType,
    text: text,
    stickerType: stickerType, // 可能為 null
    date: dateStr // 新增這行
  };

  // 送到後端
  fetch('http://localhost:3000/api/Tomorrow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      // 你可以在這裡做導頁或清空表單
      if (result.success) {
        alert('儲存成功！');
        // 跳轉到 main-menu
        const tomorrowBlock = document.getElementById("tomorrow-block");
        const mainMenu = document.getElementById("main-menu");
        tomorrowBlock.style.display = "none";
        mainMenu.style.display = "flex";
        setTimeout(() => {
          mainMenu.classList.add("show");
        }, 10); // 觸發動畫（如有）
      } else {
        alert('儲存失敗，請稍後再試');
      }
    })
    .catch(err => {
      alert('儲存失敗，請檢查網路');
    });
});

// 心情日記
// 顯示
document.getElementById('emotion_dairy-btn').addEventListener('click', function () {
  document.getElementById('main-menu').style.display = 'none';
  const moodOfDate = document.getElementById('mood-of-date');
  moodOfDate.style.display = 'flex';
  setTimeout(() => moodOfDate.classList.add('show'), 10);
  showYearSelector(new Date().getFullYear());
});

// 隱藏
function hideMoodOfDate() {
  const moodOfDate = document.getElementById('mood-of-date');
  moodOfDate.classList.remove('show');
  setTimeout(() => {
    moodOfDate.style.display = 'none';
  }, 700); // 等動畫結束
}

function showYearSelector(currentYear, direction = 0) {
  document.getElementById('record-detail').style.display = 'none';
  switchSelector('year-selector');
  const yearList = document.getElementById('year-list');
  let years = [];
  for (let i = -2; i <= 2; i++) years.push(currentYear + i);

  // 如果第一次進來，先建立5個 year-item
  if (yearList.children.length !== 5) {
    yearList.innerHTML = '';
    years.forEach((y, idx) => {
      const div = document.createElement('div');
      div.className = 'year-item';
      div.textContent = y;
      div.tabIndex = 0;
      div.onclick = () => showMonthSelector(y);
      yearList.appendChild(div);
    });
  }

  // 動畫：先加動畫class
  if (direction !== 0) {
    // 讓所有年份往左或往右滑動
    Array.from(yearList.children).forEach((div) => {
      div.style.transition = 'transform 0.5s, opacity 0.5s, font-size 0.5s, width 0.5s, height 0.5s';
      div.style.transform = `translateX(${direction * -100}%)`;
      div.style.opacity = 0;
    });

    setTimeout(() => {
      // 更新內容與 class
      years.forEach((y, idx) => {
        const div = yearList.children[idx];
        div.textContent = y;
        div.className = 'year-item';
        if (idx === 2) div.classList.add('current');
        else if (Math.abs(idx - 2) === 1) div.classList.add('near');
        else div.classList.add('far');
        div.onclick = () => showMonthSelector(y);
        // 重置動畫
        div.style.transition = 'none';
        div.style.transform = `translateX(${direction * 100}%)`;
        div.style.opacity = 0;
      });

      // 觸發 reflow
      void yearList.offsetWidth;

      // 滑回來
      Array.from(yearList.children).forEach((div) => {
        div.style.transition = 'transform 0.5s, opacity 0.5s, font-size 0.5s, width 0.5s, height 0.5s';
        div.style.transform = 'translateX(0)';
        div.style.opacity = '';
      });
    }, 500);
  } else {
    // 沒動畫直接設 class
    years.forEach((y, idx) => {
      const div = yearList.children[idx];
      div.textContent = y;
      div.className = 'year-item';
      if (idx === 2) div.classList.add('current');
      else if (Math.abs(idx - 2) === 1) div.classList.add('near');
      else div.classList.add('far');
      div.onclick = () => showMonthSelector(y);
      div.style.transition = '';
      div.style.transform = '';
      div.style.opacity = '';
    });
  }

  document.getElementById('year-prev').onclick = () => showYearSelector(currentYear - 1, -1);
  document.getElementById('year-next').onclick = () => showYearSelector(currentYear + 1, 1);

  document.getElementById('dairy-subtitle').textContent = '-年份-';
  document.getElementById('month-selector').style.display = 'none';
  document.getElementById('date-selector').style.display = 'none';
}

// 把產生年份的程式抽出來
function updateYearList(currentYear, yearList) {
  yearList.innerHTML = '';
  const years = [];
  for (let i = -2; i <= 2; i++) years.push(currentYear + i);

  years.forEach(y => {
    const div = document.createElement('div');
    div.className = 'year-item';
    if (y === currentYear) div.classList.add('current');
    else if (Math.abs(y - currentYear) === 1) div.classList.add('near');
    else div.classList.add('far');
    div.textContent = y;
    div.tabIndex = 0;
    div.onclick = () => showMonthSelector(y);
    yearList.appendChild(div);
  });
}

// 切換月份頁
function showMonthSelector(year) {
  document.getElementById('record-detail').style.display = 'none';
  switchSelector('month-selector');
  const monthList = document.getElementById('month-list');
  monthList.innerHTML = '';
  for (let m = 1; m <= 12; m++) {
    const div = document.createElement('div');
    div.className = 'month-item';
    div.textContent = m;
    div.onclick = () => showDateSelector(year, m);
    monthList.appendChild(div);
  }
  document.getElementById('year-selector').style.display = 'none';
  setTimeout(() => {
    document.getElementById('month-selector').style.display = 'flex';
    document.getElementById('date-selector').style.display = 'none';
    document.getElementById('dairy-subtitle').textContent = '-月份-';
  }, 0); // 0秒動畫間隔
}

// 切換日期頁
function showDateSelector(year, month) {
  document.getElementById('record-detail').style.display = 'none'; // <--- 新增這行
  switchSelector('date-selector');
  const dateList = document.getElementById('date-list');
  dateList.innerHTML = '';
  // 計算這個月有幾天
  const days = new Date(year, month, 0).getDate();

  // 取得該月所有心情紀錄
  fetch(`http://localhost:3000/api/month-moods?year=${year}&month=${String(month).padStart(2, '0')}`)
    .then(res => res.json())
    .then(moodData => {
        for (let d = 1; d <= days; d++) {
          const div = document.createElement('div');
          div.className = 'date-item';
          // 檢查這天有沒有紀錄
          const moodObj = moodData.find(m => m.date === d);
          if (moodObj) {
            // 根據心情加上 class 或 data 屬性
            div.classList.add('has-mood');
            div.setAttribute('data-mood', moodObj.mood); // 例如 data-mood="開心"
            // 有紀錄，顯示心情圖案
            const img = document.createElement('img');
            img.src = getMoodImg(moodObj.mood);
            img.alt = moodObj.mood;
            img.style.width = '40px';
            img.style.height = '40px';
            img.style.display = 'block';
            img.style.margin = '0 auto 4px auto';
            // 把圖片放進span
            div.innerHTML = '';
            div.appendChild(img);
            // 日期數字（小字）
            const num = document.createElement('div');
            num.textContent = d;
            num.style.fontSize = '14px';
            num.style.color = '#64574c';
            div.appendChild(num);
          } else {
            div.textContent = d;
          }
          // 點選日期時，取得該天資料
          div.onclick = () => {
            const dateStr = `${String(d).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
            // 發送請求取得該天記錄
            fetch(`http://localhost:3000/api/getRecord?date=${dateStr}`)
              .then(res => res.json())
              .then(record => {
                // 顯示記錄內容
                showMoodSelect(record, dateStr);
              })
          };
          dateList.appendChild(div);
        }
      });

  document.getElementById('month-selector').style.display = 'none';
  setTimeout(() => {
    document.getElementById('date-selector').style.display = 'flex';
    document.getElementById('dairy-subtitle').textContent = '-日期-';
  }, 0);
}

// 顯示日期選擇器
function showRecordModal(record, dateStr) {
  // 隱藏所有主區塊
  document.getElementById('cover').style.display = 'none';
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('mood-select').style.display = 'none';
  document.getElementById('tomorrow-block').style.display = 'none';
  document.getElementById('mood-of-date').style.display = 'none';

  // 顯示今日記錄區塊
  const todayRecord = document.getElementById('today-record');
  document.getElementById('today-record').classList.add('show');
  todayRecord.style.display = 'flex';

  // 防呆：確保元素存在
  const dateElem = document.querySelector('.record-date');
  const textarea = document.querySelector('.record-textarea');
  const slider = document.getElementById('mood-slider');
  if (!dateElem || !textarea || !slider) {
    alert('today-record 區塊缺少必要元素，請檢查 HTML');
    return;
  }

  // 填入資料
  dateElem.textContent = dateStr;
  textarea.value = record?.content || '';
  slider.value = record?.mood || 1;

  // 天氣按鈕
  document.querySelectorAll('.weather-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.textContent.trim() === (record?.weather || '')) {
      btn.classList.add('selected');
    }
  });
}

// 心情對應圖檔
function getMoodImg(mood) {
  switch (mood) {
    case '開心': return 'images/happy.gif';
    case '興奮': return 'images/excited.gif';
    case '幸福': return 'images/blessed.gif';
    case '傷心': return 'images/sad.gif';
    case '焦慮': return 'images/anxious.gif';
    case '生氣': return 'images/angry.gif';
    default: return 'images/happy.gif';
  }
}

// 動畫切換函式
function switchSelector(showId) {
  ['year-selector', 'month-selector', 'date-selector'].forEach(id => {
    const el = document.getElementById(id);
    if (id === showId) {
      el.classList.remove('hide');
      el.style.display = 'flex';
      setTimeout(() => el.classList.add('show'), 10);
    } else if (el.style.display !== 'none') {
      el.classList.remove('show');
      el.classList.add('hide');
      setTimeout(() => { el.style.display = 'none'; }, 500);
    } else {
      el.classList.remove('show', 'hide');
      el.style.display = 'none';
    }
  });
}

// 顯示心情選擇器
// 這個函式會在點選日期時被呼叫
function showMoodSelect(record, dateStr) {
  currentRecord = record;
  currentDateStr = dateStr;
  // 隱藏其他主區塊
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('mood-of-date').style.display = 'none';
  document.getElementById('today-record2').style.display = 'none';
  document.getElementById('tomorrow-block').style.display = 'none';

  // 顯示 mood-select
  const moodSelect = document.getElementById('mood-select2');
  document.getElementById('mood-select2').classList.add('show');
  moodSelect.style.display = 'flex';

    // 預設檢視模式
  setMoodViewMode(false);

  // 如果有資料，預選心情
  const moodItems = moodSelect2.querySelectorAll('.mood-item');
  if (record && record.mood) {
    moodItems.forEach(item => {
      item.classList.toggle('selected', item.dataset.mood === record.mood);
    });
    document.getElementById('next-mood-btn').disabled = false;
  } else {
    moodItems.forEach(item => item.classList.remove('selected'));
    document.getElementById('next-mood-btn').disabled = true;
  }

  // 綁定「下一頁」按鈕
  document.getElementById('next-mood-btn').onclick = () => {
    const selectedMood = moodSelect2.querySelector('.mood-item.selected')?.dataset.mood || '';
    currentRecord = currentRecord || {};
    currentRecord.mood = selectedMood;
    showTodayRecord(currentRecord, currentDateStr);
  };

  // 綁定「修改」按鈕
  document.getElementById('edit-mood-btn').onclick = () => setMoodViewMode(true);

  // 綁定「確認」按鈕
  document.getElementById('enter-mood-btn').onclick = () => setMoodViewMode(false);
}

// 顯示今日記錄區塊
// 這個函式會在點選日期時被呼叫
function showTodayRecord(record, dateStr) {
  currentRecord = record;
  currentDateStr = dateStr;
  // 隱藏其他主區塊
  document.getElementById('mood-select2').style.display = 'none';
  document.getElementById('tomorrow-block').style.display = 'none';

  // 顯示 today-record
  const todayRecord = document.getElementById('today-record2');
  document.getElementById('today-record2').classList.add('show');
  todayRecord.style.display = 'flex';

  // 填入資料
  document.getElementById('record-date').textContent = dateStr;
  document.getElementById('mood-slider').value = record.mood || 0;
  document.querySelector('.record-textarea').value = record.content || '';
  // 天氣
  document.querySelectorAll('.weather-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.textContent.trim() === (record.weather || ''));
  });

  // 綁定「完成」按鈕
  document.querySelector('.record-submit-btn').onclick = () => {
    // 取得最新內容
    record.weather = document.querySelector('.weather-btn.selected')?.textContent || '';
    record.mood = document.getElementById('mood-slider').value;
    record.content = document.querySelector('.record-textarea').value;
    // 儲存到後端
    fetch('http://localhost:3000/api/saveRecord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...record, date: dateStr }),
    }).then(() => {
      showTomorrowBlock(record, dateStr);
    });
  };
}


