let currentRecord = null;
let currentDateStr = null;
const USER_ID = "testUser"; // 全域 user id // 之後可改成登入者id
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

    fetch("https://feeling-dairy.onrender.com/api/submit-mood", {
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
        // 檢查是否是今天的日期
        const todayStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
        
        if (dateStr === todayStr) {
          // 如果是今天，顯示更具體的消息
          if (data.isNew) {
            alert("今日心情已記錄！"); 
          } else {
            alert("今日心情已更新！");
          }
        } else {
          // 如果不是今天，顯示一般消息
          alert(data.message || "心情已更新！");
        }
        
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
    const moodSlider = document.getElementById("mood-slider");
    const moodLevel = moodSlider ? moodSlider.value : '5';
    const content = document.querySelector(".record-textarea").value;

    //組成物件
    const data = { date, weather, moodLevel: parseInt(moodLevel), content, user: "testUser"  };

    //test
    if (!date || !weather || !moodLevel || !content) {
      alert("請完整填寫所有欄位！");
      return;
    }

    //傳送到雲端
    fetch("https://feeling-dairy.onrender.com/api/saveRecord", {
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
    date: dateStr,
    user: "testUser", // 新增這行
  };

  // 送到後端
  fetch('https://feeling-dairy.onrender.com/api/Tomorrow', {
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
  fetch(`https://feeling-dairy.onrender.com/api/month-moods?year=${year}&month=${String(month).padStart(2, '0')}`)
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
            fetch(`https://feeling-dairy.onrender.com/api/getRecord?date=${dateStr}&user=${USER_ID}`)
              .then(res => res.json())
              .then(record => {
                // 顯示記錄內容
                showMoodSelect(record, dateStr);
              });
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
  slider.value = record?.moodLevel || 5;

  // 天氣按鈕
  document.querySelectorAll('.weather-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.textContent.trim() === (record?.weather || '')) {
      btn.classList.add('selected');
    }
  });
}

// 心情對應圖檔和顏色
function getMoodData(mood) {
  switch (mood) {
    case '開心': 
      return {
        image: 'images/happy.gif',
        gradient: 'linear-gradient(180deg, #ff6767, #ffd1d1)',
        primaryColor: '#ff6767',
        secondaryColor: '#ffd1d1'
      };
    case '興奮': 
      return {
        image: 'images/excited.gif',
        gradient: 'linear-gradient(180deg, #ff9869, #ffd2bd)',
        primaryColor: '#ff9869',
        secondaryColor: '#ffd2bd'
      };
    case '幸福': 
      return {
        image: 'images/blessed.gif',
        gradient: 'linear-gradient(180deg, #ffda6a, #fff7de)',
        primaryColor: '#ffda6a',
        secondaryColor: '#fff7de'
      };
    case '傷心': 
      return {
        image: 'images/sad.gif',
        gradient: 'linear-gradient(180deg, #7cce6b, #d8ffd0)',
        primaryColor: '#7cce6b',
        secondaryColor: '#d8ffd0'
      };
    case '焦慮': 
      return {
        image: 'images/anxious.gif',
        gradient: 'linear-gradient(180deg, #84a9ff, #f5f8ff)',
        primaryColor: '#84a9ff',
        secondaryColor: '#f5f8ff'
      };
    case '生氣': 
      return {
        image: 'images/angry.gif',
        gradient: 'linear-gradient(180deg, #f093ff, #fdf1ff)',
        primaryColor: '#f093ff',
        secondaryColor: '#fdf1ff'
      };
    default: 
      return {
        image: 'images/happy.gif',
        gradient: 'linear-gradient(180deg, #ff6767, #ffd1d1)',
        primaryColor: '#ff6767',
        secondaryColor: '#ffd1d1'
      };
  }
}

// 為了向後兼容，保留原來的函數
function getMoodImg(mood) {
  return getMoodData(mood).image;
}

// 獲取心情顏色的便捷函數
function getMoodColor(mood) {
  return getMoodData(mood).primaryColor;
}

// 獲取心情漸層的便捷函數
function getMoodGradient(mood) {
  return getMoodData(mood).gradient;
}

// 根據 moodLevel 推斷對應的心情名稱
function getMoodNameFromLevel(moodLevel) {
  const level = parseInt(moodLevel);
  // 將 0-10 的數值對應到心情名稱
  if (level >= 9) return '興奮';
  if (level >= 7) return '開心'; 
  if (level >= 6) return '幸福';
  if (level >= 4) return '焦慮';
  if (level >= 2) return '傷心';
  return '生氣';
}

// 根據心情名稱獲取對應的 moodLevel
function getLevelFromMoodName(moodName) {
  switch (moodName) {
    case '興奮': return 10;
    case '開心': return 8;
    case '幸福': return 6;
    case '焦慮': return 4;
    case '傷心': return 3;
    case '生氣': return 1;
    default: return 5;
  }
}

// 更新日期選擇器背景顏色
function updateDateSelectorColors(year, month) {
  console.log('updateDateSelectorColors - updating for year:', year, 'month:', month);
  
  // 返回 Promise 讓調用者知道更新何時完成
  return new Promise((resolve, reject) => {
    // 重新獲取該月的心情數據並更新背景
    const monthStr = String(month).padStart(2, '0');
    fetch(`https://feeling-dairy.onrender.com/api/month-moods?year=${year}&month=${monthStr}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(moodData => {
        console.log('updateDateSelectorColors - received mood data:', moodData);
        
        // 更新所有日期元素的背景
        const dateItems = document.querySelectorAll('.date-item');
        dateItems.forEach((item, index) => {
          const day = index + 1; // 使用索引來確定日期，因為 textContent 可能包含圖片等其他內容
          const moodEntry = moodData.find(entry => entry.date === day);
          
          // 移除現有的心情類別
          item.classList.remove('has-mood');
          item.removeAttribute('data-mood');
          
          if (moodEntry && moodEntry.mood) {
            // 有心情記錄，重建日期項目結構
            item.classList.add('has-mood');
            item.setAttribute('data-mood', moodEntry.mood);
            
            // 清空內容並重建
            item.innerHTML = '';
            
            // 創建心情圖片
            const img = document.createElement('img');
            img.src = getMoodImg(moodEntry.mood);
            img.alt = moodEntry.mood;
            img.style.width = '40px';
            img.style.height = '40px';
            img.style.display = 'block';
            img.style.margin = '0 auto 4px auto';
            item.appendChild(img);
            
            // 創建日期數字
            const num = document.createElement('div');
            num.textContent = day;
            num.style.fontSize = '14px';
            num.style.color = '#64574c';
            item.appendChild(num);
            
            console.log(`updateDateSelectorColors - updated day ${day} with mood: ${moodEntry.mood}`);
          } else {
            // 沒有心情記錄，只顯示日期數字
            item.innerHTML = '';
            item.textContent = day;
          }
          
          // 重新綁定點擊事件
          item.onclick = () => {
            const dateStr = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
            // 發送請求取得該天記錄
            fetch(`https://feeling-dairy.onrender.com/api/getRecord?date=${dateStr}&user=${USER_ID}`)
              .then(res => res.json())
              .then(record => {
                // 顯示記錄內容
                showMoodSelect(record, dateStr);
              })
              .catch(error => {
                console.error('Error fetching record:', error);
              });
          };
        });
        
        console.log('updateDateSelectorColors - update completed');
        resolve(); // 更新完成
      })
      .catch(error => {
        console.error('updateDateSelectorColors - error:', error);
        reject(error);
      });
  });
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

   // 顯示 mood-select
  const moodSelect2 = document.getElementById('mood-select2');
  document.getElementById('mood-select2').classList.add('show');
  moodSelect2.style.display = 'flex';

  // 隱藏其他主區塊
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('mood-of-date').style.display = 'none';
  document.getElementById('today-record2').style.display = 'none';
  document.getElementById('tomorrow-block').style.display = 'none';

  // 先全部移除 selected
  moodSelect2.querySelectorAll('.mood-item').forEach(item => {
    item.classList.remove('selected');
    item.style.pointerEvents = 'none'; // 禁止點選
    item.style.opacity = '0.5'; // 灰階顯示
  });

  // 自動鎖定當日心情
  let moodToSelect = record && record.mood ? record.mood : null;
  console.log('showMoodSelect - record:', record);
  console.log('showMoodSelect - moodToSelect:', moodToSelect);
  console.log('showMoodSelect - dateStr:', dateStr);
  
  if (moodToSelect) {
    const selected = moodSelect2.querySelector(`.mood-item[data-mood="${moodToSelect}"]`);
    console.log('showMoodSelect - selected element:', selected);
    console.log('showMoodSelect - available mood items:', moodSelect2.querySelectorAll('.mood-item'));
    
    if (selected) {
      selected.classList.add('selected');
      selected.style.pointerEvents = 'auto';
      selected.style.opacity = '1';
      console.log('showMoodSelect - successfully selected mood:', moodToSelect);
    } else {
      console.log('showMoodSelect - no matching mood item found for:', moodToSelect);
    }
  } else {
    console.log('showMoodSelect - no mood to select');
  }

  // 只有點擊「修改」按鈕才進入編輯模式
  document.getElementById('edit-mood-btn').disabled = false;
  document.getElementById('edit-mood-btn').onclick = () => {
    // 進入編輯模式，全部 mood-item 可點選
    moodSelect2.querySelectorAll('.mood-item').forEach(item => {
      item.style.pointerEvents = 'auto';
      item.style.opacity = '1';
    });
    // 啟用確認按鈕
    document.getElementById('enter-mood-btn').disabled = false;
  };

  // 點擊「確認」才送出修改
  document.getElementById('enter-mood-btn').onclick = () => {
    console.log('enter-mood-btn clicked');
    const selected = moodSelect2.querySelector('.mood-item.selected');
    console.log('selected mood item:', selected);
    
    if (selected) {
      const newMood = selected.dataset.mood;
      console.log('newMood:', newMood);
      
      // 更新 record 物件
      if (!record) record = {};
      record.mood = newMood;
      
      // 根據心情名稱推斷對應的 moodLevel
      const inferredMoodLevel = getLevelFromMoodName(newMood);
      record.moodLevel = inferredMoodLevel;
      
      console.log('mood-select2 - saving mood:', newMood, 'for date:', dateStr);
      console.log('inferred moodLevel from mood', newMood, ':', inferredMoodLevel);
      console.log('record object:', record);
      console.log('USER_ID:', USER_ID);
      
      // 同時發送到 Mood 和 Record API
      const moodData = {
        user: USER_ID,
        mood: newMood,
        date: dateStr,
        time: new Date().toISOString()
      };
      
      const recordData = {
        ...record,
        mood: newMood,
        moodLevel: inferredMoodLevel, // 添加 moodLevel
        date: dateStr,
        user: USER_ID
      };
      
      console.log('moodData to send:', moodData);
      console.log('recordData to send:', recordData);
      
      // 發送心情資料到 Mood API
      fetch('https://feeling-dairy.onrender.com/api/submit-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moodData),
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Mood API error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(moodResult => {
        console.log('mood-select2 - mood saved:', moodResult);
        
        // 同時更新 Record
        return fetch('https://feeling-dairy.onrender.com/api/saveRecord', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recordData),
        });
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Record API error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(recordResult => {
        console.log('mood-select2 - record saved:', recordResult);
        
        // 更新 currentRecord
        currentRecord = { ...currentRecord, mood: newMood };
        
        // 更新日期選擇器背景顏色，然後顯示成功訊息
        if (dateStr) {
          const dateMatch = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (dateMatch) {
            const [, day, month, year] = dateMatch;
            // 等待更新完成後再顯示成功訊息
            updateDateSelectorColors(parseInt(year), parseInt(month))
              .then(() => {
                alert('心情已更新！');
                // 回到檢視模式
                showMoodSelect(currentRecord, dateStr);
                document.getElementById('enter-mood-btn').disabled = true;
              })
              .catch(error => {
                console.error('Date selector update error:', error);
                // 即使更新失敗，也要顯示成功訊息和回到檢視模式
                alert('心情已更新！');
                showMoodSelect(currentRecord, dateStr);
                document.getElementById('enter-mood-btn').disabled = true;
              });
          } else {
            // 如果日期格式不正確，直接顯示成功訊息
            alert('心情已更新！');
            showMoodSelect(currentRecord, dateStr);
            document.getElementById('enter-mood-btn').disabled = true;
          }
        } else {
          // 如果沒有 dateStr，直接顯示成功訊息
          alert('心情已更新！');
          showMoodSelect(currentRecord, dateStr);
          document.getElementById('enter-mood-btn').disabled = true;
        }
      })
      .catch(error => {
        console.error('mood-select2 save error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        alert(`儲存失敗：${error.message}\n請檢查網路連線和控制台錯誤訊息`);
      });
    } else {
      alert('請先選擇心情');
    }
  };

  // 綁定點擊事件（只在 pointerEvents 為 auto 時才可切換）
  moodSelect2.querySelectorAll('.mood-item').forEach(item => {
    item.onclick = function() {
      if (this.style.pointerEvents === 'auto') {
        moodSelect2.querySelectorAll('.mood-item').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
      }
    };
  });

  // 為 next-mood-btn 添加點擊事件
  document.getElementById('next-mood-btn').onclick = () => {
    showTodayRecord2(currentRecord, currentDateStr);
  };

  // 為 next-mood-btn2 添加點擊事件
  document.getElementById('next-mood-btn2').onclick = () => {
    showTomorrowBlock2(currentRecord, currentDateStr);
  };
}

// 顯示 today-record2 頁面的函數
function showTodayRecord2(record, dateStr) {
  console.log('showTodayRecord2 - record:', record);
  console.log('showTodayRecord2 - dateStr:', dateStr);

  // 如果沒有 record 或 record 不完整，重新獲取數據
  if (!record || (!record.moodLevel && !record.content && !record.weather)) {
    console.log('showTodayRecord2 - incomplete record, fetching from API');
    fetch(`https://feeling-dairy.onrender.com/api/getRecord?date=${dateStr}&user=${USER_ID}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(fetchedRecord => {
        console.log('showTodayRecord2 - fetched record:', fetchedRecord);
        // 更新 currentRecord
        currentRecord = fetchedRecord;
        // 遞迴調用自己，這次有完整數據
        showTodayRecord2(fetchedRecord, dateStr);
      })
      .catch(error => {
        console.error('showTodayRecord2 - fetch error:', error);
        // 即使獲取失敗，也顯示頁面（使用空數據）
        showTodayRecord2Internal({}, dateStr);
      });
    return;
  }

  showTodayRecord2Internal(record, dateStr);
}

// 內部實現函數
function showTodayRecord2Internal(record, dateStr) {
  console.log('showTodayRecord2Internal - record:', record);
  console.log('showTodayRecord2Internal - dateStr:', dateStr);

  // 隱藏其他所有區塊
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('mood-select').style.display = 'none';
  document.getElementById('mood-select2').style.display = 'none';
  document.getElementById('today-record').style.display = 'none';
  document.getElementById('tomorrow-block').style.display = 'none';
  document.getElementById('mood-of-date').style.display = 'none';

  // 顯示 today-record2 區塊
  const todayRecord2 = document.getElementById('today-record2');
  todayRecord2.style.display = 'flex';
  setTimeout(() => todayRecord2.classList.add('show'), 10);

  // 填入日期資料
  const dateElem = todayRecord2.querySelector('.record-date');
  if (dateElem) {
    dateElem.textContent = dateStr;
  }

  // 填入天氣資料
  const weatherBtns = todayRecord2.querySelectorAll('.weather-btn');
  weatherBtns.forEach(btn => {
    btn.classList.remove('selected');
    if (record && record.weather && btn.textContent.trim() === record.weather) {
      btn.classList.add('selected');
    }
  });

  // 填入心情指數（滑桿）
  const moodSlider = todayRecord2.querySelector('#mood-slider2');
  if (moodSlider) {
    let sliderValue = 5; // 預設值
    
    // 修復：檢查 record 和 record.moodLevel 是否存在
    if (record && record.moodLevel !== undefined && record.moodLevel !== null) {
      // 確保是數字
      const parsedValue = parseInt(record.moodLevel);
      if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 10) {
        sliderValue = parsedValue;
      }
    }
    
    console.log('showTodayRecord2Internal - 設定滑桿值:', sliderValue);
    console.log('showTodayRecord2Internal - record.moodLevel:', record?.moodLevel);
    moodSlider.value = sliderValue;
    
    // 立即更新貓咪位置
    setupRecord2CatAnimation();
    
    // 等待一小段時間後再觸發滑桿更新
    setTimeout(() => {
      const event = new Event('input', { bubbles: true });
      moodSlider.dispatchEvent(event);
    }, 50);
  }

  // 填入內容
  const textarea = todayRecord2.querySelector('.record-textarea');
  if (textarea) {
    textarea.value = record && record.content ? record.content : '';
  }

  // 設定貓咪動畫
  setupRecord2CatAnimation();

  // 綁定天氣按鈕點擊事件
  weatherBtns.forEach(btn => {
    btn.onclick = function() {
      weatherBtns.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    };
  });

  // 設定修改和確認按鈕功能
  setupRecord2Buttons(record, dateStr);
}

// 設定 today-record2 的按鈕功能
function setupRecord2Buttons(record, dateStr) {
  const editBtn = document.getElementById('edit-record-btn2');
  const confirmBtn = document.getElementById('enter-record-btn2');
  const todayRecord2 = document.getElementById('today-record2');

  // 初始狀態：只有修改按鈕可用
  if (editBtn) editBtn.disabled = false;
  if (confirmBtn) confirmBtn.disabled = true;

  // 初始狀態：所有輸入元素都是只讀的
  setRecord2Editable(false);

  // 修改按鈕點擊事件
  if (editBtn) {
    editBtn.onclick = () => {
      // 進入編輯模式
      setRecord2Editable(true);
      editBtn.disabled = true;
      if (confirmBtn) confirmBtn.disabled = false;
    };
  }

  // 確認按鈕點擊事件
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      console.log('record2 confirm button clicked');
      
      // 收集資料
      const date = todayRecord2.querySelector('.record-date').textContent;
      const weather = todayRecord2.querySelector('.weather-btn.selected')?.textContent || '';
      const moodSlider = todayRecord2.querySelector('#mood-slider2');
      const moodLevel = moodSlider ? moodSlider.value : '5';
      const content = todayRecord2.querySelector('.record-textarea').value;

      console.log('record2 collected data:', { date, weather, moodLevel, content });
      console.log('USER_ID:', USER_ID);

      // 組成資料物件
      const parsedMoodLevel = parseInt(moodLevel);
      const inferredMood = getMoodNameFromLevel(parsedMoodLevel);
      
      const data = { 
        date, 
        weather, 
        moodLevel: parsedMoodLevel, // 確保是數字
        content, 
        user: USER_ID,
        mood: inferredMood // 根據 moodLevel 推斷心情名稱
      };

      console.log('record2 saving data:', data);
      console.log('inferred mood from level', parsedMoodLevel, ':', inferredMood);

      // 首先更新 Mood 模型
      const moodData = {
        user: USER_ID,
        mood: inferredMood,
        date: date,
        time: new Date().toISOString()
      };

      fetch('https://feeling-dairy.onrender.com/api/submit-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moodData),
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Mood API error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(moodResult => {
        console.log('record2 - mood saved:', moodResult);
        
        // 然後更新 Record 模型
        return fetch('https://feeling-dairy.onrender.com/api/saveRecord', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Record API error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(result => {
        console.log('record2 - record saved:', result);
        
        if (result.success !== false) {
          // 更新 currentRecord
          currentRecord = { ...currentRecord, ...data };
          
          // 更新日期選擇器的背景顏色，然後顯示成功訊息
          if (currentDateStr) {
            const dateMatch = currentDateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
            if (dateMatch) {
              const [, day, month, year] = dateMatch;
              // 等待更新完成後再顯示成功訊息
              updateDateSelectorColors(parseInt(year), parseInt(month))
                .then(() => {
                  alert('記錄已更新！');
                  // 退出編輯模式
                  setRecord2Editable(false);
                  editBtn.disabled = false;
                  confirmBtn.disabled = true;
                })
                .catch(error => {
                  console.error('Date selector update error:', error);
                  // 即使更新失敗，也要顯示成功訊息和退出編輯模式
                  alert('記錄已更新！');
                  setRecord2Editable(false);
                  editBtn.disabled = false;
                  confirmBtn.disabled = true;
                });
            } else {
              // 如果日期格式不正確，直接顯示成功訊息
              alert('記錄已更新！');
              setRecord2Editable(false);
              editBtn.disabled = false;
              confirmBtn.disabled = true;
            }
          } else {
            // 如果沒有 currentDateStr，直接顯示成功訊息
            alert('記錄已更新！');
            setRecord2Editable(false);
            editBtn.disabled = false;
            confirmBtn.disabled = true;
          }
        } else {
          alert('儲存失敗，請稍後再試');
        }
      })
      .catch(err => {
        console.error('Save error:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        alert(`儲存失敗：${err.message}\n請檢查網路連線和控制台錯誤訊息`);
      });
    };
  }
}

// 設定 today-record2 輸入元素的可編輯狀態
function setRecord2Editable(editable) {
  const todayRecord2 = document.getElementById('today-record2');
  
  // 天氣按鈕
  const weatherBtns = todayRecord2.querySelectorAll('.weather-btn');
  weatherBtns.forEach(btn => {
    btn.style.pointerEvents = editable ? 'auto' : 'none';
    btn.style.opacity = editable ? '1' : '0.7';
  });

  // 心情滑桿
  const moodSlider = todayRecord2.querySelector('#mood-slider2');
  if (moodSlider) {
    moodSlider.disabled = !editable;
    moodSlider.style.opacity = editable ? '1' : '0.7';
  }

  // 文字區域
  const textarea = todayRecord2.querySelector('.record-textarea');
  if (textarea) {
    textarea.readOnly = !editable;
    textarea.style.opacity = editable ? '1' : '0.7';
  }
}

// 為 mood-slider2 設定貓咪移動功能
function setupRecord2CatAnimation() {
  const slider = document.getElementById('mood-slider2');
  const catContainer = document.querySelector('#today-record2 .cat-container');
  const cat = document.getElementById('cat-img2');
  
  if (!slider || !catContainer || !cat) return;
  
  function updateCatAndBar2() {
    const catWidth = 36;
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    const val = parseInt(slider.value);
    const percent = (val - min) / (max - min);
    
    // 計算貓的位置（避免超出邊界）
    const sliderWidth = slider.offsetWidth - catWidth;
    const left = percent * sliderWidth;
    catContainer.style.left = `${left}px`;
    
    // 改變滑桿已選區域顏色
    slider.style.background = `linear-gradient(to right, #ffd6a0 0%,rgb(243, 104, 104) ${percent * 100}%, #fff ${percent * 100}%, #fff 100%)`;
  }

  slider.addEventListener('input', updateCatAndBar2);
  window.addEventListener('resize', updateCatAndBar2);
  updateCatAndBar2();
}

// 返回按鈕功能
// 通用的頁面切換函數
function showPage(pageId, addShowClass = true) {
  // 隱藏所有頁面
  const pages = ['cover', 'main-menu', 'mood-select', 'today-record', 'tomorrow-block', 'mood-of-date', 'mood-select2', 'today-record2', 'tomorrow-block2'];
  pages.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.remove('show');
      element.style.display = 'none';
    }
  });
  
  // 顯示指定頁面
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = 'flex';
    if (addShowClass) {
      setTimeout(() => targetPage.classList.add('show'), 10);
    }
  }
}

// 返回按鈕事件處理器
document.addEventListener('DOMContentLoaded', function() {
  // mood-select 返回到 main-menu
  document.getElementById('mood-select-back-btn')?.addEventListener('click', () => {
    showPage('main-menu');
  });

  // today-record 返回到 main-menu
  document.getElementById('today-record-back-btn')?.addEventListener('click', () => {
    showPage('main-menu');
  });

  // tomorrow-block 返回到 main-menu
  document.getElementById('tomorrow-block-back-btn')?.addEventListener('click', () => {
    showPage('main-menu');
  });

  // mood-of-date 返回到 main-menu
  document.getElementById('mood-of-date-back-btn')?.addEventListener('click', () => {
    showPage('main-menu');
  });

  // mood-select2 返回到 mood-of-date
  document.getElementById('mood-select2-back-btn')?.addEventListener('click', () => {
    showPage('mood-of-date');
    // 重新顯示日期選擇器
    setTimeout(() => {
      document.getElementById('date-selector').style.display = 'flex';
      document.getElementById('dairy-subtitle').textContent = '-日期-';
    }, 100);
  });

  // today-record2 返回到 mood-select2
  document.getElementById('today-record2-back-btn')?.addEventListener('click', () => {
    showPage('mood-select2');
  });

  // tomorrow-block2 返回到 today-record2
  document.getElementById('tomorrow-block2-back-btn')?.addEventListener('click', () => {
    showPage('today-record2');
  });
});

// 顯示 tomorrow-block2 頁面的函數
function showTomorrowBlock2(record, dateStr) {
  console.log('showTomorrowBlock2 - record:', record);
  console.log('showTomorrowBlock2 - dateStr:', dateStr);

  // 隱藏所有其他頁面
  const pages = ['cover', 'main-menu', 'mood-select', 'today-record', 'tomorrow-block', 'mood-of-date', 'mood-select2', 'today-record2'];
  pages.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.remove('show');
      element.style.display = 'none';
    }
  });

  // 顯示 tomorrow-block2
  const tomorrowBlock2 = document.getElementById('tomorrow-block2');
  if (tomorrowBlock2) {
    tomorrowBlock2.style.display = 'flex';
    tomorrowBlock2.classList.add('show');
  }

  // 獲取並顯示已保存的明天期望數據
  loadTomorrowData(dateStr);
}

// 獲取並顯示已保存的明天期望數據
async function loadTomorrowData(dateStr) {
  try {
    const response = await fetch(`https://feeling-dairy.onrender.com/api/getTomorrow?date=${dateStr}&user=${USER_ID}`);
    const tomorrowData = await response.json();
    
    console.log('loadTomorrowData - tomorrowData:', tomorrowData);
    
    // 顯示已保存的數據
    displayTomorrowBlock2Data(tomorrowData, dateStr);
    
  } catch (error) {
    console.error('載入明天期望數據失敗:', error);
    // 如果沒有數據，顯示空白狀態
    displayTomorrowBlock2Data({}, dateStr);
  }
}

// 顯示明天期望數據 - 只顯示已保存的卡片和貼紙
function displayTomorrowBlock2Data(tomorrowData, dateStr) {
  const cardListContainer = document.getElementById('tomorrow-block2-card-list');
  const stickerAreaContainer = document.getElementById('tomorrow-block2-sticker-area');
  
  // 清空容器
  if (cardListContainer) cardListContainer.innerHTML = '';
  if (stickerAreaContainer) stickerAreaContainer.innerHTML = '';
  
  // 如果有保存的數據，創建並顯示對應的卡片和貼紙
  if (tomorrowData && tomorrowData.cardType && cardListContainer) {
    console.log('顯示已保存的卡片數據:', tomorrowData);
    
    // 顯示卡片
    const cardElement = createTomorrowBlock2Card(tomorrowData);
    cardListContainer.appendChild(cardElement);
    
    // 顯示貼紙
    if (tomorrowData.stickerType && stickerAreaContainer) {
      // 如果有多個貼紙類型，用逗號分隔
      const stickerTypes = tomorrowData.stickerType.includes(',') 
        ? tomorrowData.stickerType.split(',') 
        : [tomorrowData.stickerType];
      
      stickerTypes.forEach(stickerType => {
        if (stickerType.trim()) {
          const stickerElement = createTomorrowBlock2Sticker(stickerType.trim());
          stickerAreaContainer.appendChild(stickerElement);
        }
      });
    }
  } else if (cardListContainer) {
    // 如果沒有數據，顯示空白提示
    cardListContainer.innerHTML = '<div class="no-data-message">尚未設定明日期望</div>';
  }
  
  // 設定修改和確認按鈕功能
  setupTomorrowBlock2Buttons(tomorrowData, dateStr);
}

// 創建 tomorrow-block2 的卡片元素
function createTomorrowBlock2Card(tomorrowData) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card-item selected';
  cardElement.setAttribute('data-card', tomorrowData.cardType);
  
  // 根據卡片類型設定樣式
  let textareaClass = '';
  switch (tomorrowData.cardType) {
    case '1':
      textareaClass = 'card-textarea-brown';
      cardElement.style.backgroundColor = '#ffd6a0'; // 棕色背景
      break;
    case '2':
      textareaClass = 'card-textarea-black';
      cardElement.style.backgroundColor = '#64574c'; // 黑色背景
      break;
    case '3':
      textareaClass = 'card-textarea-white';
      cardElement.style.backgroundColor = '#FFFFFF'; // 白色背景
      break;
    default:
      textareaClass = 'card-textarea-brown';
      cardElement.style.backgroundColor = '#8B4513';
  }
  
  // 設定卡片基本樣式
  cardElement.style.position = 'relative';
  cardElement.style.width = '450px';
  cardElement.style.height = '300px';
  cardElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  cardElement.style.margin = '10px auto';
  cardElement.style.borderRadius = '24px';
  
  // 創建文字區域
  const textarea = document.createElement('textarea');
  textarea.className = textareaClass;
  textarea.value = tomorrowData.text || '';
  textarea.readOnly = true;
  textarea.style.display = 'block';
  textarea.style.width = '100%';
  textarea.style.height = '100%';
  textarea.style.border = 'none';
  textarea.style.background = 'transparent';
  textarea.style.resize = 'none';
  textarea.style.outline = 'none';
  textarea.style.fontSize = '16px';
  textarea.style.fontFamily = 'inherit';
  textarea.style.color = tomorrowData.cardType === '3' ? '#333' : '#fff';
  textarea.placeholder = '明日期望...';
  
  cardElement.appendChild(textarea);
  
  // 如果有貼紙數據，添加貼紙到卡片上
  if (tomorrowData.stickerType) {
    const stickerTypes = tomorrowData.stickerType.includes(',') 
      ? tomorrowData.stickerType.split(',') 
      : [tomorrowData.stickerType];
    
    stickerTypes.forEach((stickerType, index) => {
      if (stickerType.trim()) {
        const stickerImg = document.createElement('img');
        stickerImg.src = `images/sticker_${getStickerNumber(stickerType.trim())}.png`;
        stickerImg.style.position = 'absolute';
        stickerImg.style.width = '70px';
        stickerImg.style.height = '70px';
        stickerImg.style.right = `${16 + (index * 50)}px`;
        stickerImg.style.bottom = '16px';
        stickerImg.style.zIndex = '10';
        stickerImg.style.pointerEvents = 'none';
        cardElement.appendChild(stickerImg);
      }
    });
  }
  
  return cardElement;
}

// 創建 tomorrow-block2 的貼紙元素
function createTomorrowBlock2Sticker(stickerType) {
  const stickerElement = document.createElement('img');
  stickerElement.className = 'sticker selected show';
  stickerElement.src = `images/sticker_${getStickerNumber(stickerType)}.png`;
  stickerElement.alt = stickerType;
  stickerElement.setAttribute('data-sticker', stickerType);
  stickerElement.style.width = '70px';
  stickerElement.style.height = '70px';
  stickerElement.style.margin = '10px';
  stickerElement.style.opacity = '1';
  stickerElement.style.transform = 'scale(1.1)';
  stickerElement.style.pointerEvents = 'none'; // 在顯示模式下不可點擊
  stickerElement.style.transition = 'opacity 0.3s, transform 0.3s'; // 添加過渡效果
  
  return stickerElement;
}

// 設定 tomorrow-block2 的修改和確認按鈕功能
function setupTomorrowBlock2Buttons(tomorrowData, dateStr) {
  const editBtn = document.getElementById('edit-tomorrow-btn2');
  const enterBtn = document.getElementById('enter-tomorrow-btn2');

  // 根據是否有數據來設定按鈕狀態
  const hasData = tomorrowData && (tomorrowData.cardType || tomorrowData.stickerType);
  
  if (editBtn) {
    editBtn.disabled = !hasData;
    editBtn.style.display = hasData ? 'inline-block' : 'none';
  }
  
  if (enterBtn) {
    enterBtn.disabled = !hasData;
    enterBtn.style.display = hasData ? 'inline-block' : 'none';
  }

  // 修改按鈕功能 - 進入編輯模式
  if (editBtn) {
    editBtn.onclick = () => {
      console.log('進入編輯模式');
      
      // 啟用文字區域編輯
      const textareas = document.querySelectorAll('#tomorrow-block2-card-list textarea');
      textareas.forEach(textarea => {
        textarea.readOnly = false;
        textarea.style.cursor = 'text';
        textarea.style.opacity = '1';
        textarea.style.border = '2px dashed #ccc'; // 顯示編輯狀態
      });
      
      // 貼紙區域保持原狀，但添加視覺提示表示可以選擇性修改
      const stickerArea = document.getElementById('tomorrow-block2-sticker-area');
      if (stickerArea) {
        // 添加一個提示文字
        let editHint = stickerArea.querySelector('.edit-hint');
        if (!editHint) {
          editHint = document.createElement('div');
          editHint.className = 'edit-hint';
          editHint.textContent = '點擊貼紙可重新選擇（可選）';
          editHint.style.cssText = `
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
            font-style: italic;
          `;
          stickerArea.insertBefore(editHint, stickerArea.firstChild);
        }
        
        // 貼紙啟用點擊功能，但保持原有選擇狀態
        const stickers = document.querySelectorAll('#tomorrow-block2-sticker-area .sticker');
        stickers.forEach(sticker => {
          sticker.style.pointerEvents = 'auto';
          sticker.style.cursor = 'pointer';
          sticker.style.opacity = '0.8'; // 稍微降低透明度表示可點擊
          sticker.onclick = function() {
            this.classList.toggle('selected');
            // 更新視覺效果
            if (this.classList.contains('selected')) {
              this.style.opacity = '1';
              this.style.transform = 'scale(1.1)';
            } else {
              this.style.opacity = '0.5';
              this.style.transform = 'scale(1)';
            }
            console.log('貼紙選擇狀態:', this.classList.contains('selected'));
          };
        });
      }
      
      // 修改按鈕狀態
      editBtn.textContent = '取消';
      editBtn.onclick = () => {
        console.log('取消編輯，重新載入數據');
        // 重新載入原始數據
        loadTomorrowData(dateStr);
      };
      
      // 顯示儲存按鈕
      if (enterBtn) {
        enterBtn.textContent = '儲存';
        enterBtn.disabled = false;
        enterBtn.onclick = () => {
          console.log('儲存明天期望數據');
          saveTomorrowData(dateStr);
        };
      }
    };
  }

  // 確認按鈕功能 - 完成檢視，返回心情日記
  if (enterBtn && !editBtn.textContent.includes('取消')) {
    enterBtn.onclick = () => {
      console.log('完成檢視，返回心情日記');
      // 返回到心情日記頁面
      showPage('mood-of-date');
      // 重新顯示日期選擇器
      setTimeout(() => {
        document.getElementById('date-selector').style.display = 'flex';
        document.getElementById('dairy-subtitle').textContent = '-日期-';
      }, 100);
    };
  }
}

// 儲存明天期望數據
async function saveTomorrowData(dateStr) {
  try {
    // 收集卡片資料
    const cardElement = document.querySelector('#tomorrow-block2-card-list .card-item');
    let cardType = '';
    let text = '';
    
    if (cardElement) {
      cardType = cardElement.getAttribute('data-card');
      const textarea = cardElement.querySelector('textarea');
      if (textarea) {
        text = textarea.value.trim();
      }
    }
    
    // 收集已選擇的貼紙資料
    const selectedStickers = document.querySelectorAll('#tomorrow-block2-sticker-area .sticker.selected');
    const stickerTypes = Array.from(selectedStickers).map(sticker => 
      sticker.getAttribute('data-sticker')
    ).filter(type => type); // 過濾掉空值
    
    console.log('儲存資料:', {
      cardType,
      text,
      stickerTypes,
      dateStr
    });

    // 如果沒有選擇任何貼紙，保留原有的貼紙（從原始數據中獲取）
    let finalStickerType = stickerTypes.join(',');
    if (stickerTypes.length === 0) {
      // 嘗試從原始數據中獲取貼紙資訊
      try {
        const response = await fetch(`https://feeling-dairy.onrender.com/api/getTomorrow?date=${dateStr}&user=${USER_ID}`);
        const originalData = await response.json();
        if (originalData && originalData.stickerType) {
          finalStickerType = originalData.stickerType;
          console.log('保留原有貼紙:', finalStickerType);
        }
      } catch (error) {
        console.log('無法獲取原始貼紙數據，將儲存空值');
      }
    }

    // 儲存明日期望資料
    const response = await fetch('https://feeling-dairy.onrender.com/api/Tomorrow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardType,
        text,
        stickerType: finalStickerType,
        date: dateStr,
        user: USER_ID
      })
    });

    const result = await response.json();
    
    if (result.success) {
      alert('明日期望已儲存！');
      // 重新載入數據以顯示更新後的內容
      loadTomorrowData(dateStr);
    } else {
      alert('儲存失敗：' + result.error);
    }
  } catch (error) {
    console.error('儲存失敗:', error);
    alert('儲存失敗，請稍後再試');
  }
}

// 將貼紙類型轉換為對應的數字
function getStickerNumber(stickerType) {
  const stickerMap = {
    'shining': '1',
    'heart': '2',
    'stars_3': '3',
    'flowers': '4',
    'stars_2': '5',
    'butterfly': '6'
  };
  return stickerMap[stickerType] || '1';
}
