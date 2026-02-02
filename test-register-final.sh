#!/bin/bash

echo "=========================================="
echo "Testing Registration Endpoint"
echo "=========================================="
echo ""

# Generate unique email
EMAIL="testuser_$(date +%s)@example.com"

echo "Test Details:"
echo "- Backend: http://localhost:8081"
echo "- Endpoint: POST /api/v1/auth/register"
echo "- Email: $EMAIL"
echo "- Password: Test@123456"
echo ""

# Make the request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'",
    "password": "Test@123456",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "job_seeker"
  }')

# Extract status code
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "HTTP Status: $HTTP_CODE"
echo ""
echo "Response:"
echo "$BODY"
echo ""

# Check result
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  echo "✅ SUCCESS! Registration endpoint is working!"
  if echo "$BODY" | grep -q "accessToken"; then
    echo "✅ Access token received!"
  fi
elif [ "$HTTP_CODE" = "400" ]; then
  echo "⚠️  Bad Request (400) - Check payload format"
elif [ "$HTTP_CODE" = "409" ]; then
  echo "⚠️  Conflict (409) - Email may already be registered"
elif [ "$HTTP_CODE" = "403" ]; then
  echo "❌ Forbidden (403) - CORS or Auth issue still present"
else
  echo "⚠️  Unexpected status code: $HTTP_CODE"
fi
