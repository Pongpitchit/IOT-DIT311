# 🌱 Smart Home Plant Monitoring System

A modern web application for monitoring and managing smart home plant devices with LINE LIFF integration, built with Next.js 15 and Firebase.

## ✨ Features

- **🌿 Plant Management**: Add, edit, and monitor multiple plants
- **📱 LINE LIFF Integration**: Login with LINE account
- **🔍 Smart Search**: Search plants by name or room
- **📊 Real-time Monitoring**: Track humidity, soil moisture, and fertilizer schedules
- **🎨 Modern UI**: Beautiful interface with shadcn/ui components
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🔥 Firebase Integration**: Real-time data synchronization
- **⚡ TypeScript**: Full type safety and better development experience

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Database**: Firebase Realtime Database
- **Authentication**: LINE LIFF SDK
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Firebase project with Realtime Database
- LINE Developer account (for LIFF integration)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smart-home
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_LIFF_ID=your_liff_id_here

   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Configure Firebase**

   - Create a Firebase project
   - Enable Realtime Database
   - Copy your Firebase config to the environment variables

5. **Set up LINE LIFF**
   - Create a LINE Developer account
   - Create a LIFF app
   - Copy your LIFF ID to the environment variables

## 🏃‍♂️ Getting Started

1. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Login with LINE**
   Click the "Login with LINE" button to authenticate

4. **Start managing your plants**
   - Add plants to your collection
   - Monitor humidity and soil moisture
   - Set fertilizer schedules
   - Organize by categories and rooms

## 📁 Project Structure

```
smart-home/
├── app/
│   ├── api/                    # API routes
│   │   ├── [userId]/
│   │   │   ├── profile/        # User profile endpoints
│   │   │   └── devices/        # Device management endpoints
│   │   └── espDevices/         # ESP device endpoints
│   ├── components/             # React components
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── LiffLogin.tsx          # LINE LIFF login component
├── context/
│   └── LiffContext.tsx        # LIFF context provider
├── lib/
│   ├── firebase.ts            # Firebase configuration
│   └── utils.ts               # Utility functions
├── public/
│   └── images/                # Static images
├── API_DOCUMENTATION.md       # API documentation
└── README.md                  # This file
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📚 API Documentation

The project includes comprehensive API documentation. See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed information about all available endpoints.

### Key API Endpoints

- `GET /api/espDevices` - Get all ESP devices
- `GET /api/[userId]/profile` - Get user profile
- `PUT /api/[userId]/profile` - Update user profile
- `GET /api/[userId]/devices` - Get user's devices
- `GET /api/[userId]/devices/[deviceId]` - Get specific device
- `PUT /api/[userId]/devices/[deviceId]` - Update device settings

## 🎨 UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) for consistent and beautiful UI components:

- **Cards**: Plant display cards
- **Drawers**: Plant detail editing
- **Select**: Category and room selection
- **Sliders**: Humidity and soil moisture controls
- **Input**: Search and text input fields
- **Buttons**: Action buttons with variants

## 🔐 Authentication

The app uses LINE LIFF (LINE Front-end Framework) for authentication:

1. Users login with their LINE account
2. Profile information is automatically retrieved
3. User ID is used for data isolation in Firebase

## 🗄️ Database Schema

### Firebase Realtime Database Structure

```
/
├── devices/                    # Global ESP devices
│   ├── device1/
│   └── device2/
└── [userId]/                   # User-specific data
    ├── profile/                # User profile
    └── devices/                # User's devices
        ├── 1/                  # Device ID 1
        ├── 2/                  # Device ID 2
        └── 3/                  # Device ID 3
```

### Device Data Model

```typescript
interface Device {
  dataDeviceId: number; // Original device ID
  id: string; // Base64 encoded device name
  name: string; // Device/plant name
  room: string; // Location/room
  image: string; // Image URL
  status: "healthy" | "warning" | string; // Device status
  category: string; // Device category
  humidity: number; // Humidity percentage (0-100)
  soilMoisture: number; // Soil moisture percentage (0-100)
  fertilizer: string; // Fertilizer schedule
  userId: string; // Owner user ID
}
```

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Deploy on Other Platforms

The app can be deployed on any platform that supports Next.js:

- **Netlify**: Connect GitHub repository
- **Railway**: Deploy with one click
- **DigitalOcean App Platform**: Container-based deployment
- **AWS Amplify**: Full-stack deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [LINE LIFF](https://developers.line.biz/en/liff/) - LINE Front-end Framework
- [Lucide](https://lucide.dev/) - Beautiful icon library

## 📞 Support

If you have any questions or need help, please:

1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Open an issue on GitHub
3. Contact the development team

---

**Happy Plant Monitoring! 🌱✨**
"# IOT-Home" 
