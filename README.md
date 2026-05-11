# MyPortfolio

Personal portfolio website showcasing my projects, skills, and experience.

**Live:** [jeffli.xyz](https://www.jeffli.xyz/)

## Tech Stack

- **Frontend:** React.js, React Router, React Bootstrap
- **Backend:** AWS Lambda (Node.js), API Gateway
- **Database:** MongoDB Atlas
- **Storage:** AWS S3 (project images)
- **Hosting:** AWS Amplify
- **CI/CD:** GitHub Actions (auto-deploy Lambda on push)

## Features

- Responsive single-page portfolio with animated banner
- Project showcase with dynamic pagination (6 per page, 3 tabs)
- Project detail pages with tech stack, outcomes, and image carousel
- Contact form (sends email via Nodemailer)
- Admin panel (hidden entry, password-protected):
  - Add / edit / delete projects
  - Drag-and-drop project reordering
  - Image upload to S3 with presigned URLs
  - Rate-limited authentication

## Project Structure

```
├── myportfolio/          # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── assets/       # Fonts, images, icons
│   │   └── App.css       # Global styles
│   └── public/
├── lambda/               # AWS Lambda function
│   └── index.mjs         # API handler (email, projects, auth, upload)
├── database/             # Database utilities
│   └── insertProject.py  # CLI tool for inserting projects
└── .github/workflows/    # CI/CD
    ├── deploy-lambda.yml # Auto-deploy Lambda on push to main
    └── keep-alive.yml    # Weekly MongoDB ping
```

## Local Development

```bash
cd myportfolio
npm install
npm start
```

Frontend runs at `http://localhost:3000` and calls the production API.

## Deployment

- **Frontend:** Pushes to `main` auto-deploy via AWS Amplify
- **Lambda:** Pushes to `main` with changes in `lambda/` trigger GitHub Actions deployment

## License

All rights reserved. © Jeff Li
