"use server";

import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export async function registerUser(input: {
  email: string;
  name?: string;
  password: string;
}) {
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() || null;
  const password = input.password;

  if (!email || !password) {
    return { success: false, error: "E-mail e senha são obrigatórios." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Já existe um usuário com este e-mail." };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
      select: { id: true },
    });

    await createSession(user.id);

    return { success: true };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Erro ao registrar usuário. Tente novamente.",
    };
  }
}

export async function login(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    return { success: false, error: "E-mail e senha são obrigatórios." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      return { success: false, error: "Credenciais inválidas." };
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return { success: false, error: "Credenciais inválidas." };
    }

    await createSession(user.id);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Erro ao fazer login. Tente novamente." };
  }
}

export async function logout() {
  try {
    await destroySession();
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

