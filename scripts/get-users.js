const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== Usuários cadastrados no banco de dados ===\n');
  
  const users = await prisma.user.findMany({
    include: {
      forms: true,
    },
  });

  if (users.length === 0) {
    console.log('Nenhum usuário encontrado.');
    return;
  }

  users.forEach((user, index) => {
    console.log(`Usuário ${index + 1}:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Nome: ${user.name || 'Não informado'}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Senha (hash): ${user.password}`);
    console.log(`  Criado em: ${user.createdAt}`);
    console.log(`  Quantidade de formulários: ${user.forms.length}`);
    console.log('');
  });
}

main()
  .catch((e) => {
    console.error('Erro ao consultar usuários:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
