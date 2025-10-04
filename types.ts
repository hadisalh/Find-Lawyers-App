// Fix: Added full content for types.ts to define all application types.
export enum UserRole {
  Admin = 'admin',
  Client = 'client',
  Lawyer = 'lawyer',
}

export enum LawyerSpecialty {
  Civil = 'قانون مدني',
  Criminal = 'قانون جنائي',
  Corporate = 'قانون شركات',
  Family = 'قانون أسرة',
  RealEstate = 'قانون عقاري',
}

export enum LawyerStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum AccountStatus {
  Active = 'active',
  Banned = 'banned',
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  password?: string;
  accountStatus: AccountStatus;
}

export interface Client extends User {
  role: UserRole.Client;
}

export interface Lawyer extends User {
  role: UserRole.Lawyer;
  specialty: LawyerSpecialty;
  status: LawyerStatus;
  rating: number;
  reviews: string[];
  numberOfRatings: number;
  wonCases: number;
  idUrl: string; // URL to the ID document
}

export interface Admin extends User {
  role: UserRole.Admin;
}

export interface Comment {
  id: number;
  lawyerId: number;
  lawyerName: string;
  lawyerSpecialty: LawyerSpecialty;
  text: string;
  cost: string;
}

export interface Post {
  id: number;
  clientId: number;
  clientName: string;
  title: string;
  description: string;
  comments: Comment[];
  createdAt: string; // ISO date string
}

export interface ChatMessage {
  id: number;
  senderId: number;
  text: string;
  timestamp: string; // ISO date string
}

export interface Chat {
  id: string;
  clientId: number;
  lawyerId: number;
  messages: ChatMessage[];
}