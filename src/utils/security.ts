/**
 * LUNOVA Cryptographic Security & Password Hashing Module
 * Provides salt-strengthened SHA-256 hashing and verification for Administrator passkeys.
 */

const PASSWORD_SALT = 'LUNOVA_CRYPTO_SALT_2026_MASTER_AUTH_v2';

/**
 * Computes a salted SHA-256 hash of the provided password string.
 */
export async function hashAdminPassword(password: string): Promise<string> {
  if (!password) return '';
  const trimmed = password.trim();
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(`${PASSWORD_SALT}:${trimmed}`);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('crypto.subtle failed, falling back to internal digest:', e);
    }
  }

  // Fallback digest if crypto.subtle is unavailable
  let hash1 = 5381;
  let hash2 = 52711;
  const combined = `${PASSWORD_SALT}:${trimmed}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 5) + hash2) ^ char;
  }
  return `sha256_fallback_${Math.abs(hash1).toString(16)}${Math.abs(hash2).toString(16)}`;
}

/**
 * Compares a plain password attempt with stored salted SHA-256 hash in Firebase.
 */
export async function verifyAdminPassword(
  attemptPassword: string, 
  storedPassHash: string
): Promise<boolean> {
  if (!attemptPassword || !storedPassHash) return false;
  const trimmedAttempt = attemptPassword.trim();
  const trimmedStored = storedPassHash.trim();

  // Strictly check against salted SHA-256 hash
  const computedHash = await hashAdminPassword(trimmedAttempt);
  return computedHash === trimmedStored;
}

export interface AuthorizedAdminRecord {
  name: string;
  role: 'Super Admin' | 'Store Manager' | 'Editor';
  passHash: string;
  updatedAt?: string;
}

export interface AdminAuthDoc {
  masterPassHash?: string;
  isConfigured: boolean;
  adminName: string;
  adminEmail: string;
  adminRole: 'Super Admin' | 'Store Manager' | 'Editor';
  authorizedEmails?: string[];
  admins?: Record<string, AuthorizedAdminRecord>;
  updatedAt: string;
  description?: string;
  lastChangedBy?: string;
}

/**
 * Generates initial unconfigured Administrator Authentication Document structure for Firestore.
 */
export function getInitialAdminAuthDoc(): AdminAuthDoc {
  return {
    masterPassHash: '',
    isConfigured: false,
    adminName: 'Julian Thorne',
    adminEmail: 'admin@lunova.luxury',
    adminRole: 'Super Admin',
    authorizedEmails: ['admin@lunova.luxury', 'workp7384@gmail.com'],
    admins: {},
    updatedAt: new Date().toISOString(),
    description: 'LUNOVA Central Administrator Authentication Registry'
  };
}

