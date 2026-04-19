import fs from 'fs';
import path from 'path';

export interface ExamData {
  courseId: string;
  courseName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string;
}

export async function parseCSV(filePath: string): Promise<ExamData[]> {
  const fullPath = path.resolve(__dirname, `../../${filePath}`);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.trim().split('\n');

  // Skip header row
  return lines.slice(1).map(line => {
    const [courseId, courseName, examDate, startTime, endTime, room] = line.split(',').map(v => v.trim());
    return {
      courseId,
      courseName,
      examDate,
      startTime,
      endTime,
      room,
    };
  });
}

export async function getExamData(filePath: string): Promise<ExamData[]> {
  return parseCSV(filePath);
}

export function findExamByCourseId(data: ExamData[], courseId: string): ExamData | undefined {
  return data.find(exam => exam.courseId === courseId);
}
