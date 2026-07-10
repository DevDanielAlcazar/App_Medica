export interface MeetLink {
  url: string;
}

export interface Schedule {
  id: string;
  date: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  meetLink?: MeetLink;
}
