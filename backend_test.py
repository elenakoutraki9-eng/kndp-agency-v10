#!/usr/bin/env python3
"""
Backend API Test Suite for KNDP Lead Finder Admin Endpoints
Tests email scraping enrichment and prospect management
"""
import requests
import json
import time
from typing import Dict, Any, List, Optional

# Load backend URL from frontend .env
FRONTEND_ENV_PATH = "/app/frontend/.env"
with open(FRONTEND_ENV_PATH, 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_BASE_URL = line.split('=', 1)[1].strip()
            break

API_BASE_URL = f"{BACKEND_BASE_URL}/api"
ADMIN_PASSWORD = "kndp2025"

# Test results tracking
test_results = []
created_prospect_ids = []


def log_test(test_name: str, passed: bool, details: str = ""):
    """Log test result."""
    status = "✅ PASSED" if passed else "❌ FAILED"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"  Details: {details}")
    test_results.append((test_name, passed, details))
    return passed


def test_1_admin_login_correct_password():
    """Test 1: POST /api/admin/login with correct password 'kndp2025' - should return 200 with token."""
    print("\n" + "="*80)
    print("TEST 1: Admin login with CORRECT password")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/login"
    payload = {"password": ADMIN_PASSWORD}
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 200:
            return log_test("Admin login (correct password)", False, 
                          f"Expected 200, got {response.status_code}")
        
        data = response.json()
        if "token" not in data:
            return log_test("Admin login (correct password)", False, 
                          "Response missing 'token' field")
        
        token = data["token"]
        if not token:
            return log_test("Admin login (correct password)", False, 
                          "Token is empty")
        
        return log_test("Admin login (correct password)", True, 
                       f"Token received: {token}")
        
    except Exception as e:
        return log_test("Admin login (correct password)", False, f"Exception: {e}")


def test_2_admin_login_wrong_password():
    """Test 2: POST /api/admin/login with wrong password - should return 401."""
    print("\n" + "="*80)
    print("TEST 2: Admin login with WRONG password")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/login"
    payload = {"password": "wrong_password_123"}
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 401:
            return log_test("Admin login (wrong password)", False, 
                          f"Expected 401, got {response.status_code}")
        
        return log_test("Admin login (wrong password)", True, 
                       "Correctly rejected with 401")
        
    except Exception as e:
        return log_test("Admin login (wrong password)", False, f"Exception: {e}")


def test_3_places_search_with_auth():
    """Test 3: GET /api/admin/places/search with auth and valid query - should return 200 with results including email field."""
    print("\n" + "="*80)
    print("TEST 3: Places search WITH auth (οδοντίατροι Μαρούσι)")
    print("="*80)
    print("⚠️  NOTE: This endpoint scrapes websites for emails and is SLOW (can take 30-120 seconds)")
    
    url = f"{API_BASE_URL}/admin/places/search"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    params = {"q": "οδοντίατροι Μαρούσι"}
    
    try:
        print("Sending request with 120s timeout...")
        start_time = time.time()
        response = requests.get(url, headers=headers, params=params, timeout=120)
        elapsed = time.time() - start_time
        
        print(f"Status Code: {response.status_code}")
        print(f"Request took {elapsed:.1f} seconds")
        
        if response.status_code != 200:
            return log_test("Places search (with auth)", False, 
                          f"Expected 200, got {response.status_code}. Response: {response.text[:500]}")
        
        data = response.json()
        print(f"Response keys: {list(data.keys())}")
        
        # Check response shape
        if "query" not in data:
            return log_test("Places search (with auth)", False, "Missing 'query' field")
        if "results" not in data:
            return log_test("Places search (with auth)", False, "Missing 'results' field")
        
        results = data["results"]
        print(f"Query: {data['query']}")
        print(f"Number of results: {len(results)}")
        
        if len(results) == 0:
            return log_test("Places search (with auth)", False, "No results returned")
        
        # Check EACH result has required keys including 'email'
        required_keys = ["place_id", "name", "address", "phone", "email", "website", "rating", "maps_url"]
        
        print(f"\nValidating {len(results)} results...")
        emails_found = 0
        
        for i, result in enumerate(results):
            # Check all required keys exist
            missing_keys = [key for key in required_keys if key not in result]
            if missing_keys:
                return log_test("Places search (with auth)", False, 
                              f"Result {i} missing keys: {missing_keys}")
            
            # Count non-null emails
            if result.get("email") is not None and result.get("email") != "":
                emails_found += 1
            
            # Print first 3 results for inspection
            if i < 3:
                print(f"\n  Result {i}:")
                print(f"    place_id: {result.get('place_id')}")
                print(f"    name: {result.get('name')}")
                print(f"    address: {result.get('address')}")
                print(f"    phone: {result.get('phone')}")
                print(f"    email: {result.get('email')}")
                print(f"    website: {result.get('website')}")
                print(f"    rating: {result.get('rating')}")
                print(f"    maps_url: {result.get('maps_url')}")
        
        print(f"\n✓ All {len(results)} results have 'email' key (value can be string or null)")
        print(f"✓ {emails_found} results have non-null email addresses")
        
        return log_test("Places search (with auth)", True, 
                       f"{len(results)} results returned, all have 'email' key, {emails_found} have non-null emails")
        
    except requests.exceptions.Timeout:
        return log_test("Places search (with auth)", False, 
                       "Request timed out after 120 seconds")
    except Exception as e:
        return log_test("Places search (with auth)", False, f"Exception: {e}")


def test_4_places_search_without_auth():
    """Test 4: GET /api/admin/places/search WITHOUT auth - should return 401."""
    print("\n" + "="*80)
    print("TEST 4: Places search WITHOUT auth")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/places/search"
    params = {"q": "οδοντίατροι Μαρούσι"}
    
    try:
        response = requests.get(url, params=params, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 401:
            return log_test("Places search (without auth)", False, 
                          f"Expected 401, got {response.status_code}")
        
        return log_test("Places search (without auth)", True, 
                       "Correctly rejected with 401")
        
    except Exception as e:
        return log_test("Places search (without auth)", False, f"Exception: {e}")


def test_5_places_search_short_query():
    """Test 5: GET /api/admin/places/search with 1-char query - should return 400."""
    print("\n" + "="*80)
    print("TEST 5: Places search with 1-char query")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/places/search"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    params = {"q": "a"}
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 400:
            return log_test("Places search (1-char query)", False, 
                          f"Expected 400, got {response.status_code}")
        
        return log_test("Places search (1-char query)", True, 
                       "Correctly rejected with 400")
        
    except Exception as e:
        return log_test("Places search (1-char query)", False, f"Exception: {e}")


def test_6_create_prospect_with_email():
    """Test 6: POST /api/admin/prospects/bulk - create prospect with email field."""
    print("\n" + "="*80)
    print("TEST 6: Create prospect with email field")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/prospects/bulk"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    payload = {
        "prospects": [
            {
                "place_id": "TEST_PLACE_1",
                "name": "Test Biz",
                "address": "Test Addr",
                "phone": "+30 111",
                "email": "test@example-biz.gr",
                "website": "https://example-biz.gr",
                "rating": 4.5,
                "maps_url": "https://maps.google.com/x",
                "source_query": "οδοντίατροι Μαρούσι",
                "category": "οδοντίατροι",
                "location": "Μαρούσι, Αθήνα"
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 200:
            return log_test("Create prospect (with email)", False, 
                          f"Expected 200, got {response.status_code}")
        
        data = response.json()
        if not isinstance(data, list):
            return log_test("Create prospect (with email)", False, 
                          "Response is not a list")
        
        if len(data) == 0:
            return log_test("Create prospect (with email)", False, 
                          "No prospects created (might already exist)")
        
        prospect = data[0]
        print(f"\nCreated prospect:")
        print(f"  id: {prospect.get('id')}")
        print(f"  place_id: {prospect.get('place_id')}")
        print(f"  name: {prospect.get('name')}")
        print(f"  email: {prospect.get('email')}")
        print(f"  source_query: {prospect.get('source_query')}")
        print(f"  category: {prospect.get('category')}")
        print(f"  location: {prospect.get('location')}")
        
        # Store ID for later deletion
        if prospect.get('id'):
            created_prospect_ids.append(prospect['id'])
        
        # Verify email field is present and correct
        if prospect.get('email') != "test@example-biz.gr":
            return log_test("Create prospect (with email)", False, 
                          f"Email mismatch: expected 'test@example-biz.gr', got '{prospect.get('email')}'")
        
        # Verify source_query, category, location fields
        if prospect.get('source_query') != "οδοντίατροι Μαρούσι":
            return log_test("Create prospect (with email)", False, 
                          f"source_query mismatch")
        if prospect.get('category') != "οδοντίατροι":
            return log_test("Create prospect (with email)", False, 
                          f"category mismatch")
        if prospect.get('location') != "Μαρούσι, Αθήνα":
            return log_test("Create prospect (with email)", False, 
                          f"location mismatch")
        
        return log_test("Create prospect (with email)", True, 
                       f"Prospect created with email, source_query, category, location")
        
    except Exception as e:
        return log_test("Create prospect (with email)", False, f"Exception: {e}")


def test_7_get_prospects_verify_email():
    """Test 7: GET /api/admin/prospects - verify email persistence."""
    print("\n" + "="*80)
    print("TEST 7: Get prospects and verify email persistence")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/prospects"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            return log_test("Get prospects (verify email)", False, 
                          f"Expected 200, got {response.status_code}")
        
        data = response.json()
        if not isinstance(data, list):
            return log_test("Get prospects (verify email)", False, 
                          "Response is not a list")
        
        print(f"Total prospects: {len(data)}")
        
        # Find our test prospect
        test_prospect = None
        for prospect in data:
            if prospect.get('place_id') == 'TEST_PLACE_1':
                test_prospect = prospect
                break
        
        if not test_prospect:
            return log_test("Get prospects (verify email)", False, 
                          "Test prospect (TEST_PLACE_1) not found in list")
        
        print(f"\nFound test prospect:")
        print(f"  id: {test_prospect.get('id')}")
        print(f"  place_id: {test_prospect.get('place_id')}")
        print(f"  name: {test_prospect.get('name')}")
        print(f"  email: {test_prospect.get('email')}")
        print(f"  source_query: {test_prospect.get('source_query')}")
        
        # Verify email is persisted
        if test_prospect.get('email') != "test@example-biz.gr":
            return log_test("Get prospects (verify email)", False, 
                          f"Email not persisted correctly: got '{test_prospect.get('email')}'")
        
        # Verify source_query is persisted
        if test_prospect.get('source_query') != "οδοντίατροι Μαρούσι":
            return log_test("Get prospects (verify email)", False, 
                          f"source_query not persisted correctly")
        
        return log_test("Get prospects (verify email)", True, 
                       f"Email and source_query persisted correctly")
        
    except Exception as e:
        return log_test("Get prospects (verify email)", False, f"Exception: {e}")


def test_8_idempotency_duplicate_place_id():
    """Test 8: POST /api/admin/prospects/bulk with duplicate place_id - should NOT create duplicate."""
    print("\n" + "="*80)
    print("TEST 8: Idempotency - duplicate place_id")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/prospects/bulk"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    payload = {
        "prospects": [
            {
                "place_id": "TEST_PLACE_1",
                "name": "Test Biz Duplicate",
                "address": "Test Addr 2",
                "phone": "+30 222",
                "email": "duplicate@example-biz.gr",
                "website": "https://example-biz.gr",
                "rating": 4.0,
                "maps_url": "https://maps.google.com/y",
                "source_query": "test query",
                "category": "test",
                "location": "test location"
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 200:
            return log_test("Idempotency (duplicate place_id)", False, 
                          f"Expected 200, got {response.status_code}")
        
        data = response.json()
        if not isinstance(data, list):
            return log_test("Idempotency (duplicate place_id)", False, 
                          "Response is not a list")
        
        # Should return empty list or skip the duplicate
        if len(data) > 0:
            return log_test("Idempotency (duplicate place_id)", False, 
                          f"Duplicate was created: {data}")
        
        print("✓ Duplicate place_id was correctly skipped")
        
        return log_test("Idempotency (duplicate place_id)", True, 
                       "Duplicate place_id correctly skipped")
        
    except Exception as e:
        return log_test("Idempotency (duplicate place_id)", False, f"Exception: {e}")


def test_9_delete_single_prospect():
    """Test 9: DELETE /api/admin/prospects/{id} - delete single prospect."""
    print("\n" + "="*80)
    print("TEST 9: Delete single prospect")
    print("="*80)
    
    if not created_prospect_ids:
        return log_test("Delete single prospect", False, 
                       "No prospect ID available for deletion")
    
    prospect_id = created_prospect_ids[0]
    url = f"{API_BASE_URL}/admin/prospects/{prospect_id}"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    
    try:
        response = requests.delete(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code not in [200, 204]:
            return log_test("Delete single prospect", False, 
                          f"Expected 200/204, got {response.status_code}")
        
        data = response.json()
        if not data.get('deleted'):
            return log_test("Delete single prospect", False, 
                          "Response does not indicate successful deletion")
        
        # Verify it's actually deleted
        get_url = f"{API_BASE_URL}/admin/prospects"
        get_response = requests.get(get_url, headers=headers, timeout=10)
        prospects = get_response.json()
        
        for prospect in prospects:
            if prospect.get('id') == prospect_id:
                return log_test("Delete single prospect", False, 
                              "Prospect still exists after deletion")
        
        print(f"✓ Prospect {prospect_id} successfully deleted")
        
        return log_test("Delete single prospect", True, 
                       f"Prospect {prospect_id} deleted successfully")
        
    except Exception as e:
        return log_test("Delete single prospect", False, f"Exception: {e}")


def test_10_bulk_delete_prospects():
    """Test 10: POST /api/admin/prospects/bulk-delete - delete multiple prospects."""
    print("\n" + "="*80)
    print("TEST 10: Bulk delete prospects")
    print("="*80)
    
    # First create 2 test prospects
    create_url = f"{API_BASE_URL}/admin/prospects/bulk"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    payload = {
        "prospects": [
            {
                "place_id": "TEST_BULK_DELETE_1",
                "name": "Bulk Delete Test 1",
                "address": "Test Addr 1",
                "phone": "+30 111",
                "email": "bulk1@test.gr",
                "website": "https://test1.gr",
                "rating": 4.0,
                "maps_url": "https://maps.google.com/1"
            },
            {
                "place_id": "TEST_BULK_DELETE_2",
                "name": "Bulk Delete Test 2",
                "address": "Test Addr 2",
                "phone": "+30 222",
                "email": "bulk2@test.gr",
                "website": "https://test2.gr",
                "rating": 4.5,
                "maps_url": "https://maps.google.com/2"
            }
        ]
    }
    
    try:
        # Create prospects
        create_response = requests.post(create_url, headers=headers, json=payload, timeout=10)
        if create_response.status_code != 200:
            return log_test("Bulk delete prospects", False, 
                          f"Failed to create test prospects: {create_response.status_code}")
        
        created = create_response.json()
        if len(created) < 2:
            return log_test("Bulk delete prospects", False, 
                          f"Expected 2 prospects created, got {len(created)}")
        
        ids_to_delete = [p['id'] for p in created]
        print(f"Created {len(ids_to_delete)} test prospects: {ids_to_delete}")
        
        # Now bulk delete them
        delete_url = f"{API_BASE_URL}/admin/prospects/bulk-delete"
        delete_payload = {"ids": ids_to_delete}
        
        delete_response = requests.post(delete_url, headers=headers, json=delete_payload, timeout=10)
        print(f"Status Code: {delete_response.status_code}")
        print(f"Response: {delete_response.text}")
        
        if delete_response.status_code != 200:
            return log_test("Bulk delete prospects", False, 
                          f"Expected 200, got {delete_response.status_code}")
        
        data = delete_response.json()
        deleted_count = data.get('deleted', 0)
        
        if deleted_count != len(ids_to_delete):
            return log_test("Bulk delete prospects", False, 
                          f"Expected {len(ids_to_delete)} deleted, got {deleted_count}")
        
        # Verify they're actually deleted
        get_url = f"{API_BASE_URL}/admin/prospects"
        get_response = requests.get(get_url, headers=headers, timeout=10)
        prospects = get_response.json()
        
        for prospect in prospects:
            if prospect.get('id') in ids_to_delete:
                return log_test("Bulk delete prospects", False, 
                              f"Prospect {prospect.get('id')} still exists after bulk deletion")
        
        print(f"✓ {deleted_count} prospects successfully bulk deleted")
        
        return log_test("Bulk delete prospects", True, 
                       f"{deleted_count} prospects bulk deleted successfully")
        
    except Exception as e:
        return log_test("Bulk delete prospects", False, f"Exception: {e}")


def main():
    """Run all tests."""
    print("\n" + "="*80)
    print("KNDP LEAD FINDER ADMIN BACKEND API TEST SUITE")
    print("Testing email scraping enrichment and prospect management")
    print("="*80)
    print(f"Backend URL: {BACKEND_BASE_URL}")
    print(f"API Base URL: {API_BASE_URL}")
    print(f"Admin Password: {ADMIN_PASSWORD}")
    
    tests = [
        test_1_admin_login_correct_password,
        test_2_admin_login_wrong_password,
        test_3_places_search_with_auth,
        test_4_places_search_without_auth,
        test_5_places_search_short_query,
        test_6_create_prospect_with_email,
        test_7_get_prospects_verify_email,
        test_8_idempotency_duplicate_place_id,
        test_9_delete_single_prospect,
        test_10_bulk_delete_prospects,
    ]
    
    for test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"\n❌ EXCEPTION in {test_func.__name__}: {e}")
            test_results.append((test_func.__name__, False, f"Exception: {e}"))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed_count = sum(1 for _, passed, _ in test_results if passed)
    total_count = len(test_results)
    
    for test_name, passed, details in test_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {test_name}")
        if not passed and details:
            print(f"  → {details}")
    
    print(f"\nTotal: {passed_count}/{total_count} tests passed")
    
    if passed_count == total_count:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total_count - passed_count} test(s) failed")
        return 1


if __name__ == "__main__":
    exit(main())
