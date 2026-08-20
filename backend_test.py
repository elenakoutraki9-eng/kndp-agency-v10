#!/usr/bin/env python3
"""
Backend API Test Suite for KNDP FastAPI App
Tests the POST /api/generate-ideas endpoint
"""
import requests
import json
import os
import re
from typing import Dict, Any

# Load backend URL from frontend .env
FRONTEND_ENV_PATH = "/app/frontend/.env"
with open(FRONTEND_ENV_PATH, 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_BASE_URL = line.split('=', 1)[1].strip()
            break

API_BASE_URL = f"{BACKEND_BASE_URL}/api"
GENERATE_IDEAS_URL = f"{API_BASE_URL}/generate-ideas"

# Expected categories
VALID_CATEGORIES = [
    "Ιστοσελίδες",
    "Web Apps",
    "Mobile Apps",
    "Έξυπνα Εργαλεία",
    "Web Tools",
    "Automations",
    "Προγράμματα",
]

# Test timeout (LLM calls can take time)
REQUEST_TIMEOUT = 60


def check_forbidden_content(text: str) -> tuple[bool, list[str]]:
    """Check if text contains forbidden words/phrases (case-insensitive)."""
    forbidden = []
    # Check for standalone "AI" (not part of other words)
    if re.search(r'\bAI\b', text, re.IGNORECASE):
        forbidden.append("AI")
    # Check for "τεχνητή νοημοσύνη"
    if re.search(r'τεχνητή\s+νοημοσύνη', text, re.IGNORECASE):
        forbidden.append("τεχνητή νοημοσύνη")
    return len(forbidden) == 0, forbidden


def test_valid_business_kafeteria():
    """Test 1: Valid business 'Καφετέρια' - should return 200 with ideas."""
    print("\n" + "="*80)
    print("TEST 1: Valid business 'Καφετέρια'")
    print("="*80)
    
    payload = {"business": "Καφετέρια"}
    try:
        response = requests.post(GENERATE_IDEAS_URL, json=payload, timeout=REQUEST_TIMEOUT)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        print(f"Response keys: {list(data.keys())}")
        print(f"Business: {data.get('business')}")
        print(f"Total ideas: {data.get('total')}")
        print(f"Ideas returned: {len(data.get('ideas', []))}")
        print(f"Has more: {data.get('has_more')}")
        print(f"Limit: {data.get('limit')}")
        
        # Validate response shape
        required_keys = ["business", "ideas", "total", "has_more", "limit"]
        for key in required_keys:
            if key not in data:
                print(f"❌ FAILED: Missing key '{key}' in response")
                return False
        
        # Check ideas structure
        ideas = data.get("ideas", [])
        if len(ideas) == 0:
            print("❌ FAILED: No ideas returned")
            return False
        
        if len(ideas) > 15:
            print(f"❌ FAILED: Too many ideas returned ({len(ideas)} > 15)")
            return False
        
        # Check each idea
        print(f"\nValidating {len(ideas)} ideas:")
        for i, idea in enumerate(ideas):
            print(f"\n  Idea {i+1}:")
            print(f"    Category: {idea.get('category')}")
            print(f"    Title: {idea.get('title')}")
            print(f"    Description: {idea.get('description')[:80]}..." if len(idea.get('description', '')) > 80 else f"    Description: {idea.get('description')}")
            
            # Check required fields
            if not idea.get('title'):
                print(f"    ❌ FAILED: Idea {i+1} has empty title")
                return False
            
            # Check category is valid
            category = idea.get('category')
            if category not in VALID_CATEGORIES:
                print(f"    ❌ FAILED: Idea {i+1} has invalid category '{category}'")
                print(f"    Valid categories: {VALID_CATEGORIES}")
                return False
            
            # Check for forbidden content
            title_ok, title_forbidden = check_forbidden_content(idea.get('title', ''))
            desc_ok, desc_forbidden = check_forbidden_content(idea.get('description', ''))
            
            if not title_ok:
                print(f"    ❌ FAILED: Idea {i+1} title contains forbidden words: {title_forbidden}")
                return False
            if not desc_ok:
                print(f"    ❌ FAILED: Idea {i+1} description contains forbidden words: {desc_forbidden}")
                return False
        
        # Check has_more logic
        total = data.get('total')
        has_more = data.get('has_more')
        if total > 15 and not has_more:
            print(f"❌ FAILED: total={total} > 15 but has_more={has_more}")
            return False
        if total <= 15 and has_more:
            print(f"❌ FAILED: total={total} <= 15 but has_more={has_more}")
            return False
        if total > 15 and len(ideas) != 15:
            print(f"❌ FAILED: total={total} > 15 but only {len(ideas)} ideas returned (expected 15)")
            return False
        
        print("\n✅ PASSED: Valid business 'Καφετέρια' test")
        return True
        
    except requests.exceptions.Timeout:
        print(f"❌ FAILED: Request timed out after {REQUEST_TIMEOUT}s")
        return False
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_valid_business_gymnastirio():
    """Test 2: Valid business 'Γυμναστήριο' - should return 200 with ideas."""
    print("\n" + "="*80)
    print("TEST 2: Valid business 'Γυμναστήριο'")
    print("="*80)
    
    payload = {"business": "Γυμναστήριο"}
    try:
        response = requests.post(GENERATE_IDEAS_URL, json=payload, timeout=REQUEST_TIMEOUT)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        ideas = data.get("ideas", [])
        
        if len(ideas) == 0:
            print("❌ FAILED: No ideas returned")
            return False
        
        print(f"✅ PASSED: Valid business 'Γυμναστήριο' returned {len(ideas)} ideas")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_valid_business_dikigoriko():
    """Test 3: Valid business 'Δικηγορικό γραφείο' - should return 200 with ideas."""
    print("\n" + "="*80)
    print("TEST 3: Valid business 'Δικηγορικό γραφείο'")
    print("="*80)
    
    payload = {"business": "Δικηγορικό γραφείο"}
    try:
        response = requests.post(GENERATE_IDEAS_URL, json=payload, timeout=REQUEST_TIMEOUT)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        ideas = data.get("ideas", [])
        
        if len(ideas) == 0:
            print("❌ FAILED: No ideas returned")
            return False
        
        print(f"✅ PASSED: Valid business 'Δικηγορικό γραφείο' returned {len(ideas)} ideas")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_empty_business():
    """Test 4: Empty business string - should return 400."""
    print("\n" + "="*80)
    print("TEST 4: Empty business string")
    print("="*80)
    
    payload = {"business": ""}
    try:
        response = requests.post(GENERATE_IDEAS_URL, json=payload, timeout=REQUEST_TIMEOUT)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected 400, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        print("✅ PASSED: Empty business returns 400")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_whitespace_business():
    """Test 5: Whitespace-only business - should return 400."""
    print("\n" + "="*80)
    print("TEST 5: Whitespace-only business")
    print("="*80)
    
    payload = {"business": "   "}
    try:
        response = requests.post(GENERATE_IDEAS_URL, json=payload, timeout=REQUEST_TIMEOUT)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected 400, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        print("✅ PASSED: Whitespace-only business returns 400")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_very_long_business():
    """Test 6: Very long business (>120 chars) - should return 200 (truncated)."""
    print("\n" + "="*80)
    print("TEST 6: Very long business (>120 chars)")
    print("="*80)
    
    # Create a 150-character business string
    long_business = "Καφετέρια με πολύ μεγάλο όνομα που έχει πάρα πολλά γράμματα και συνεχίζει να γράφει και άλλα πράγματα για να φτάσει τους εκατόν πενήντα χαρακτήρες"
    print(f"Input length: {len(long_business)} chars")
    
    payload = {"business": long_business}
    try:
        response = requests.post(GENERATE_IDEAS_URL, json=payload, timeout=REQUEST_TIMEOUT)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        returned_business = data.get("business", "")
        print(f"Returned business length: {len(returned_business)} chars")
        print(f"Returned business: {returned_business}")
        
        if len(returned_business) > 120:
            print(f"❌ FAILED: Business not truncated (length={len(returned_business)})")
            return False
        
        ideas = data.get("ideas", [])
        if len(ideas) == 0:
            print("❌ FAILED: No ideas returned")
            return False
        
        print("✅ PASSED: Very long business truncated and returned 200")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_malformed_request():
    """Test 7: Malformed request (missing 'business' key) - should return 422."""
    print("\n" + "="*80)
    print("TEST 7: Malformed request (missing 'business' key)")
    print("="*80)
    
    payload = {"wrong_key": "Καφετέρια"}
    try:
        response = requests.post(GENERATE_IDEAS_URL, json=payload, timeout=REQUEST_TIMEOUT)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 422:
            print(f"❌ FAILED: Expected 422, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        print("✅ PASSED: Malformed request returns 422")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def main():
    """Run all tests."""
    print("\n" + "="*80)
    print("KNDP BACKEND API TEST SUITE")
    print("Testing POST /api/generate-ideas endpoint")
    print("="*80)
    print(f"Backend URL: {BACKEND_BASE_URL}")
    print(f"API Base URL: {API_BASE_URL}")
    print(f"Generate Ideas URL: {GENERATE_IDEAS_URL}")
    print(f"Request Timeout: {REQUEST_TIMEOUT}s")
    
    tests = [
        ("Valid business 'Καφετέρια'", test_valid_business_kafeteria),
        ("Valid business 'Γυμναστήριο'", test_valid_business_gymnastirio),
        ("Valid business 'Δικηγορικό γραφείο'", test_valid_business_dikigoriko),
        ("Empty business", test_empty_business),
        ("Whitespace-only business", test_whitespace_business),
        ("Very long business (>120 chars)", test_very_long_business),
        ("Malformed request (missing 'business' key)", test_malformed_request),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            passed = test_func()
            results.append((test_name, passed))
        except Exception as e:
            print(f"\n❌ EXCEPTION in {test_name}: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed_count}/{total_count} tests passed")
    
    if passed_count == total_count:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total_count - passed_count} test(s) failed")
        return 1


if __name__ == "__main__":
    exit(main())
