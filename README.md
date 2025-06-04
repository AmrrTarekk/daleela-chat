# Daleela Chat

A modern chat application built with Next.js and Firebase.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)

## Getting Started

1. Clone the repository:

```bash
git clone [your-repository-url]
cd daleela-chat
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up Firebase:

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore
   - Copy your Firebase configuration

4. Create a `.env.local` file in the root directory with your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA9meNgd4dNWB91WBne2V0UeCIlgXxmbTU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fir-daleela.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fir-daleela
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fir-daleela.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=59388327197
NEXT_PUBLIC_FIREBASE_APP_ID=1:59388327197:web:2c2259e79482ca5d9a1df4
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
daleela-chat/
├── src/              # Source files
├── public/           # Static files
├── functions/        # Firebase Cloud Functions
├── .next/           # Next.js build output
└── ...
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to Firebase

## Firebase Configuration

The project uses the following Firebase services:

- Authentication
- Firestore Database
- Cloud Functions

Make sure to set up the appropriate security rules in your Firebase Console.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
