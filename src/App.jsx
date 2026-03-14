import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, deleteDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Dna, Heart, Settings, PlayCircle, FileText, Download, ChevronLeft, Clock, BarChart3 } from 'lucide-react';

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
  const [quizzes, setQuizzes] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [visitLogs, setVisitLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    signInAnonymously(auth);
    addDoc(collection(db, 'visits'), { 
      timestamp: new Date().toLocaleString('ar-SA'), 
      device: "جوال/آيباد" 
    });

    onSnapshot(collection(db, 'videos'), (s) => setVideos(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'pdfs'), (s) => setPdfs(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'quizzes'), (s) => setQuizzes(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(query(collection(db, 'visits'), orderBy('timestamp', 'desc'), limit(10)), (s) => setVisitLogs(s.docs.map(d => ({id: d.id, ...d.data()}))));
    
    setLoading(false);
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-emerald-800">جاري التحميل...</div>;

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto space-y-10 text-right" dir="rtl">
      <header className="flex justify-between items-center bg-white p-4 rounded-full shadow-sm">
        <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2"><Dna className="text-emerald-600"/> Jouda Biotech</h1>
        <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full font-bold text-sm">جود</div>
      </header>

      <section className="bg-[#044735] rounded-[3rem] p-12 text-center text-white shadow-2xl">
        <h2 className="text-4xl md:text-6xl font-black mb-6">هاي سمارت جودي</h2>
        <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-2 rounded-full">
          <span className="font-bold text-lg">بالتوفيق</span>
          <Heart className="text-emerald-400 fill-emerald-400 animate-pulse" />
        </div>
      </section>

      {/* المحتوى */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-2xl font-black border-r-4 border-emerald-500 pr-3">الشرح</h3>
          {videos.map(v => (
            <div key={v.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border">
              <iframe className="w-full aspect-video" src={v.url} frameBorder="0" allowFullScreen></iframe>
              <div className="p-4 font-bold">{v.title}</div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-black border-r-4 border-amber-500 pr-3">الملخصات</h3>
          {pdfs.map(p => (
            <a key={p.id} href={p.link} target="_blank" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border">
              <div className="flex items-center gap-3"><FileText className="text-amber-600"/><span className="font-bold">{p.title}</span></div>
              <Download size={18} className="text-slate-300"/>
            </a>
          ))}
        </div>
      </div>

      <footer className="text-center pt-10">
        <button onClick={() => setShowLogin(true)} className="text-slate-300"><Settings/></button>
      </footer>

      {isAdmin && (
        <div className="fixed inset-0 bg-white z-50 p-8 overflow-y-auto">
          <button onClick={() => setIsAdmin(false)} className="bg-red-500 text-white px-6 py-2 rounded-full mb-8">إغلاق</button>
          <h2 className="text-2xl font-black mb-6">لوحة المراقبة</h2>
          <div className="bg-blue-50 p-6 rounded-[2rem]">
            <h4 className="font-bold mb-4">سجل دخول جود</h4>
            {visitLogs.map(log => (
              <div key={log.id} className="bg-white p-2 rounded-lg mb-2 text-xs flex justify-between">
                <span>{log.timestamp}</span>
                <span className="text-blue-600">{log.device}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm text-center">
            <h3 className="text-xl font-black mb-6">الرمز السري</h3>
            <input type="password" onChange={(e) => setPass(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl mb-4 text-center" />
            <button onClick={() => pass === "1234" ? setIsAdmin(true) : alert("خطأ!")} className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold">دخول</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
