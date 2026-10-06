import { useState, useEffect } from 'react';
import { seed } from '../lib/model.mjs';
const STORE = 'bitopi-kpi-v1';
export default function useKpiData() {
  const [kpis, setKpis] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORE)) || seed();
    } catch {
      return seed();
    }
  });
  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(kpis));
  }, [kpis]);
  function update(id, field, value) {
    setKpis((ks) =>
      ks.map((k) => (k.id === id ? { ...k, [field]: value } : k)),
    );
  }

  return {kpis,setKpis,update};
}
