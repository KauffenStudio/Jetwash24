/**
 * Change the password of an admin/worker account.
 *
 *   node --env-file=.env.local scripts/set-password.mjs admin@jetwash24.com
 *
 * The password is typed at a prompt (never echoed, never in an argument), so
 * it does not land in your shell history or in any log. It is hashed with
 * bcrypt before touching the database — the plaintext is never stored.
 */
import { createInterface } from 'node:readline';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const MIN_LENGTH = 12;

/** Reads a line from the terminal with the characters hidden. */
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    // Swallow the echoed characters so the password never appears on screen.
    const onWrite = rl.output.write.bind(rl.output);
    let muted = false;
    rl.output.write = (chunk, ...rest) => (muted ? true : onWrite(chunk, ...rest));
    onWrite(question);
    muted = true;
    rl.question('', (answer) => {
      muted = false;
      onWrite('\n');
      rl.close();
      resolve(answer);
    });
  });
}

const email = process.argv[2];
if (!email) {
  console.error('Uso: node --env-file=.env.local scripts/set-password.mjs <email>');
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`Não existe nenhuma conta com o email ${email}.`);
    process.exit(1);
  }

  console.log(`Conta: ${user.email} (${user.role})`);

  const password = await askHidden('Nova password: ');
  if (password.length < MIN_LENGTH) {
    console.error(`A password tem de ter pelo menos ${MIN_LENGTH} caracteres.`);
    process.exit(1);
  }

  const confirmation = await askHidden('Confirmar password: ');
  if (password !== confirmation) {
    console.error('As passwords não coincidem. Nada foi alterado.');
    process.exit(1);
  }

  await prisma.user.update({
    where: { email },
    data: { password: await bcrypt.hash(password, 12) },
  });

  console.log(`Password de ${email} alterada. Já podes entrar com ela em /pt/admin/login.`);
} finally {
  await prisma.$disconnect();
}
