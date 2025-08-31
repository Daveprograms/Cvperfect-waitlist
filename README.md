# CVPerfect Waitlist Landing Page

A modern, responsive waitlist landing page for CVPerfect - an AI-powered job hunting assistant. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🎨 **Modern Design**: Clean, dark theme with purple/blue gradient accents
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- ⚡ **Fast Performance**: Built with Next.js 14 and optimized for speed
- 🎭 **Smooth Animations**: Framer Motion animations for enhanced UX
- 📝 **Form Validation**: Email and name validation with error handling
- 🎯 **SEO Optimized**: Proper meta tags and structured content

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Fonts**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cvperfect-waitlist
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cvperfect-waitlist/
├── app/
│   ├── globals.css          # Global styles and Tailwind directives
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page component
├── components/
│   ├── Navbar.tsx           # Navigation bar with mobile menu
│   ├── Hero.tsx             # Hero section with animated background
│   ├── Features.tsx         # Feature highlights section
│   ├── WaitlistForm.tsx     # Email collection form
│   └── Footer.tsx           # Footer with links and social media
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Customization

### Colors
The color scheme can be modified in `tailwind.config.js`. The current theme uses:
- Primary: Purple/Blue gradient
- Background: Dark gray (#111827)
- Text: White and gray variations

### Content
Update the content in each component file:
- `components/Hero.tsx` - Main headline and description
- `components/Features.tsx` - Feature descriptions and icons
- `components/WaitlistForm.tsx` - Form labels and success message
- `components/Footer.tsx` - Links and company information

### Form Integration
The waitlist form is fully functional with:

1. **Email Integration**: Uses Zoho SMTP for email delivery
2. **Data Storage**: Stores signups in `data/waitlist-signups.json` (development)
3. **Duplicate Detection**: Prevents duplicate email signups
4. **Dashboard**: View signups at `/dashboard`
5. **Email Notifications**: Sends confirmation emails to users and notifications to admin

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub or contact the development team. 