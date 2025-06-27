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
    <main className="min-h-screen bg-[#E3F0F9] flex flex-col items-center px-2 md:px-0">
      <ShareModal />
      <header className="w-full max-w-6xl mx-auto mt-8 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#1E2A39] tracking-tight mb-2">
          Resultados de Optimización de Puestos
        </h1>
      </header>
      <KPISection kpis={data.kpis} />
      <section className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-[#F3F3F3] rounded-xl shadow-md p-6">
          <DayTabs assignments={data.assignments} groupZonesTable={data.group_zones_table || []} />
        </div>
        <aside className="w-full lg:w-[374px] bg-[#FAFAFA] rounded-xl shadow-md p-6 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-center">Empleado o Escritorio</h2>
          <EmployeeDeskSearch assignments={data.assignments} />
        </aside>
      </section>
    </main>
  );
}
