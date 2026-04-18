# Quick Start Guide - Test Automation

## ✅ What's Been Implemented

### 5 Complete Test Cases with Page Object Model
Based on the test case CSV file, we've created automated tests for:

1. **[TCS-RDM-001]** Paper Usage Statistics - Display report
2. **[TCS-RDM-002]** Paper Usage Statistics - Filter by year/semester
3. **[TCS-RDM-004]** Exam Status Report - Display all subjects
4. **[TCS-RDM-005]** Exam Status Update - Change status to "sent"
5. **[TCS-RDM-010]** Exam Status Summary - Generate pie chart

## 📁 What Was Created

```
tests/
├── pages/
│   ├── basePage.ts           ← Base class (15+ methods)
│   ├── loginPage.ts          ← Login operations
│   ├── dashboardPage.ts      ← Navigation
│   ├── statisticsPage.ts     ← Statistics reports
│   └── examStatusPage.ts     ← Exam status management
├── specs/
│   └── reports.spec.ts       ← 5 test cases
└── fixtures/
    └── testData.ts           ← Test constants & data

Documentation:
├── TEST_IMPLEMENTATION_README.md   ← Full guide
├── IMPLEMENTATION_SUMMARY.md       ← Overview
├── POM_STRUCTURE.txt               ← Visual structure
└── QUICK_START_GUIDE.md            ← This file
```

## 🚀 How to Run Tests

### Option 1: Run All Tests (Headless)
```bash
npm test
```

### Option 2: Run with Visual UI (Recommended for Debugging)
```bash
npm run test:ui
```

### Option 3: Run with Visible Browser
```bash
npm run test:headed
```

### Option 4: Run Specific Test
```bash
# Run only one test case
npx playwright test --grep "[TCS-RDM-001]"

# Run all TCS-RDM tests
npx playwright test --grep "TCS-RDM"
```

### Option 5: View Test Report
```bash
npm run report
```

## 📋 Test Structure

Each test follows this pattern:

```typescript
1. beforeEach Hook
   ├─ Initialize page objects
   └─ Login with credentials

2. Test Execution
   ├─ Navigate to feature
   ├─ Perform actions
   ├─ Assert results
   └─ Console logs for debugging

3. Cleanup (Automatic)
   └─ Browser closes
```

## 🔑 Key Features

✅ **Page Object Model** - Clean separation between tests and UI
✅ **Reusable Methods** - 42+ methods across all pages
✅ **Type-Safe** - Full TypeScript support
✅ **Centralized Data** - One place for all test constants
✅ **Multi-Browser** - Chrome, Firefox, Safari
✅ **Thai Language** - Full Thai language support
✅ **Error Handling** - Proper wait states and validation

## 🧪 Example Test Case

```typescript
test('[TCS-RDM-005] Update exam status to "sent"', async ({ page }) => {
  // Setup
  await dashboardPage.navigateToExamStatusReport();

  // Execute
  await examStatusPage.updateSubjectStatusByCode(
    'CPEN101',
    'ส่งแล้ว'  // Thai: "sent"
  );
  await examStatusPage.clickSave();

  // Assert
  const isSuccess = await examStatusPage.isSuccessMessageDisplayed();
  expect(isSuccess).toBeTruthy();
});
```

## 📊 Test Data Available

All constants are in `tests/fixtures/testData.ts`:

- **Credentials**: admin01 / password123
- **Subjects**: CPEN101, CPEN102, etc.
- **Years**: 2568, 2569
- **Semesters**: 1, 2
- **Statuses**: ส่งแล้ว, ยังไม่ส่ง, ไม่มีข้อสอบ
- **Messages**: All in Thai language

## 🔧 Configuration

- **Base URL**: https://project-superend-cen8.vercel.app
- **Timeout**: Default 30 seconds
- **Retries**: 0 locally, 2 on CI
- **Reporter**: HTML report

## 📖 For More Details

- Full documentation: Read `TEST_IMPLEMENTATION_README.md`
- Visual structure: See `POM_STRUCTURE.txt`
- Implementation details: Check `IMPLEMENTATION_SUMMARY.md`

## ⚡ Common Commands

```bash
# Run tests
npm test

# Run with UI (visual mode)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Run specific test
npx playwright test --grep "[TCS-RDM-001]"

# Debug mode
npx playwright test --debug

# View report
npm run report
```

## 🐛 Debugging Tips

1. **Use UI Mode**: `npm run test:ui` - Step through tests visually
2. **Check Console**: Tests log output for debugging
3. **Use headed mode**: `npm run test:headed` - See browser actions
4. **Screenshot**: Page objects support `.screenshot()`
5. **Traces**: Enabled on retry - view in report

## ✨ What Makes This Implementation Great

- **Maintainable**: Easy to update selectors or add new tests
- **Readable**: Clear test descriptions in English
- **Reusable**: Methods work across multiple tests
- **Scalable**: Add new page objects easily
- **Professional**: Follows Playwright best practices
- **Documented**: Comprehensive guides included

## 🎯 Next Steps

1. Run the tests: `npm test`
2. View results: `npm run report`
3. Modify TEST_DATA if credentials change
4. Add new tests using existing page objects
5. Update selectors if UI changes

---

**Status**: ✅ Ready to run
**Tests**: 5 complete
**Coverage**: Core reporting features
**Pattern**: Page Object Model
**Language**: TypeScript + Thai UI text
