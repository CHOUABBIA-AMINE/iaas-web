# Dashboard Module - Setup Guide

## Quick Start

### 1. Install Dependencies

Run the following command to install all required packages:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material recharts axios
```

#### Package Details:

- **@mui/material** (^5.x) - Material-UI component library
- **@emotion/react** (^11.x) - CSS-in-JS styling (MUI peer dependency)
- **@emotion/styled** (^11.x) - Styled components (MUI peer dependency)
- **@mui/icons-material** (^5.x) - Material-UI icons
- **recharts** (^2.x) - Charting library for React
- **axios** (^1.x) - HTTP client for API calls

### 2. Configure Backend URL

Edit `src/config/axios.ts` and update the baseURL:

```typescript
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/iaas/api', // Update this
  timeout: 10000,
});
```

### 3. Add Route to Your App

In your main `App.tsx` or router configuration:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './modules/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### 4. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173/dashboard` (or your dev server URL)

## Backend Requirements

### Ensure Backend is Running

1. Start your Spring Boot backend on port 8080
2. Verify these endpoints are accessible:

```
GET http://localhost:8080/iaas/api/network/flow/dashboard/summary
GET http://localhost:8080/iaas/api/network/flow/dashboard/pipelines
GET http://localhost:8080/iaas/api/network/flow/dashboard/trends
```

### Test Backend Connection

Open browser console and test:

```javascript
fetch('http://localhost:8080/iaas/api/network/flow/dashboard/summary')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Project Structure After Setup

```
iaas-web/
├── src/
│   ├── config/
│   │   └── axios.ts              ✓ Configured
│   ├── modules/
│   │   └── dashboard/            ✓ Complete module
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── pages/
│   │       ├── services/
│   │       ├── types/
│   │       ├── utils/
│   │       └── index.ts
│   └── App.tsx                ✓ Add route here
├── package.json               ✓ Dependencies added
└── DASHBOARD_SETUP.md         ✓ This file
```

## Verification Checklist

- [ ] All npm packages installed
- [ ] Backend URL configured in axios.ts
- [ ] Backend server running on port 8080
- [ ] Route added to App.tsx
- [ ] Development server started
- [ ] Dashboard accessible at /dashboard route
- [ ] Data loading from backend (check browser console)
- [ ] No CORS errors in console
- [ ] Charts rendering properly
- [ ] Table showing pipeline data

## Troubleshooting

### Issue: "Module not found" errors

**Solution**: Ensure all dependencies are installed
```bash
npm install
```

### Issue: CORS errors in browser console

**Solution**: Verify backend has CORS enabled
```java
@CrossOrigin(origins = "*")
public class DashboardController { ... }
```

### Issue: "Cannot GET /dashboard"

**Solution**: 
1. Check route is added in App.tsx
2. Ensure you're using React Router
3. Verify path matches exactly

### Issue: Data not loading / 404 errors

**Solution**:
1. Check backend is running: `curl http://localhost:8080/iaas/api/network/flow/dashboard/summary`
2. Verify axios baseURL is correct
3. Check browser Network tab for failed requests

### Issue: Charts not rendering

**Solution**:
1. Ensure recharts is installed: `npm list recharts`
2. Check console for errors
3. Verify data is being fetched (check hooks)

### Issue: Blank page / White screen

**Solution**:
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify all imports are correct
4. Check React DevTools for component tree

## Development Tips

### Hot Reload
Changes to components will auto-reload in development mode.

### Debug Mode
Add this to see API calls:
```typescript
// In src/config/axios.ts
axiosInstance.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});
```

### Mock Data
For development without backend, add mock data:
```typescript
// In hooks/useDashboardData.ts
const mockData: DashboardSummary = {
  totalStations: 5,
  totalTerminals: 8,
  // ... etc
};
setData(mockData); // Temporarily use mock
```

## Performance Optimization

### Auto-Refresh Interval
Default is 5 minutes. To change:
```typescript
// In hooks/useDashboardData.ts
const interval = setInterval(fetchData, 2 * 60 * 1000); // 2 minutes
```

### Disable Auto-Refresh
```typescript
const { data } = usePipelineStatuses({ autoRefresh: false });
```

## Next Steps

1. **Customize Styling**: Update colors in `utils/formatters.ts`
2. **Add Authentication**: Implement auth tokens in axios.ts
3. **Add More Features**: Extend components as needed
4. **Deploy**: Build for production with `npm run build`

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend connectivity
3. Review component documentation in README.md
4. Check TypeScript types match backend DTOs

---

**Ready to go!** Your dashboard should now be fully functional. 🚀
