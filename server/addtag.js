// scripts/seedTags.js
import mongoose from 'mongoose';
import { Tag } from './Models/tags.js';


// change this to your DB URI

const predefinedTags = [
  'React',
  'JavaScript',
  'Node.js',
  'JWT',
  'MongoDB',
  'CSS',
  'HTML',
  'Python',
  'Express',
  'Docker'
];

export async function seedTags() {
  try {
    
    for (const tagName of predefinedTags) {
      const existingTag = await Tag.findOne({ name: tagName });
      if (!existingTag) {
        await Tag.create({ name: tagName });
        console.log(`✅ Created tag: ${tagName}`);
      } else {
        console.log(`⚠️  Tag already exists: ${tagName}`);
      }
    }

    console.log('🌱 Tag seeding completed.');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};


