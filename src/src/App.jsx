import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Dna, Heart, Settings, FileText, Download, Trash2, PlusCircle, Video, BarChart3, X } from 'lucide-react';

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
  
  // حالات الإضافة الجديدة
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [newPdf, setNewPdf] = useState({ title: '', link: '' });

  useEffect(() => {
    signInAnonymously(auth);
    addDoc(collection(db, 'visits'), { 
      timestamp: new Date().toLocaleString('ar-SA'), 
      device: window.innerWidth < 768 ? "جوال" : "كمبيوتر/آيباد" 
    });

    onSnapshot(collection(db, 'videos'), (s) => setVideos(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'pdfs'), (s) => setPdfs(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(query(collection(db, 'visits'), orderBy('timestamp', 'desc'), limit(20)), (s) => setVisitLogs(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, []);

  const addItem = async (type) => {
    if (type === 'video' && newVideo.title) {
      await addDoc(collection(db, 'videos'), newVideo);
      setNewVideo({ title: '', url: '' });
    } else if (type === 'pdf' && newPdf.title) {
      await addDoc(collection(db, 'pdfs'), newPdf);
      setNewPdf({ title: '', link: '' });
    }
  };

  const deleteItem = async (col, id) => {
    if(window.confirm("هل أنت متأكد من الحذف؟")) {
      await deleteDoc(doc(db, col, id));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-10 text-right font-sans" dir="rtl">
      {/* Header */}
      <header className="flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm sticky top-4 z-40 border border-emerald-50">
        <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
          <Dna className="text-emerald-600 animate-pulse"/> Jouda Biotech
        </h1>
        <div className="bg-emerald-500 text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg shadow-emerald-200">الذكية جود</div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#044735] rounded-[3.5rem] p-10 md:p-20 text-center text-white shadow-2xl overflow-hidden border-b-8 border-emerald-400">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Dna size={300} className="absolute -top-20 -left-20 rotate-45"/>
        </div>
        <h2 className="text-4xl md:text-7xl font-black mb-6 leading-tight">هاي سمارت جودي ✨</h2>
        <div className="inline-flex items-center gap-3 bg-white/10 px-8 py-3 rounded-full backdrop-blur-md border border-white/20">
          <span className="font-bold text-lg md:text-xl">كل التوفيق في رحلتك العلمية</span>
          <Heart className="text-emerald-400 fill-emerald-400 animate-bounce" />
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Videos Column */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-emerald-900 flex items-center gap-2 pr-2 border-r-4 border-emerald-500">
            <Video className="text-emerald-500"/> شروحات الفيديو
          </h3>
          <div className="grid gap-6">
            {videos.length === 0 ? (
               <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 text-center font-bold">لم تضاف دروس بعد</div>
            ) : (
              videos.map(v => (
                <div key={v.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-emerald-50 group">
                  <div className="p-5 font-black text-lg text-emerald-900 flex justify-between">
                    <span>{v.title}</span>
                  </div>
                  {v.url && (
                    <iframe className="w-full aspect-video" src={v.url.replace("watch?v=", "embed/")} frameBorder="0" allowFullScreen></iframe>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* PDFs Column */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-amber-900 flex items-center gap-2 pr-2 border-r-4 border-amber-500">
            <FileText className="text-amber-500"/> الحقيبة الدراسية
          </h3>
          <div className="grid gap-4">
            {pdfs.map(p => (
              <a key={p.id} href={p.link} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-amber-500 hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                    <FileText className="text-amber-600 group-hover:text-white"/>
                  </div>
                  <span className="font-bold text-lg text-slate-700">{p.title}</span>
                </div>
                <Download className="text-slate-300 group-hover:text-amber-500 animate-bounce"/>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* الحقوق الجديدة */}
      <footer className="text-center py-10 space-y-4">
        <div className="flex flex-col items-center gap-2">
            <p className="text-slate-500 font-bold text-lg flex items-center gap-2">
                صنع بكل حب لجود <Heart size={18} className="text-red-500 fill-red-500"/>
            </p>
            <div className="h-1 w-20 bg-emerald-100 rounded-full"></div>
        </div>
        <button onClick={() => setShowLogin(true)} className="p-3 text-slate-200 hover:text-emerald-500 transition-all rounded-full hover:bg-emerald-50"><Settings size={20}/></button>
      </footer>

      {/* لوحة التحكم المطورة */}
      {isAdmin && (
        <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto p-4 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
              <div>
                <h2 className="text-3xl font-black text-emerald-950">لوحة الإدارة الكاملة</h2>
                <p className="text-slate-500 font-bold">أهلاً بك يا محمد.. تحكم في عالم جود</p>
              </div>
              <button onClick={() => setIsAdmin(false)} className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><X/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* إضافة محتوى */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100">
                  <h4 className="font-black text-xl mb-6 flex items-center gap-2 text-emerald-700"><PlusCircle/> إضافة فيديو جديد</h4>
                  <input type="text" placeholder="عنوان الدرس" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl mb-3 outline-none border-2 border-transparent focus:border-emerald-500 transition-all"/>
                  <input type="text" placeholder="رابط اليوتيوب" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl mb-4 outline-none border-2 border-transparent focus:border-emerald-500 transition-all"/>
                  <button onClick={() => addItem('video')} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-95 transition-all">نشر الفيديو</button>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-amber-100">
                  <h4 className="font-black text-xl mb-6 flex items-center gap-2 text-amber-700"><PlusCircle/> إضافة ملف PDF</h4>
                  <input type="text" placeholder="اسم الملف" value={newPdf.title} onChange={e => setNewPdf({...newPdf, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl mb-3 outline-none border-2 border-transparent focus:border-amber-500 transition-all"/>
                  <input type="text" placeholder="رابط الملف" value={newPdf.link} onChange={e => setNewPdf({...newPdf, link: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl mb-4 outline-none border-2 border-transparent focus:border-amber-500 transition-all"/>
                  <button onClick={() => addItem('pdf')} className="w-full bg-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-100 hover:scale-[1.02] active:scale-95 transition-all">نشر الملف</button>
                </div>
              </div>

              {/* إدارة الموجود وسجل الزيارات */}
              <div className="space-y-6">
                <div className="bg-[#111827] p-8 rounded-[2.5rem] text-white shadow-2xl">
                  <h4 className="font-black text-xl mb-6 flex items-center gap-2 text-blue-400"><BarChart3/> سجل زيارات جود</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {visitLogs.map(log => (
                      <div key={log.id} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/10">
                        <span className="font-bold text-sm text-slate-300">{log.timestamp}</span>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black">{log.device}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <h4 className="font-black text-xl mb-6">إدارة المحتوى الحالي</h4>
                  <div className="space-y-3">
                    {videos.map(v => (
                      <div key={v.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <span className="font-bold text-slate-600 truncate max-w-[150px]">{v.title}</span>
                        <button onClick={() => deleteItem('videos', v.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                      </div>
                    ))}
                    {pdfs.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <span className="font-bold text-amber-600 truncate max-w-[150px]">{p.title}</span>
                        <button onClick={() => deleteItem('pdfs', p.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تسجيل الدخول */}
      {showLogin && !isAdmin && (
        <div className="fixed inset-0 bg-emerald-950/95 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-white p-10 rounded-[3.5rem] w-full max-w-sm text-center shadow-2xl relative border-t-8 border-emerald-500">
            <h3 className="text-2xl font-black mb-8 text-emerald-950">أهلاً محمد، أدخل الرمز</h3>
            <input type="password" placeholder="الرمز السري" onChange={(e) => setPass(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl mb-6 text-center border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-bold text-2xl tracking-widest" />
            <button onClick={() => pass === "1234" ? setIsAdmin(true) : alert("الرمز خطأ!")} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all">فتح الإدارة</button>
            <button onClick={() => setShowLogin(false)} className="mt-6 text-slate-400 font-bold hover:text-emerald-600">رجوع للموقع</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
