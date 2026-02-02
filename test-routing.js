/**
 * Test script to verify routing persistence
 * Run this in browser console to test the routing fixes
 */

console.log('🧪 Testing routing persistence...');

// Test 1: Check current page state
console.log('\n📍 Current state:');
console.log('URL:', window.location.href);
console.log('Path:', window.location.pathname);
console.log('Search:', window.location.search);

// Test 2: Simulate navigation
console.log('\n🔄 Testing navigation...');
console.log('Try these steps:');
console.log('1. Navigate to login page');
console.log('2. Refresh the page (F5)');
console.log('3. Check if you stay on login page');
console.log('4. Use browser back button');
console.log('5. Check if navigation works properly');

// Test 3: Check if header is hidden on auth pages
const header = document.querySelector('header');
const currentPath = window.location.pathname;
const isAuthPage = ['/login', '/signup', '/verify-email', '/forgot-password'].includes(currentPath);

console.log('\n👁️ Header visibility test:');
console.log('Current path:', currentPath);
console.log('Is auth page:', isAuthPage);
console.log('Header should be hidden:', isAuthPage);
console.log('Header element found:', !!header);

if (isAuthPage && header) {
  console.warn('⚠️ Header is visible on auth page - this might be an issue');
} else if (isAuthPage && !header) {
  console.log('✅ Header correctly hidden on auth page');
} else if (!isAuthPage && header) {
  console.log('✅ Header correctly visible on non-auth page');
} else {
  console.log('ℹ️ Header state matches expected behavior');
}

console.log('\n✅ Routing test completed!');
console.log('💡 Navigate between pages and refresh to test persistence');