# 🚀 Dashboard Installation Guide

## ✅ Setup Completed

The following has been automatically configured:

1. ✅ **Dependencies Added** - `recharts` added to package.json
2. ✅ **Route Configured** - Dashboard route added to App.tsx
3. ✅ **Backend URL** - Already configured in axios.ts

---

## 📋 Installation Steps

### Step 1: Install Dependencies

Run this command in your terminal:

```bash
npm install
```

This will install the new dependency:
- **recharts** ^2.10.4 - Chart library for React

All other required packages were already installed:
- @mui/material ✅
- @mui/icons-material ✅
- @emotion/react ✅
- @emotion/styled ✅
- axios ✅
- react-router-dom ✅

### Step 2: Verify Backend URL (Optional)

The backend URL is already configured. If you need to change it:

```typescript
// src/config/axios.ts
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/iaas/api', // ✅ Already set
  timeout: 10000,
});
```

### Step 3: Start Backend Server

Ensure your Spring Boot backend is running:

```bash
# In your iaas backend directory
./mvnw spring-boot:run
```

Verify backend is accessible:
```bash
curl http://localhost:8080/iaas/api/network/flow/dashboard/summary
```

### Step 4: Start Frontend Dev Server

```bash
npm run dev
```

Expected output:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 5: Access Dashboard

Open your browser and navigate to:

```
http://localhost:5173/network/flow/dashboard
```

---

## 🎯 What's Available

### Route Added
```typescript
// Route: /network/flow/dashboard
<Route
  path="network/flow/dashboard"
  element={
    <ProtectedRoute>
      <FlowDashboardPage />
    </ProtectedRoute>
  }
/>
```

### Full URL
```
http://localhost:5173/network/flow/dashboard
```

---

## 🧪 Testing

### 1. Check Dependencies
```bash
npm list recharts
# Should show: recharts@2.10.4
```

### 2. Test Backend Connection
```bash
# Test summary endpoint
curl http://localhost:8080/iaas/api/network/flow/dashboard/summary

# Test pipelines endpoint
curl http://localhost:8080/iaas/api/network/flow/dashboard/pipelines

# Test trends endpoint
curl http://localhost:8080/iaas/api/network/flow/dashboard/trends
```

### 3. Verify Frontend Build
```bash
npm run build
# Should complete without errors
```

---

## ✅ Verification Checklist

- [ ] Run `npm install` - No errors
- [ ] Backend running on port 8080
- [ ] All API endpoints accessible (curl tests pass)
- [ ] Frontend dev server starts (`npm run dev`)
- [ ] Navigate to `/network/flow/dashboard`
- [ ] Dashboard loads without errors
- [ ] Data displays in components
- [ ] Charts render properly
- [ ] Table shows pipeline data
- [ ] No console errors (F12)

---

## 🐛 Troubleshooting

### Issue: `npm install` fails

**Solution**: Clear cache and retry
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Cannot find module 'recharts'"

**Solution**: Ensure recharts is installed
```bash
npm install recharts
```

### Issue: Dashboard shows blank page

**Solution**: Check browser console (F12)
1. Look for import errors
2. Verify all components exist
3. Check network tab for failed API calls

### Issue: CORS errors

**Solution**: Verify backend CORS configuration
```java
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController { ... }
```

### Issue: Data not loading

**Solution**: Check backend connection
```bash
# Test if backend is running
curl http://localhost:8080/iaas/api/network/flow/dashboard/summary

# If fails, start backend
cd ../iaas
./mvnw spring-boot:run
```

---

## 📊 What You'll See

Once successfully installed, the dashboard will display:

### 1. Infrastructure KPIs (Top)
- 4 cards showing: Stations, Terminals, Fields, Pipelines

### 2. Today's Summary
- Total volume and average pressure
- Active pipelines count
- Reading completion status
- Transported vs Estimated comparison

### 3. Variance Analysis
- On Target (green)
- Below Target (red)
- Above Target (orange)
- Offline (gray)

### 4. Charts (Side by Side)
- Volume Comparison Bar Chart (7 days)
- Pressure Trend Line Chart (7 days)

### 5. Monthly Overview
- Month-to-date totals
- Variance percentage
- Days on target

### 6. Pipeline Status Table (Bottom)
- All pipelines with detailed metrics
- Sortable columns
- Search functionality
- Color-coded status indicators

---

## 🔄 Development Workflow

### Daily Development
```bash
# Terminal 1 - Backend
cd iaas
./mvnw spring-boot:run

# Terminal 2 - Frontend
cd iaas-web
npm run dev
```

### Making Changes
1. Edit components in `src/modules/dashboard/components/`
2. Changes auto-reload (hot reload enabled)
3. Check browser console for errors
4. Test functionality

### Building for Production
```bash
npm run build
# Output in dist/ folder
```

---

## 📚 Next Steps

1. **Customize Colors**: Edit `src/modules/dashboard/utils/formatters.ts`
2. **Add More Components**: Create in `src/modules/dashboard/components/`
3. **Extend API**: Add methods to `src/modules/dashboard/services/dashboardService.ts`
4. **Add Navigation**: Update sidebar to link to `/network/flow/dashboard`

---

## 🆘 Support Resources

- **Quick Start**: See DASHBOARD_SETUP.md
- **Integration**: See src/modules/dashboard/INTEGRATION.md
- **Module Docs**: See src/modules/dashboard/README.md
- **Complete Guide**: See DASHBOARD_COMPLETE.md

---

## ✨ Success!

If you can access the dashboard and see data, you're all set! 🎉

**Dashboard URL**: `http://localhost:5173/network/flow/dashboard`

Enjoy monitoring your pipeline flows! 🚀
