import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './src/db';

const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-dashboard-key';

async function run() {
  try {
    console.log('Seeding initial admin user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: { password: hashedPassword, role: 'ADMIN', status: 'ACTIVE' },
      create: {
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });
    console.log('Admin user seeded:', adminUser.email);

    console.log('\nTesting login flow...');
    const loginUser = await prisma.user.findUnique({ where: { email: 'admin@test.com' } });
    if (!loginUser) {
      throw new Error('User not found during login');
    }

    const isValid = await bcrypt.compare('password123', loginUser.password);
    if (!isValid) {
      throw new Error('Invalid password during login');
    }

    const token = jwt.sign(
      { userId: loginUser.id, email: loginUser.email, role: loginUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Login successful. Token created:', token);

    const verified = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully:', verified);
    
    console.log('\nAuth logic is fully functional!');
  } catch (error) {
    console.error('Testing authentication failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();