/**
 * Test script to verify token handling fixes
 * Run this in browser console to test the fixes
 */

console.log('🧪 Testing token handling fixes...');

// Test 1: Set invalid tokens and see if they get cleared
console.log('\n📝 Test 1: Setting invalid tokens');
localStorage.setItem('accessToken', 'undefined');
localStorage.setItem('refreshToken', 'undefined');
localStorage.setItem('user', 'undefined');

console.log('Set invalid tokens:', {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: localStorage.getItem('user')
});

// Test 2: Check if debug function works
if (window.debugTokens) {
  console.log('\n🔍 Test 2: Running debug function');
  window.debugTokens();
} else {
  console.log('\n⚠️ Debug function not available (not in development mode)');
}

// Test 3: Clear tokens
if (window.clearAllTokens) {
  console.log('\n🧹 Test 3: Clearing all tokens');
  window.clearAllTokens();
  console.log('Tokens after clearing:', {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: localStorage.getItem('user')
  });
} else {
  console.log('\n⚠️ Clear function not available (not in development mode)');
}

console.log('\n✅ Token handling test completed!');
console.log('💡 Now refresh the page to see if the app handles invalid tokens properly');