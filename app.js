//基本設定
const express = require('express'); /* eslint-disable-line no-unused-vars */
const mongoose = require('mongoose');/* eslint-disable-line no-unused-vars */
const bodyParser = require('body-parser');
const cors = require('cors'); /* eslint-disable-line no-unused-vars */

const app = express();
app.use(cors());/*讓前端能跨域存取*/
app.use(express.json()); /*解析json格式的請求體*/
app.use(bodyParser.json()); 

//連接到MongoDB數據庫
mongoose.connect('mongodb://localhost:27017/feeling')/*連接到MongoDB數據庫feeling*/

//定義心情模型,定義資料結構
/*心情模型包含用戶名、心情和時間戳*/
const moodSchema = new mongoose.Schema({
    user: String, /*用戶名*/
    mood: String, /*心情*/
    time: { type: Date, default: Date.now }, /*時間戳*/
    date: String // 新增這行
});

const Mood = mongoose.model('Mood', moodSchema); /*創建Mood模型*/

//存儲心情
app.post('/api/submit-mood', async (req, res) => {
    console.log('收到資料:', req.body); // 新增這行
    const { user, mood, date } = req.body; /*從請求體中獲取用戶名和心情*/
    if (!user || !mood || !date) { /*檢查用戶名、心情和日期是否存在*/
        return res.status(400).json({ error: '用戶名和心情是必需的' }); /*如果缺少用戶名或心情，返回400錯誤*/
    }
    const newMood = new Mood({ user, mood, date }); /*創建新的Mood實例*/
    await newMood.save(); /*保存到數據庫*/
    res.status(201).json({ message: '心情已提交' }); /*返回成功消息*/
    // Mood.create({ user: 'test', mood: '開心', date: '01-07-2025' });
});


//獲取心情
app.get('/api/moods', async (req, res) => {
    const moods = await Mood.find()
    res.json(moods); /*從數據庫中獲取所有心情並返回*/
});

app.listen(3000, () => console.log('Server on http://localhost:3000')); /*啟動服務器並監聽3000端口*/
// 前端代碼
app.get('/', (req, res) => {
  res.send('伺服器運作正常！');
})

//今日記錄
const recordSchema = new mongoose.Schema({
    date: String,
    weather: String,
    mood: String,
    content: String
});
const Record = mongoose.models.Record || mongoose.model('Record', recordSchema);

// 今日記錄
app.post('/api/saveRecord', async (req, res) => {
    try {
        const record = new Record(req.body);
        await record.save();
        res.json({ success: true });
    } catch (err) {
        console.error('儲存失敗:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//明天期望
const tomorrowSchema = new mongoose.Schema({
    cardType: String,
    text: String,
    stickerType: String,
    date: String // 新增這行
});
const Tomorrow = mongoose.models.Tomorrow || mongoose.model('Tomorrow', tomorrowSchema);

// 明天期望
app.post('/api/Tomorrow', async (req, res) => {
  const { cardType, text, stickerType, date } = req.body; // 加入 date
  try {
    const tomorrow = new Tomorrow({ cardType, text, stickerType, date }); // 一起存
    await tomorrow.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// 查詢某年某月的心情紀錄
app.get('/api/month-moods', async (req, res) => {
  const { year, month } = req.query;
  if (!year || !month) {
    return res.status(400).json({ error: 'year 和 month 必填' });
  }
  // date 格式為 DD-MM-YYYY
  const regex = new RegExp(`-${month.padStart(2, '0')}-${year}$`);
  try {
    const moods = await Mood.find({ date: { $regex: regex } });
    // 只回傳日期與心情
    const result = moods.map(m => {
      const day = parseInt(m.date.split('-')[0], 10);
      return { date: day, mood: m.mood };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 查詢某年某月的今日記錄
function showRecordModal(record, dateStr) {
  const box = document.getElementById('record-detail');
  if (!record || !record.content) {
    box.innerHTML = `<h3>${dateStr}</h3><p>查無記錄</p>`;
  } else {
    box.innerHTML = `
      <h3>${dateStr}</h3>
      <p>天氣：${record.weather}</p>
      <p>心情指數：${record.mood}</p>
      <p>內容：${record.content}</p>
    `;
  }
  box.style.display = 'block';
}

app.get('/api/getRecord', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.json({});
  const record = await Record.findOne({ date });
  res.json(record || {});
});

// 範例 Express 路由
app.post('/api/saveRecord', async (req, res) => {
  const { date, weather, mood, content } = req.body;
  await Record.updateOne(
    { date },
    { $set: { weather, mood, content } },
    { upsert: true }
  );
  res.json({ success: true });
});