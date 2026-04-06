export interface addUser {
  email: string;
  name: string | null;
  password: string;
  isVerified: 1 | 0;
  pfp: string | null;
  isDriveActive: 1 | 0;
  driveRefreshToken: string;
}

export interface tokens {
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  deviceId: string;
  userId: number;
}
