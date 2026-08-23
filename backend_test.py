#!/usr/bin/env python3
"""
Backend API Test Suite for KNDP Admin - Transfer Prospect to Lead Endpoint
Tests the NEW POST /api/admin/prospects/transfer endpoint
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
ADMIN_PASSWORD = "180406kon"

# Test results tracking
test_results = []
created_prospect_ids = []
test_prospect_id = None


def log_test(test_name: str, passed: bool, details: str = ""):
    """Log test result."""
    status = "✅ PASSED" if passed else "❌ FAILED"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"  Details: {details}")
    test_results.append((test_name, passed, details))
    return passed


def test_1_admin_login_correct_password():
    """Test 1: POST /api/admin/login with correct password '180406kon' - should return 200 with token."""
    print("\n" + "="*80)
    print("TEST 1: Admin login with CORRECT password (180406kon)")
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


def test_3_create_test_prospect():
    """Test 3: Create a test prospect via POST /api/admin/prospects/bulk."""
    global test_prospect_id
    
    print("\n" + "="*80)
    print("TEST 3: Create test prospect via bulk endpoint")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/prospects/bulk"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    payload = {
        "prospects": [
            {
                "place_id": "XFER_TEST_1",
                "name": "Transfer Test Biz",
                "address": "Test Str 1, Athens",
                "phone": "+30 210 1234567",
                "email": "xfer@testbiz.gr",
                "website": "https://testbiz.gr",
                "rating": 4.6,
                "maps_url": "https://maps.google.com/xfer",
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
            return log_test("Create test prospect", False, 
                          f"Expected 200, got {response.status_code}")
        
        data = response.json()
        if not isinstance(data, list):
            return log_test("Create test prospect", False, 
                          "Response is not a list")
        
        if len(data) == 0:
            return log_test("Create test prospect", False, 
                          "No prospects created (might already exist - delete XFER_TEST_1 first)")
        
        prospect = data[0]
        test_prospect_id = prospect.get('id')
        
        print(f"\nCreated prospect:")
        print(f"  id: {test_prospect_id}")
        print(f"  place_id: {prospect.get('place_id')}")
        print(f"  name: {prospect.get('name')}")
        print(f"  email: {prospect.get('email')}")
        
        if not test_prospect_id:
            return log_test("Create test prospect", False, 
                          "Prospect created but no ID returned")
        
        return log_test("Create test prospect", True, 
                       f"Prospect created with ID: {test_prospect_id}")
        
    except Exception as e:
        return log_test("Create test prospect", False, f"Exception: {e}")


def test_4_transfer_single_prospect():
    """Test 4: POST /api/admin/prospects/transfer with single prospect ID."""
    global test_prospect_id
    
    print("\n" + "="*80)
    print("TEST 4: Transfer single prospect to leads")
    print("="*80)
    
    if not test_prospect_id:
        return log_test("Transfer single prospect", False, 
                       "No test prospect ID available")
    
    url = f"{API_BASE_URL}/admin/prospects/transfer"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    payload = {"ids": [test_prospect_id]}
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 200:
            return log_test("Transfer single prospect", False, 
                          f"Expected 200, got {response.status_code}")
        
        data = response.json()
        if "transferred" not in data:
            return log_test("Transfer single prospect", False, 
                          "Response missing 'transferred' field")
        
        transferred_count = data["transferred"]
        if transferred_count != 1:
            return log_test("Transfer single prospect", False, 
                          f"Expected transferred=1, got {transferred_count}")
        
        return log_test("Transfer single prospect", True, 
                       f"Successfully transferred 1 prospect")
        
    except Exception as e:
        return log_test("Transfer single prospect", False, f"Exception: {e}")


def test_5_verify_prospect_removed():
    """Test 5: GET /api/admin/prospects - verify prospect is NO LONGER present."""
    global test_prospect_id
    
    print("\n" + "="*80)
    print("TEST 5: Verify prospect removed from prospects list")
    print("="*80)
    
    if not test_prospect_id:
        return log_test("Verify prospect removed", False, 
                       "No test prospect ID available")
    
    url = f"{API_BASE_URL}/admin/prospects"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            return log_test("Verify prospect removed", False, 
                          f"Expected 200, got {response.status_code}")
        
        data = response.json()
        if not isinstance(data, list):
            return log_test("Verify prospect removed", False, 
                          "Response is not a list")
        
        print(f"Total prospects: {len(data)}")
        
        # Check if our test prospect is still there
        for prospect in data:
            if prospect.get('id') == test_prospect_id or prospect.get('place_id') == 'XFER_TEST_1':
                return log_test("Verify prospect removed", False, 
                              f"Prospect {test_prospect_id} still exists in prospects list!")
        
        print(f"✓ Prospect {test_prospect_id} (place_id XFER_TEST_1) is NO LONGER in prospects list")
        
        return log_test("Verify prospect removed", True, 
                       "Prospect successfully removed from prospects list")
        
    except Exception as e:
        return log_test("Verify prospect removed", False, f"Exception: {e}")


def test_6_verify_lead_created():
    """Test 6: GET /api/admin/contacts - verify NEW lead exists with correct data."""
    print("\n" + "="*80)
    print("TEST 6: Verify new lead created in contacts")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/contacts"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            return log_test("Verify lead created", False, 
                          f"Expected 200, got {response.status_code}")
        
        data = response.json()
        if not isinstance(data, list):
            return log_test("Verify lead created", False, 
                          "Response is not a list")
        
        print(f"Total contacts: {len(data)}")
        
        # Find the lead with company="Transfer Test Biz"
        test_lead = None
        for contact in data:
            if contact.get('company') == 'Transfer Test Biz' and contact.get('name') == 'Transfer Test Biz':
                test_lead = contact
                break
        
        if not test_lead:
            return log_test("Verify lead created", False, 
                          "Lead with company='Transfer Test Biz' and name='Transfer Test Biz' not found in contacts")
        
        print(f"\nFound transferred lead:")
        print(f"  id: {test_lead.get('id')}")
        print(f"  name: {test_lead.get('name')}")
        print(f"  company: {test_lead.get('company')}")
        print(f"  status: {test_lead.get('status')}")
        print(f"  phone: {test_lead.get('phone')}")
        print(f"  email: {test_lead.get('email')}")
        print(f"  service: {test_lead.get('service')}")
        print(f"  message: {test_lead.get('message')[:100]}...")
        
        # Verify required fields
        errors = []
        
        if test_lead.get('name') != 'Transfer Test Biz':
            errors.append(f"name mismatch: expected 'Transfer Test Biz', got '{test_lead.get('name')}'")
        
        if test_lead.get('company') != 'Transfer Test Biz':
            errors.append(f"company mismatch: expected 'Transfer Test Biz', got '{test_lead.get('company')}'")
        
        if test_lead.get('status') != 'New':
            errors.append(f"status mismatch: expected 'New', got '{test_lead.get('status')}'")
        
        if test_lead.get('phone') != '+30 210 1234567':
            errors.append(f"phone mismatch: expected '+30 210 1234567', got '{test_lead.get('phone')}'")
        
        if test_lead.get('email') != 'xfer@testbiz.gr':
            errors.append(f"email mismatch: expected 'xfer@testbiz.gr', got '{test_lead.get('email')}'")
        
        # Check message contains category/location/source_query
        message = test_lead.get('message', '')
        if 'οδοντίατροι' not in message:
            errors.append("message does not contain category 'οδοντίατροι'")
        
        if 'Μαρούσι' not in message or 'Αθήνα' not in message:
            errors.append("message does not contain location 'Μαρούσι, Αθήνα'")
        
        if 'οδοντίατροι Μαρούσι' not in message:
            errors.append("message does not contain source_query 'οδοντίατροι Μαρούσι'")
        
        if errors:
            return log_test("Verify lead created", False, 
                          f"Lead data validation failed: {'; '.join(errors)}")
        
        return log_test("Verify lead created", True, 
                       "Lead created with correct data (name, company, status, phone, email, message with category/location/source_query)")
        
    except Exception as e:
        return log_test("Verify lead created", False, f"Exception: {e}")


def test_7_transfer_empty_ids():
    """Test 7: POST /api/admin/prospects/transfer with empty ids array - should return 400."""
    print("\n" + "="*80)
    print("TEST 7: Transfer with empty ids array")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/prospects/transfer"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    payload = {"ids": []}
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 400:
            return log_test("Transfer empty ids", False, 
                          f"Expected 400, got {response.status_code}")
        
        return log_test("Transfer empty ids", True, 
                       "Correctly rejected with 400")
        
    except Exception as e:
        return log_test("Transfer empty ids", False, f"Exception: {e}")


def test_8_transfer_nonexistent_id():
    """Test 8: POST /api/admin/prospects/transfer with non-existent ID - should return 200 with transferred=0."""
    print("\n" + "="*80)
    print("TEST 8: Transfer with non-existent prospect ID")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/prospects/transfer"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    payload = {"ids": ["does-not-exist-123"]}
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 200:
            return log_test("Transfer non-existent ID", False, 
                          f"Expected 200, got {response.status_code}")
        
        data = response.json()
        if "transferred" not in data:
            return log_test("Transfer non-existent ID", False, 
                          "Response missing 'transferred' field")
        
        transferred_count = data["transferred"]
        if transferred_count != 0:
            return log_test("Transfer non-existent ID", False, 
                          f"Expected transferred=0, got {transferred_count}")
        
        return log_test("Transfer non-existent ID", True, 
                       "Correctly returned transferred=0 (skips missing gracefully)")
        
    except Exception as e:
        return log_test("Transfer non-existent ID", False, f"Exception: {e}")


def test_9_transfer_without_auth():
    """Test 9: POST /api/admin/prospects/transfer WITHOUT X-Admin-Token header - should return 401."""
    print("\n" + "="*80)
    print("TEST 9: Transfer without auth token")
    print("="*80)
    
    url = f"{API_BASE_URL}/admin/prospects/transfer"
    payload = {"ids": ["some-id"]}
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code != 401:
            return log_test("Transfer without auth", False, 
                          f"Expected 401, got {response.status_code}")
        
        return log_test("Transfer without auth", True, 
                       "Correctly rejected with 401")
        
    except Exception as e:
        return log_test("Transfer without auth", False, f"Exception: {e}")


def test_10_bulk_transfer_two_prospects():
    """Test 10: Bulk transfer - create two prospects and transfer both in one call."""
    print("\n" + "="*80)
    print("TEST 10: Bulk transfer two prospects")
    print("="*80)
    
    # Create two test prospects
    create_url = f"{API_BASE_URL}/admin/prospects/bulk"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    create_payload = {
        "prospects": [
            {
                "place_id": "XFER_TEST_2",
                "name": "Bulk Transfer Test 2",
                "address": "Test Str 2, Athens",
                "phone": "+30 210 2222222",
                "email": "xfer2@testbiz.gr",
                "website": "https://testbiz2.gr",
                "rating": 4.7,
                "maps_url": "https://maps.google.com/xfer2",
                "source_query": "καφετέριες Αθήνα",
                "category": "καφετέριες",
                "location": "Αθήνα"
            },
            {
                "place_id": "XFER_TEST_3",
                "name": "Bulk Transfer Test 3",
                "address": "Test Str 3, Athens",
                "phone": "+30 210 3333333",
                "email": "xfer3@testbiz.gr",
                "website": "https://testbiz3.gr",
                "rating": 4.8,
                "maps_url": "https://maps.google.com/xfer3",
                "source_query": "γυμναστήρια Αθήνα",
                "category": "γυμναστήρια",
                "location": "Αθήνα"
            }
        ]
    }
    
    try:
        # Create prospects
        create_response = requests.post(create_url, headers=headers, json=create_payload, timeout=10)
        print(f"Create Status Code: {create_response.status_code}")
        
        if create_response.status_code != 200:
            return log_test("Bulk transfer two prospects", False, 
                          f"Failed to create test prospects: {create_response.status_code}")
        
        created = create_response.json()
        if len(created) < 2:
            return log_test("Bulk transfer two prospects", False, 
                          f"Expected 2 prospects created, got {len(created)} (might already exist - delete XFER_TEST_2 and XFER_TEST_3 first)")
        
        prospect_ids = [p['id'] for p in created]
        print(f"Created 2 prospects: {prospect_ids}")
        
        # Transfer both prospects
        transfer_url = f"{API_BASE_URL}/admin/prospects/transfer"
        transfer_payload = {"ids": prospect_ids}
        
        transfer_response = requests.post(transfer_url, headers=headers, json=transfer_payload, timeout=10)
        print(f"Transfer Status Code: {transfer_response.status_code}")
        print(f"Transfer Response: {transfer_response.text}")
        
        if transfer_response.status_code != 200:
            return log_test("Bulk transfer two prospects", False, 
                          f"Expected 200, got {transfer_response.status_code}")
        
        data = transfer_response.json()
        transferred_count = data.get("transferred", 0)
        
        if transferred_count != 2:
            return log_test("Bulk transfer two prospects", False, 
                          f"Expected transferred=2, got {transferred_count}")
        
        # Verify both removed from prospects
        prospects_url = f"{API_BASE_URL}/admin/prospects"
        prospects_response = requests.get(prospects_url, headers=headers, timeout=10)
        prospects = prospects_response.json()
        
        for prospect in prospects:
            if prospect.get('place_id') in ['XFER_TEST_2', 'XFER_TEST_3']:
                return log_test("Bulk transfer two prospects", False, 
                              f"Prospect {prospect.get('place_id')} still in prospects list after transfer")
        
        print("✓ Both prospects removed from prospects list")
        
        # Verify both added to contacts
        contacts_url = f"{API_BASE_URL}/admin/contacts"
        contacts_response = requests.get(contacts_url, headers=headers, timeout=10)
        contacts = contacts_response.json()
        
        found_count = 0
        for contact in contacts:
            if contact.get('company') in ['Bulk Transfer Test 2', 'Bulk Transfer Test 3']:
                found_count += 1
                print(f"✓ Found lead: {contact.get('company')}")
        
        if found_count != 2:
            return log_test("Bulk transfer two prospects", False, 
                          f"Expected 2 new leads in contacts, found {found_count}")
        
        return log_test("Bulk transfer two prospects", True, 
                       "Successfully transferred 2 prospects, both removed from prospects, both added to contacts")
        
    except Exception as e:
        return log_test("Bulk transfer two prospects", False, f"Exception: {e}")


def test_11_regression_places_search():
    """Test 11: Regression - GET /api/admin/places/search still works with email scraping."""
    print("\n" + "="*80)
    print("TEST 11: Regression - Places search with email scraping")
    print("="*80)
    print("⚠️  NOTE: This endpoint scrapes websites for emails and is SLOW (can take 30-120 seconds)")
    
    url = f"{API_BASE_URL}/admin/places/search"
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    params = {"q": "καφε Μαρουσι"}
    
    try:
        print("Sending request with 120s timeout...")
        start_time = time.time()
        response = requests.get(url, headers=headers, params=params, timeout=120)
        elapsed = time.time() - start_time
        
        print(f"Status Code: {response.status_code}")
        print(f"Request took {elapsed:.1f} seconds")
        
        if response.status_code != 200:
            return log_test("Regression - Places search", False, 
                          f"Expected 200, got {response.status_code}. Response: {response.text[:500]}")
        
        data = response.json()
        
        if "results" not in data:
            return log_test("Regression - Places search", False, "Missing 'results' field")
        
        results = data["results"]
        print(f"Number of results: {len(results)}")
        
        if len(results) == 0:
            return log_test("Regression - Places search", False, "No results returned")
        
        # Check each result has 'email' key
        for i, result in enumerate(results):
            if "email" not in result:
                return log_test("Regression - Places search", False, 
                              f"Result {i} missing 'email' key")
        
        print(f"✓ All {len(results)} results have 'email' key")
        
        return log_test("Regression - Places search", True, 
                       f"Places search working correctly with {len(results)} results, all have 'email' key")
        
    except requests.exceptions.Timeout:
        return log_test("Regression - Places search", False, 
                       "Request timed out after 120 seconds")
    except Exception as e:
        return log_test("Regression - Places search", False, f"Exception: {e}")


def cleanup_test_data():
    """Clean up any test leads/prospects created during testing."""
    print("\n" + "="*80)
    print("CLEANUP: Removing test data")
    print("="*80)
    
    headers = {"X-Admin-Token": ADMIN_PASSWORD}
    
    try:
        # Get all contacts and delete test leads
        contacts_url = f"{API_BASE_URL}/admin/contacts"
        contacts_response = requests.get(contacts_url, headers=headers, timeout=10)
        
        if contacts_response.status_code == 200:
            contacts = contacts_response.json()
            test_companies = ['Transfer Test Biz', 'Bulk Transfer Test 2', 'Bulk Transfer Test 3']
            
            for contact in contacts:
                if contact.get('company') in test_companies:
                    contact_id = contact.get('id')
                    delete_url = f"{API_BASE_URL}/admin/contacts/{contact_id}"
                    delete_response = requests.delete(delete_url, headers=headers, timeout=10)
                    if delete_response.status_code in [200, 204]:
                        print(f"✓ Deleted test lead: {contact.get('company')}")
        
        # Get all prospects and delete test prospects
        prospects_url = f"{API_BASE_URL}/admin/prospects"
        prospects_response = requests.get(prospects_url, headers=headers, timeout=10)
        
        if prospects_response.status_code == 200:
            prospects = prospects_response.json()
            test_place_ids = ['XFER_TEST_1', 'XFER_TEST_2', 'XFER_TEST_3']
            
            for prospect in prospects:
                if prospect.get('place_id') in test_place_ids:
                    prospect_id = prospect.get('id')
                    delete_url = f"{API_BASE_URL}/admin/prospects/{prospect_id}"
                    delete_response = requests.delete(delete_url, headers=headers, timeout=10)
                    if delete_response.status_code in [200, 204]:
                        print(f"✓ Deleted test prospect: {prospect.get('place_id')}")
        
        print("Cleanup complete")
        
    except Exception as e:
        print(f"⚠️  Cleanup failed: {e}")


def main():
    """Run all tests."""
    print("\n" + "="*80)
    print("KNDP ADMIN - TRANSFER PROSPECT TO LEAD ENDPOINT TEST SUITE")
    print("Testing POST /api/admin/prospects/transfer")
    print("="*80)
    print(f"Backend URL: {BACKEND_BASE_URL}")
    print(f"API Base URL: {API_BASE_URL}")
    print(f"Admin Password: {ADMIN_PASSWORD}")
    
    tests = [
        test_1_admin_login_correct_password,
        test_2_admin_login_wrong_password,
        test_3_create_test_prospect,
        test_4_transfer_single_prospect,
        test_5_verify_prospect_removed,
        test_6_verify_lead_created,
        test_7_transfer_empty_ids,
        test_8_transfer_nonexistent_id,
        test_9_transfer_without_auth,
        test_10_bulk_transfer_two_prospects,
        test_11_regression_places_search,
    ]
    
    for test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"\n❌ EXCEPTION in {test_func.__name__}: {e}")
            test_results.append((test_func.__name__, False, f"Exception: {e}"))
    
    # Cleanup
    cleanup_test_data()
    
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
