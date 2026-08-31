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
 * Compares a plain password attempt with stored hash (or legacy plaintext fallback during initial migration).
 */
export async function verifyAdminPassword(
  attemptPassword: string, 
  storedPassHashOrPlain: string
): Promise<boolean> {
  if (!attemptPassword || !storedPassHashOrPlain) return false;
  const trimmedAttempt = attemptPassword.trim();
  const trimmedStored = storedPassHashOrPlain.trim();

  // 1. Check against salted SHA-256 hash
  const computedHash = await hashAdminPassword(trimmedAttempt);
  if (computedHash === trimmedStored) {
    return true;
  }

  // 2. Backward compatibility: check if stored is plaintext (e.g. before initial migration)
  if (trimmedAttempt === trimmedStored) {
    return true;
  }

  return false;
}

export interface AuthorizedAdminRecord {
  name: string;
  role: 'Super Admin' | 'Store Manager' | 'Editor';
  passHash: string;
  updatedAt?: string;
}

export interface AdminAuthDoc {
  masterPassHash: string;
  isPasswordChanged: boolean;
  adminName: string;
  adminEmail: string;
  adminRole: 'Super Admin' | 'Store Manager' | 'Editor';
  authorizedEmails: string[];
  admins: Record<string, AuthorizedAdminRecord>;
  updatedAt: string;
  description?: string;
  lastChangedBy?: string;
}

/**
 * Generates initial default authorized admin accounts with salted SHA-256 hashed default passkeys.
 */
export async function getDefaultAdminRecords(): Promise<Record<string, AuthorizedAdminRecord>> {
  const defaultHash = await hashAdminPassword('lunova2026');
  return {
    'admin@lunova.luxury': { name: 'Julian Thorne', role: 'Super Admin', passHash: defaultHash },
    'julian@lunova.luxury': { name: 'Julian Thorne', role: 'Super Admin', passHash: defaultHash },
    'operations@lunova.luxury': { name: 'Elena Vance', role: 'Store Manager', passHash: defaultHash },
    'admin@lunovahome.com': { name: 'Store Master', role: 'Super Admin', passHash: defaultHash },
    'workp7384@gmail.com': { name: 'Store Principal', role: 'Super Admin', passHash: defaultHash }
  };
}

/**
 * Generates the central Administrator Authentication Document for Firestore.
 */
export async function getInitialAdminAuthDoc(): Promise<AdminAuthDoc> {
  const defaultHash = await hashAdminPassword('lunova2026');
  const initialAdmins = await getDefaultAdminRecords();
  return {
    masterPassHash: defaultHash,
    isPasswordChanged: false,
    adminName: 'Julian Thorne',
    adminEmail: 'admin@lunova.luxury',
    adminRole: 'Super Admin',
    authorizedEmails: Object.keys(initialAdmins),
    admins: initialAdmins,
    updatedAt: new Date().toISOString(),
    description: 'LUNOVA Central Administrator Authentication Registry'
  };
}
