#!/bin/bash

echo "Testing Registration Endpoint..."
echo "================================="

RESPONSE=$(curl -s -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_'"$(date +%s)"'@example.com",
    "password": "Test@123456",
    "firstName": "TestUser",
    "lastName": "Dev",
    "userType": "job_seeker"
  }')

echo "Response:"
echo "$RESPONSE"
echo ""

# Check if response contains accessToken
if echo "$RESPONSE" | grep -q "accessToken"; then
  echo "✅ Registration Successful!"
  echo "$RESPONSE" | grep -o '"accessToken":"[^"]*"' || true
else
  echo "❌ Registration Failed or Incomplete Response"
fi
