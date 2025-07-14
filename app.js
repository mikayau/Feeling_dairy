//基本設定
const express = require('express'); /* eslint-disable-line no-unused-vars */
const mongoose = require('mongoose');/* eslint-disable-line no-unused-vars */
const bodyParser = require('body-parser');
const cors = require('cors'); /* eslint-disable-line no-unused-vars */

const app = express();
app.use(cors());/*讓前端能跨域存取*/
app.use(express.json()); /*解析json格式的請求體*/
app.use(bodyParser.json()); 
app.use(express.static('.')); /*提供靜態文件服務*/ 

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
    
    try {
        // 使用 updateOne 與 upsert 選項來更新或創建 Mood 記錄
        const result = await Mood.updateOne(
            { user, date }, // 查找條件：相同用戶和日期
            { $set: { mood, time: new Date() } }, // 更新內容
            { upsert: true } // 如果不存在則創建新記錄
        );
        
        // 同時也要更新 Record 模型中的 mood 字段（如果存在的話）
        await Record.updateOne(
            { date }, // 查找條件：相同日期
            { $set: { mood } }, // 更新心情字段
            { upsert: false } // 不創建新記錄，只更新現有記錄
        );
        
        // 檢查是否是更新現有記錄還是創建新記錄
        if (result.upsertedCount > 0) {
            res.status(201).json({ message: '心情已提交', isNew: true });
        } else {
            res.status(200).json({ message: '心情已更新', isNew: false });
        }
    } catch (error) {
        console.error('儲存心情失敗:', error);
        res.status(500).json({ error: '儲存心情時發生錯誤' });
    }
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
    moodLevel: Number,    // 新增 moodLevel 欄位
    content: String, // 新增 content 欄位
    user: String          // 也新增 user 欄位
});
const Record = mongoose.models.Record || mongoose.model('Record', recordSchema);

// 今日記錄
app.post('/api/saveRecord', async (req, res) => {
    try {
        const { date, weather, moodLevel, content, user, mood } = req.body;
        
        console.log('saveRecord received:', { date, weather, moodLevel, content, user, mood });
        
        // 更新或創建 Record
        const recordData = { date, weather, moodLevel, content, user };
        await Record.updateOne(
            { date },
            { $set: recordData },
            { upsert: true }
        );
        
        console.log('Record updated successfully');
        
        // 如果有 mood 和 user，也要更新 Mood 模型
        if (mood && user) {
            await Mood.updateOne(
                { date, user },
                { $set: { mood, time: new Date() } },
                { upsert: true }
            );
            console.log('Mood updated successfully');
        }
        
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
    date: String,
    user: String // 新增 user 字段
});
const Tomorrow = mongoose.models.Tomorrow || mongoose.model('Tomorrow', tomorrowSchema);

// 明天期望
app.post('/api/Tomorrow', async (req, res) => {
  const { cardType, text, stickerType, date, user } = req.body; // 加入 user
  try {
    // 使用 updateOne 與 upsert 選項來更新或創建 Tomorrow 記錄
    const result = await Tomorrow.updateOne(
      { date, user }, // 根據日期和用戶查找
      { $set: { cardType, text, stickerType, date, user } }, // 更新內容
      { upsert: true } // 如果不存在則創建新記錄
    );
    
    if (result.upsertedCount > 0) {
      res.json({ success: true, message: '明天期望已創建' });
    } else {
      res.json({ success: true, message: '明天期望已更新' });
    }
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// 獲取明天期望
app.get('/api/getTomorrow', async (req, res) => {
  const { date, user } = req.query;
  if (!date) return res.json({});
  
  try {
    const tomorrow = await Tomorrow.findOne({ date, user });
    res.json(tomorrow || {});
  } catch (err) {
    console.error('getTomorrow error:', err);
    res.status(500).json({ error: err.message });
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

app.get('/api/getRecord', async (req, res) => {
  const { date, user } = req.query;
  if (!date) return res.json({});
  
  try {
    // 同時獲取 Record 和 Mood 資料
    const record = await Record.findOne({ date });
    const mood = await Mood.findOne({ date, user });
    
    console.log('getRecord - date:', date, 'user:', user);
    console.log('getRecord - record:', record);
    console.log('getRecord - mood:', mood);
    
    // 合併資料
    const result = {
      date: date,
      weather: record?.weather || '',
      mood: mood?.mood || record?.mood || '', // 優先使用 Mood 模型中的心情
      moodLevel: record?.moodLevel || 5, // 添加 moodLevel 欄位
      content: record?.content || '',
      user: user
    };
    
    console.log('getRecord - result:', result);
    
    res.json(result);
  } catch (err) {
    console.error('getRecord error:', err);
    res.status(500).json({ error: err.message });
  }
});