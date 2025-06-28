# Test Examples for Semantic Compare

## Example 1: JSON Key Reordering (Should be identical)

**Original:**
```json
{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com"
}
```

**Modified:**
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "age": 30
}
```

**Expected Result:** Files are semantically identical (with "Ignore key order" enabled)

## Example 2: YAML Type Coercion (Should be identical)

**Original:**
```yaml
enabled: "true"
port: "8080"
debug: "false"
```

**Modified:**
```yaml
enabled: true
port: 8080
debug: false
```

**Expected Result:** Files are semantically identical (with "Coerce types" enabled)

## Example 3: JSON Value Changes (Should show differences)

**Original:**
```json
{
  "name": "Alice",
  "age": 25,
  "city": "New York"
}
```

**Modified:**
```json
{
  "name": "Alice",
  "age": 26,
  "city": "San Francisco"
}
```

**Expected Result:** Shows differences in age (25 → 26) and city (New York → San Francisco)

## Example 4: XML Attribute Order (Should be identical)

**Original:**
```xml
<user id="123" name="John" active="true">
  <email>john@example.com</email>
</user>
```

**Modified:**
```xml
<user active="true" name="John" id="123">
  <email>john@example.com</email>
</user>
```

**Expected Result:** Files are semantically identical (with "Ignore key order" enabled)

## Example 5: TOML with Ignored Paths

**Original:**
```toml
[user]
name = "John"
timestamp = "2023-01-01T10:00:00Z"

[settings]
theme = "dark"
```

**Modified:**
```toml
[user]
name = "John"
timestamp = "2023-12-01T15:30:00Z"

[settings]
theme = "dark"
```

**Expected Result:** Files are semantically identical (with "user.timestamp" in ignored paths)

## Testing Instructions

1. Copy and paste the examples above into the Original and Modified text areas
2. Set the appropriate format (JSON, YAML, TOML, XML) or use Auto-detect
3. Configure the comparison options as noted in each example
4. Click "Compare" to see the results
5. Verify that the expected results match the actual output

## Auto-Detection Test

Try pasting content without selecting a format to test the auto-detection feature:

- JSON: Should detect based on `{` and `}` brackets
- YAML: Should detect based on indentation and `:` syntax
- TOML: Should detect based on `[section]` headers or `key = value` patterns
- XML: Should detect based on `<` and `>` tags
