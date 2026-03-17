import type { MedicalRecord } from '../../../entities/medical-record/model/types';

export const getUpcomingEvents = (records: MedicalRecord[]) => {
  const today = new Date();

  return records
    .map((record) => {
      const recordDate = new Date(record.date);

      let status: 'past' | 'upcoming' = 'upcoming';

      if (recordDate < today) {
        status = 'past';
      }

      return {
        id: record.id,
        title: record.title,
        date: record.date,
        status,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};