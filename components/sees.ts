import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('✅ Demo user created:', demoUser.email);

  // Create demo decks
  const deck1 = await prisma.deck.create({
    data: {
      name: 'Daily Conversations',
      emoji: '💬',
      description: 'Common phrases for everyday conversations',
      isPublic: true,
      authorId: demoUser.id,
      cards: {
        create: [
          { front: '안녕하세요', back: 'Сайн байна уу', dueDate: new Date() },
          { front: '감사합니다', back: 'Баярлалаа', dueDate: new Date() },
          { front: '죄송합니다', back: 'Уучлаарай', dueDate: new Date() },
          { front: '안녕히 가세요', back: 'Баяртай', dueDate: new Date() },
          { front: '잘 지냈어요?', back: 'Сайн байсан уу?', dueDate: new Date() },
          { front: '처음 뵙겠습니다', back: 'Танилцаж байна', dueDate: new Date() },
          { front: '네', back: 'Тийм', dueDate: new Date() },
          { front: '아니요', back: 'Үгүй', dueDate: new Date() },
          { front: '도와주세요', back: 'Тусална уу', dueDate: new Date() },
          { front: '알겠습니다', back: 'Ойлголоо', dueDate: new Date() },
        ],
      },
    },
    include: { cards: true },
  });

  const deck2 = await prisma.deck.create({
    data: {
      name: 'Restaurant Vocabulary',
      emoji: '🍜',
      description: 'Essential words for dining out',
      isPublic: true,
      authorId: demoUser.id,
      cards: {
        create: [
          { front: '메뉴판', back: 'Цэс', dueDate: new Date() },
          { front: '주문하다', back: 'Захиалах', dueDate: new Date() },
          { front: '맛있다', back: 'Амттай', dueDate: new Date() },
          { front: '계산서', back: 'Тооцоо', dueDate: new Date() },
          { front: '물', back: 'Ус', dueDate: new Date() },
          { front: '음식', back: 'Хоол', dueDate: new Date() },
          { front: '식당', back: 'Зоогийн газар', dueDate: new Date() },
          { front: '밥', back: 'Будаа', dueDate: new Date() },
        ],
      },
    },
    include: { cards: true },
  });

  const deck3 = await prisma.deck.create({
    data: {
      name: 'K-Drama Vocabulary',
      emoji: '🎬',
      description: 'Words commonly used in Korean dramas',
      isPublic: true,
      authorId: demoUser.id,
      cards: {
        create: [
          { front: '사랑해요', back: 'Хайртай', dueDate: new Date() },
          { front: '미안해요', back: 'Уучлаарай', dueDate: new Date() },
          { front: '보고 싶어요', back: 'Санаж байна', dueDate: new Date() },
          { front: '괜찮아요', back: 'Зүгээр', dueDate: new Date() },
          { front: '친구', back: 'Найз', dueDate: new Date() },
          { front: '가족', back: 'Гэр бүл', dueDate: new Date() },
          { front: '행복하다', back: 'Аз жаргалтай', dueDate: new Date() },
          { front: '슬프다', back: 'Гунигтай', dueDate: new Date() },
        ],
      },
    },
    include: { cards: true },
  });

  // Create progress for deck1
  await prisma.userProgress.create({
    data: {
      userId: demoUser.id,
      deckId: deck1.id,
      mastered: 3,
      total: deck1.cards.length,
      streak: 5,
      lastStudy: new Date(),
    },
  });

  // Create progress for deck2
  await prisma.userProgress.create({
    data: {
      userId: demoUser.id,
      deckId: deck2.id,
      mastered: 0,
      total: deck2.cards.length,
      streak: 0,
    },
  });

  console.log('✅ Demo decks created:');
  console.log(`   - ${deck1.name} (${deck1.cards.length} cards)`);
  console.log(`   - ${deck2.name} (${deck2.cards.length} cards)`);
  console.log(`   - ${deck3.name} (${deck3.cards.length} cards)`);

  // Create another user with public decks
  const hashedPassword2 = await bcrypt.hash('user123', 10);
  
  const user2 = await prisma.user.upsert({
    where: { email: 'minjung@example.com' },
    update: {},
    create: {
      email: 'minjung@example.com',
      name: 'MinJung',
      password: hashedPassword2,
    },
  });

  const deck4 = await prisma.deck.create({
    data: {
      name: 'Travel Essentials',
      emoji: '✈️',
      description: 'Must-know phrases for traveling in Korea',
      isPublic: true,
      authorId: user2.id,
      cards: {
        create: [
          { front: '공항', back: 'Нисэх онгоцны буудал', dueDate: new Date() },
          { front: '호텔', back: 'Зочид буудал', dueDate: new Date() },
          { front: '택시', back: 'Такси', dueDate: new Date() },
          { front: '지하철', back: 'Метро', dueDate: new Date() },
          { front: '표', back: 'Тасалбар', dueDate: new Date() },
          { front: '여행', back: 'Аялал', dueDate: new Date() },
        ],
      },
    },
    include: { cards: true },
  });

  console.log('✅ Public deck created by MinJung:');
  console.log(`   - ${deck4.name} (${deck4.cards.length} cards)`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Demo credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: demo123');
  console.log('\n   Email: minjung@example.com');
  console.log('   Password: user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });