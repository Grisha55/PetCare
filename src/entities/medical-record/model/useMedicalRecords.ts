import { useState, useEffect } from 'react';
import { 
  getMedicalRecords, 
  createMedicalRecord, 
  deleteMedicalRecord,
  createReminderNotification 
} from '../../../shared/api/medicalApi';
import { useAuth } from '../../../app/providers/auth-provider';
import type { MedicalRecord, CreateMedicalRecord } from './types';

export const useMedicalRecords = (petId: string | null) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!petId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    const loadRecords = async () => {
      try {
        const data = await getMedicalRecords(petId);
        setRecords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load medical records:', error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, [petId]);

  const addRecord = async (data: CreateMedicalRecord) => {
    if (!petId || !user) return;

    try {
      // 👈 Передаем объект data, а не отдельные параметры
      const newRecord = await createMedicalRecord(petId, data);
      
      // Убеждаемся, что newRecord существует и имеет правильную структуру
      if (newRecord) {
        setRecords(prev => [newRecord, ...prev]);
        
        await createReminderNotification(user.id, petId, newRecord);
      }
    } catch (error) {
      console.error('Failed to add medical record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteMedicalRecord(id);
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete medical record:', error);
      throw error;
    }
  };

  return {
    records,
    loading,
    addRecord,
    deleteRecord
  };
};