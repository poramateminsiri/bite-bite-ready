#!/usr/bin/env node
/**
 * Script to create admin user for Bite-Bite admin panel
 * Usage: node server/scripts/createAdmin.js <email> <password> [name] [role]
 */

const { auth } = require('../auth');

async function createAdmin() {
  const [email, password, name, role] = process.argv.slice(2);
  
  if (!email || !password) {
    console.error('❌ Usage: node server/scripts/createAdmin.js <email> <password> [name] [role]');
    console.error('   Example: node server/scripts/createAdmin.js admin@bite.com admin123 "Admin User" admin');
    process.exit(1);
  }
  
  try {
    console.log('Creating admin user...');
    
    const user = await auth.api.signUpEmail({
      email,
      password,
      name: name || 'Admin',
      role: role || 'admin',
    });
    
    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now login at: http://localhost:5173/admin/login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to create admin user');
    console.error('Error:', error.message);
    
    if (error.message.includes('UNIQUE')) {
      console.error('\n💡 Tip: This email is already registered. Try a different email.\n');
    }
    
    process.exit(1);
  }
}

createAdmin();
