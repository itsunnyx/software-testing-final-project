# Test Fixtures Directory

This directory contains test data files for import management test cases.

## Files

### exam_valid.csv
Valid exam table data with complete information:
- Course ID, Course Name, Exam Date, Start Time, End Time, Room Number
- 5 sample courses (SC101-SC105)
- **Used in**: TC-AUTO-001, TC-AUTO-003, TC-AUTO-004, TC-AUTO-005

### exam_invalid.pdf
Invalid file format for testing file validation:
- Plain text file with .pdf extension
- **Used in**: TC-AUTO-002 to verify the system rejects non-Excel/CSV files

## Converting to Excel Format

If your system requires .xlsx format, convert the CSV files using:

```bash
# Using Node.js with xlsx library
npm install xlsx

# Or use online converter or Excel itself
```

Or modify the test to accept CSV format based on your application's capabilities.

## Notes

- Test data files can be edited to match your actual system structure
- Update field names and sample data as needed for your application
- Add more test cases as required for comprehensive coverage
