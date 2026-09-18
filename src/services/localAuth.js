const USERS_KEY = "techinclusao_users_v1";
const SESSION_KEY = "techinclusao_session_v1";

function readUsers() {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function randomId() {
  return crypto.randomUUID();
}

async function hashPassword(senha, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${senha}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function toPublicUser({ id, nome, email }) {
  return { id, nome, email };
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function signUp({ nome, email, senha }) {
  const users = readUsers();
  const normalized = normalizeEmail(email);

  if (users.some((user) => user.email === normalized)) {
    return { error: "Já existe uma conta com este e-mail." };
  }

  const salt = randomId();
  const record = {
    id: randomId(),
    nome: nome.trim(),
    email: normalized,
    salt,
    senhaHash: await hashPassword(senha, salt),
  };

  writeUsers([...users, record]);
  window.localStorage.setItem(SESSION_KEY, record.id);
  return { user: toPublicUser(record) };
}

export async function signIn({ email, senha }) {
  const record = readUsers().find((user) => user.email === normalizeEmail(email));
  if (!record) {
    return { error: "E-mail ou senha incorretos." };
  }

  const senhaHash = await hashPassword(senha, record.salt);
  if (senhaHash !== record.senhaHash) {
    return { error: "E-mail ou senha incorretos." };
  }

  window.localStorage.setItem(SESSION_KEY, record.id);
  return { user: toPublicUser(record) };
}

export async function signOut() {
  window.localStorage.removeItem(SESSION_KEY);
}

export async function getCurrentUser() {
  const userId = window.localStorage.getItem(SESSION_KEY);
  if (!userId) return null;

  const record = readUsers().find((user) => user.id === userId);
  return record ? toPublicUser(record) : null;
}
