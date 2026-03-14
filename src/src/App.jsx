import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Dna, Heart, Settings, FileText, Download } from 'lucide-react';

// إعدادات قاعدة البيانات الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyAezpyB6YhZgGrGwj9GY6--cDmjsNh-J1g",
  authDomain: "jouda-biotech.firebaseapp.com",
  projectId: "jouda-biotech",
  storageBucket: "jouda-biotech.firebasestorage.app",
  messagingSenderId: "718959958507",
  appId: "1:718959958507:web:b14a4d0d9c2207594721ae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pass, setPass] = useState('');
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [visitLogs, setVisitLogs] = useState([]);

  useEffect(() => {
    signInAnonymously(auth);
    // تسجيل زيارة جود فور فتح الموقع
    addDoc(collection(db, 'visits'), { 
      timestamp: new Date().toLocaleString('ar-SA'), 
      device: "متصفح" 
    });

    onSnapshot(collection(db, 'videos'), (s) => setVideos(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'pdfs'), (s) => setPdfs(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(query(collection(db, 'visits'), orderBy('timestamp', 'desc'), limit(10)), (s) => setVisitLogs(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto space-y-10 text-right" dir="rtl">
      <header className="flex justify-between items-center bg-white p-4 rounded-full shadow-sm">
        <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2"><Dna className="text-emerald-600"/> Jouda Biotech</h1>
        <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full font-bold text-sm">جود</div>
      </header>

      <section className="bg-[#044735] rounded-[3rem] p-12 text-center text-white shadow-2xl border-4 border-emerald-400/20">
        <h2 className="text-4xl md:text-6xl font-black mb-6 animate-fade-in">هاي سمارت جودي</h2>
        <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-2 rounded-full backdrop-blur-sm">
          <span className="font-bold text-lg italic">بالتوفيق في دراستك</span>
          <Heart className="text-emerald-400 fill-emerald-400 animate-pulse" />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-2xl font-black border-r-4 border-emerald-500 pr-3">دروس الشرح</h3>
          {videos.length === 0 ? (
            <div className="bg-slate-50 p-10 rounded-3xl border-2 border-dashed text-slate-400 font-bold text-center">لا توجد دروس حالياً</div>
          ) : (
            videos.map(v => (
              <div key={v.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border p-4 font-bold text-emerald-900">{v.title}</div>
            ))
          )}
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-black border-r-4 border-amber-500 pr-3">الملخصات والـ PDF</h3>
          {pdfs.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border-2 border-amber-50 group hover:border-amber-500 transition-all">
              <div className="flex items-center gap-3"><FileText className="text-amber-600"/><span className="font-bold">{p.title}</span></div>
              <Download size={18} className="text-slate-300 group-hover:text-amber-500"/>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center pt-10">
        <button onClick={() => setShowLogin(true)} className="text-slate-200 hover:text-emerald-500 transition-colors"><Settings/></button>
      </footer>

      {isAdmin && (
        <div className="fixed inset-0 bg-white z-50 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-emerald-950">لوحة المراقبة</h2>
            <button onClick={() => setIsAdmin(false)} className="bg-red-500 text-white px-8 py-2 rounded-full font-bold shadow-lg">إغلاق</button>
          </div>
          <div className="bg-emerald-50 p-8 rounded-[3rem] border-2 border-emerald-100">
            <h4 className="font-black text-xl mb-6 flex items-center gap-2 text-emerald-800"><Settings size={20}/> سجل دخول جود الأخير</h4>
            <div className="space-y-3">
              {visitLogs.map(log => (
                <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-emerald-100">
                  <span className="font-bold text-slate-600">{log.timestamp}</span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">{log.device}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showLogin && !isAdmin && (
        <div className="fixed inset-0 bg-emerald-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><Settings className="text-emerald-600"/></div>
            <h3 className="text-2xl font-black mb-6 text-emerald-950">دخول الإدارة</h3>
            <input type="password" placeholder="الرمز السري" onChange={(e) => setPass(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl mb-4 text-center border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-bold" />
            <button onClick={() => pass === "1234" ? setIsAdmin(true) : alert("الرمز خطأ!")} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-all">تأكيد الدخول</button>
            <button onClick={() => setShowLogin(false)} className="mt-4 text-slate-400 font-bold">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
