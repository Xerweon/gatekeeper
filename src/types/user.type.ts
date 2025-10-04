export type User = {
    id: string;
    email: string;
    fullName: string;
    centerId: string;
    role: 'entrepreneur' | 'staff' | 'admin';
}

export type AttendanceType = 'full-day' | 'half-day'; // example

export type UserAttendance = {
  id: string;
  date: Date;
  userId: string;
  attendanceType: AttendanceType;
};

export type CenterWorkstation = {
  id: string;
  hostName: string;
  osName: string;
  osVersion: string;
  isBusy: boolean;
  isActive: boolean;
  centerId: string;
};

export type UserCheckin = {
  id: string;
  userId: string;
  checkinTime: Date;
  checkoutTime: Date | null;
  date: Date;
  workstation: CenterWorkstation;
};

export type Staff = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  centerId: string;
  createdAt: Date;
  attendances: UserAttendance[];
  checkins: UserCheckin[];
  isCheckedIn?: boolean;
};
