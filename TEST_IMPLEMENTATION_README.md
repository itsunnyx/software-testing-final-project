# Test Automation - Page Object Model Implementation

## Project Overview
This project implements 5 automated test cases for the Exam Management System using **Playwright** with the **Page Object Model (POM)** pattern.

## Test Cases Implemented

### 1. **[TCS-RDM-001]** - Display Paper Usage Statistics Report
- **Description**: Test displaying paper usage statistics by department
- **Location**: `tests/specs/reports.spec.ts`
- **Steps**:
  1. Navigate to Paper Usage Report
  2. Click Paper Usage Tab
  3. Verify chart is displayed
  4. Verify table is displayed with department data

### 2. **[TCS-RDM-002]** - Filter Paper Usage Statistics
- **Description**: Test filtering statistics by academic year and semester
- **Location**: `tests/specs/reports.spec.ts`
- **Steps**:
  1. Navigate to Paper Usage Report
  2. Apply filter (Year: 2568, Semester: 1)
  3. Verify chart updates
  4. Verify filtered data is displayed

### 3. **[TCS-RDM-004]** - Display Exam Status Report
- **Description**: Test displaying all subjects with exam status
- **Location**: `tests/specs/reports.spec.ts`
- **Steps**:
  1. Navigate to Exam Status Report
  2. Verify subjects table is visible
  3. Verify subject count is greater than 0

### 4. **[TCS-RDM-005]** - Update Exam Status to "Sent"
- **Description**: Test updating exam status for a subject to "sent"
- **Location**: `tests/specs/reports.spec.ts`
- **Steps**:
  1. Navigate to Exam Status Report
  2. Search for subject CPEN101
  3. Update status to "ส่งแล้ว" (Sent)
  4. Click Save
  5. Verify success message

### 5. **[TCS-RDM-010]** - Generate Exam Status Pie Chart
- **Description**: Test generating pie chart for exam status summary
- **Location**: `tests/specs/reports.spec.ts`
- **Steps**:
  1. Navigate to Exam Status Report
  2. Click Generate Chart button
  3. Verify pie chart is displayed

## Project Structure

```
tests/
├── pages/                      # Page Object Classes
│   ├── basePage.ts            # Base class with common functions
│   ├── loginPage.ts           # Login page objects
│   ├── dashboardPage.ts       # Dashboard navigation
│   ├── statisticsPage.ts      # Statistics report page objects
│   └── examStatusPage.ts      # Exam status report page objects
│
├── specs/                      # Test Specifications
│   └── reports.spec.ts        # 5 test cases
│
├── fixtures/                   # Test Data
│   └── testData.ts            # Constants and test data
│
└── playwright.config.ts       # Playwright configuration
```

## Page Object Model (POM)

### BasePage (`basePage.ts`)
Base class containing common methods used across all page objects:
- `goto()` - Navigate to URL
- `click()` - Click element
- `fill()` - Fill input fields
- `getText()` - Get text from element
- `isVisible()` - Check element visibility
- `selectOption()` - Select dropdown option
- `waitForSelector()` - Wait for element
- `expectElementVisible()` - Assert element is visible
- `expectTextInElement()` - Assert text in element

### LoginPage (`loginPage.ts`)
Handles login functionality:
- `login(username, password)` - Login with credentials
- `getErrorMessage()` - Get login error message
- `isErrorDisplayed()` - Check if error is shown

### DashboardPage (`dashboardPage.ts`)
Handles dashboard navigation:
- `navigateToPaperUsageReport()` - Navigate to statistics
- `navigateToExamStatusReport()` - Navigate to exam status
- `navigateToInvigilationReport()` - Navigate to invigilation
- `logout()` - Logout from system

### StatisticsPage (`statisticsPage.ts`)
Handles paper usage statistics:
- `clickTabPaperUsage()` - Click paper usage tab
- `filterByYearAndSemester()` - Apply filters
- `isChartVisible()` - Check chart visibility
- `isTableVisible()` - Check table visibility
- `getNoDataMessage()` - Get no data message
- `getDepartmentCount()` - Count departments

### ExamStatusPage (`examStatusPage.ts`)
Handles exam status management:
- `searchSubject()` - Search for subject
- `findSubjectRow()` - Find subject in table
- `updateSubjectStatusByCode()` - Update status by subject code
- `clickSave()` - Save changes
- `isSuccessMessageDisplayed()` - Check success message
- `clickGenerateChart()` - Generate pie chart
- `isPieChartDisplayed()` - Check chart visibility

## Test Data (`testData.ts`)

Contains centralized test constants:
- **Admin Credentials**: `admin01 / password123`
- **Academic Years**: 2568 (current), 2569 (future)
- **Semesters**: 1 (first), 2 (second)
- **Subject Codes**: CPEN101-CPEN109
- **Status Values**: ส่งแล้ว (sent), ยังไม่ส่ง (not sent), ไม่มีข้อสอบ (no exam)
- **Messages**: Thai language notification messages
- **Timeouts**: Short (3s), Medium (5s), Long (10s)

## How to Run Tests

### Run all tests
```bash
npm test
```

### Run with UI mode
```bash
npm run test:ui
```

### Run in headed mode (visible browser)
```bash
npm run test:headed
```

### View test report
```bash
npm run report
```

### Run specific test file
```bash
npx playwright test tests/specs/reports.spec.ts
```

### Run specific test by name
```bash
npx playwright test --grep "[TCS-RDM-001]"
```

## Configuration

### Playwright Config (`playwright.config.ts`)
- **Base URL**: https://project-superend-cen8.vercel.app
- **Browsers**: Chromium, Firefox, WebKit
- **Reporter**: HTML report
- **Retries**: 0 (local), 2 (CI)
- **Trace**: Enabled on first retry

## Key Features

✅ **Page Object Model** - Separation of concerns between test logic and page interaction
✅ **Reusable Components** - Base page class with common methods
✅ **Type Safety** - Full TypeScript support with strict typing
✅ **Centralized Data** - Test data in single location
✅ **Clear Assertions** - Easy to read test expectations
✅ **Error Handling** - Proper wait states and error checking
✅ **Multi-browser** - Tests run on Chrome, Firefox, and Safari

## Best Practices Used

1. **Single Responsibility** - Each page object handles one feature
2. **DRY Principle** - No code duplication across tests
3. **Clear Naming** - Descriptive method and test names
4. **Implicit Waits** - Proper wait handling for dynamic content
5. **Assertion Messages** - Console logs for test debugging
6. **Timeout Management** - Configurable timeouts for different scenarios

## Test Execution Flow

```
1. BeforeEach Hook
   ├─ Initialize all page objects
   ├─ Navigate to login page
   └─ Login with admin credentials

2. Test Execution
   ├─ Navigate to feature
   ├─ Perform actions
   ├─ Verify results
   └─ Log outcomes

3. AfterEach Hook
   └─ Automatic cleanup (implicit in Playwright)
```

## Debugging Tips

1. **View Test in UI Mode**: `npm run test:ui`
2. **Run with Headed Browser**: `npm run test:headed`
3. **Check HTML Report**: `npm run report`
4. **Enable Traces**: See `trace: 'on-first-retry'` in config
5. **Console Logs**: Tests include console output for debugging

## Maintenance Notes

- Update `TEST_DATA` in `fixtures/testData.ts` if test credentials change
- Adjust selectors in page objects if UI elements change
- Add new page objects for new features
- Keep page objects focused on one feature per file
- Use descriptive selector comments for complex queries

## Future Enhancements

- [ ] Add more page objects for documents, printing features
- [ ] Implement negative test cases
- [ ] Add API testing for Activity Log
- [ ] Create fixtures for database seeding
- [ ] Add performance metrics collection
- [ ] Implement screenshot comparison tests
- [ ] Add accessibility testing
