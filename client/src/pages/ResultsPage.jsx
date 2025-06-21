import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import KPISection from '../components/KPISection';
import DayTabs from '../components/DayTabs';
import EmployeeDeskSearch from '../components/EmployeeDeskSearch';
import ShareModal from '../components/ShareModal';
import { useResults } from '../context/ResultsContext';

const app = initializeApp(JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG || '{}'));
const db = getFirestore(app);

export default function ResultsPage() {
  const { setResultId, data, setData } = useResults();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');

  useEffect(() => {
    if (!id) return;
    setResultId(id);
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, 'optimizations', id));
        if (!snap.exists()) {
          navigate('/404');
        } else {
          setData(snap.data());
        }
      } catch {
        navigate('/404');
      }
    };
    fetchData();
  }, [id]);

  if (!data) return <p className="text-center mt-10">Cargando…</p>;

  return (
    <div className="min-h-screen bg-[#E3F0F9] p-4 relative">
      <ShareModal />
      <h1 className="text-2xl font-bold text-center mb-4">Resultados de Optimización</h1>
      <KPISection kpis={data.kpis} />
      <DayTabs assignments={data.assignments} />
      <EmployeeDeskSearch assignments={data.assignments} />
    </div>
  );
}
