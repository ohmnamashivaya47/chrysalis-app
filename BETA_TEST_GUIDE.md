# CHRYSALIS BETA TEST GUIDE
**Real-Time Social Meditation Testing**

## WHAT WE'RE TESTING (PRIORITY)

### **1. REAL-TIME LEADERBOARD**
- **Goal**: See live updates when someone completes meditation
- **Test**: Have 2-3 people meditate simultaneously
- **Expected**: Leaderboard updates INSTANTLY across all devices

### **2. QR CODE CONNECTIONS**
- **Goal**: Connect friends via QR scanning
- **Test**: Generate QR code → friend scans → instant connection
- **Expected**: Both users get notified immediately

### **3. LIVE SOCIAL FEED**
- **Goal**: Real-time posts and interactions
- **Test**: Post meditation updates → friends see instantly
- **Expected**: No refresh needed, updates appear live

---

##  **QUICK START TESTING**

### **STEP 1: Get the App**
1. Visit: `https://ohmnamashivaya47.netlify.app`
2. Add to home screen (iOS: Share → Add to Home Screen)
3. Create account with simple email/username

### **STEP 2: Real-Time Leaderboard Test**
1. Complete a quick 1-2 minute meditation
2. Check leaderboard position
3. Have friend do the same
4. **WATCH**: Rankings update without refresh!

### **STEP 3: QR Connection Test**
1. Go to Profile → Show QR Code
2. Have friend scan your QR code
3. **WATCH**: Instant friend connection notification
4. Try group QR codes too!

### **STEP 4: Social Feed Test**
1. Post about your meditation experience
2. Like/comment on friend's posts
3. **WATCH**: Real-time notifications and updates

---

## 🐛 **WHAT TO REPORT**

### **CRITICAL ISSUES** 
- Leaderboard doesn't update in real-time
- QR codes don't scan properly
- Social notifications don't appear
- App crashes or freezes

### **MINOR ISSUES** ⚠️
- Slow loading times
- UI/UX confusion
- Missing features
- Visual bugs

### **FEEDBACK FORMAT**
```
DEVICE: iPhone 14 Pro / Android Pixel 7 / etc.
BROWSER: Safari / Chrome / App mode
ISSUE: [Describe what happened]
EXPECTED: [What should have happened]
STEPS: [How to reproduce]
```

---

##  **TEST SCENARIOS**

### **Scenario A: Live Competition**
1. 3 users start meditation at same time
2. One finishes early → check leaderboard updates
3. Others finish → verify final rankings
4. **Focus**: Real-time competition feeling

### **Scenario B: Friend Discovery**
1. User A shares QR code via text/WhatsApp
2. User B scans from photo/screen
3. Both check friend lists
4. **Focus**: Easy friend connection

### **Scenario C: Social Engagement**
1. User posts meditation milestone
2. Friends see notification immediately
3. Friends like/comment in real-time
4. **Focus**: Instant social feedback

---

##  **SUCCESS CRITERIA**

### **MUST WORK** 
- [x] Real-time leaderboard updates (< 3 seconds)
- [x] QR code scanning between any devices
- [x] Instant friend connection notifications
- [x] Live social feed updates
- [x] Cross-device synchronization

### **NICE TO HAVE** 
- Fast loading (< 2 seconds)
- Smooth animations
- Intuitive navigation
- Offline functionality

---

## 📞 **SUPPORT & FEEDBACK**

### **How to Report Issues**
- **Text/WhatsApp**: Share screenshots + description
- **Email**: Include device info + steps to reproduce
- **Priority**: Real-time features > UI issues > nice-to-haves

### **Testing Timeline**
- **Day 1-2**: Core functionality testing
- **Day 3-4**: Stress testing with multiple users
- **Day 5-7**: Polish and refinement

---

##  **WHY THIS MATTERS**

**Chrysalis isn't just another meditation app** - it's about **real community connection** and **live spiritual growth together**.

The QR codes and real-time leaderboard create **instant bonds** between meditators, making enlightenment a **shared journey** rather than a solo practice.

**Your testing helps ensure these connections work flawlessly when we launch to the world.**

---

**Let's build something that truly connects souls through meditation.** ‍♀️‍♂️

*Test with intention. Report with compassion. Connect with purpose.*
